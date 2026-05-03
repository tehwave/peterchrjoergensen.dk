import { NETWORK, SIMULATION } from "./constants";
import { InputTracker } from "./input";
import { PeerNetwork } from "./network";
import { packFlow, packInput, packState, parseProtocolMessage } from "./protocol";
import { MatchRenderer } from "./renderer";
import { applyPlayerInput, createInitialMatchState, snapshotState, startMatch, stateFromPayload, stepHostSimulation, advanceScoredPause } from "./simulation";
import type { BrowserMultiplayerDom, FlowMessage, MatchState, PlayerInput, PlayerRole, Teardown } from "./types";
import { setupWaveLifecycle } from "../../wave-lifecycle";

const scopeKey = "browser-multiplayer";
let lifecycleRegistered = false;

/** Register once with the shared Astro lifecycle helper so view transitions do not duplicate loops. */
export function initBrowserMultiplayer(): void {
  if (lifecycleRegistered) return;
  lifecycleRegistered = true;
  setupWaveLifecycle({ scopeKey, init: mountBrowserMultiplayer });
}

function mountBrowserMultiplayer(): Teardown | void {
  const root = document.querySelector("[data-browser-multiplayer-root]");
  if (!(root instanceof HTMLElement)) return;

  const controller = new BrowserMultiplayerController(getDom(root));
  void controller.mount();
  return () => controller.destroy();
}

/**
 * Coordinates UI, networking, simulation, input, and rendering. It intentionally
 * keeps authority decisions here instead of inside renderer/network modules.
 */
class BrowserMultiplayerController {
  private readonly dom: BrowserMultiplayerDom;
  private readonly teardowns: Teardown[] = [];
  private role: PlayerRole | null = null;
  private state: MatchState = createInitialMatchState();
  private latestRemoteState: MatchState | null = null;
  private renderer: MatchRenderer | null = null;
  private input: InputTracker | null = null;
  private network: PeerNetwork;
  private frameId = 0;
  private lastFrameAt = performance.now();
  private accumulatorMs = 0;
  private stateSendAccumulatorMs = 0;
  private inputSendAccumulatorMs = 0;
  private connected = false;
  private destroyed = false;
  private lastRenderedRoundState = "";

  constructor(dom: BrowserMultiplayerDom) {
    this.dom = dom;
    this.network = new PeerNetwork({
      onOpen: () => this.handleNetworkOpen(),
      onMessage: (data) => this.handleNetworkMessage(data),
      onClose: (reason) => this.handleDisconnect(reason),
      onStatus: (message) => this.setStatus(message),
    });
  }

  async mount(): Promise<void> {
    this.bindUi();
    this.setStatus("Choose whether to host a new match or join a friend's game.");
    this.updateScore(this.state);
    this.renderPanels("choice");
    this.frameId = window.requestAnimationFrame((time) => this.frame(time));
  }

  destroy(): void {
    this.destroyed = true;
    window.cancelAnimationFrame(this.frameId);
    this.teardowns.splice(0).forEach((teardown) => teardown());
    this.input?.destroy();
    this.renderer?.destroy();
    this.network.destroy();
  }

  private bindUi(): void {
    this.dom.createButtons.forEach(btn => this.on(btn, "click", () => void this.createHostInvite()));
    this.dom.joinButtons.forEach(btn => this.on(btn, "click", () => {
      this.role = "client";
      void this.ensureRenderer("client");
      this.renderPanels("client");
      this.setStatus("Paste the invite code from the host.");
    }));
    
    // Disable/enable submit buttons based on input
    this.on(this.dom.answerInput, "input", () => {
      this.dom.acceptAnswerButton.disabled = this.dom.answerInput.value.trim() === "";
    });
    this.on(this.dom.offerInput, "input", () => {
      this.dom.createAnswerButton.disabled = this.dom.offerInput.value.trim() === "";
    });

    this.on(this.dom.createAnswerButton, "click", () => void this.createClientAnswer());
    this.on(this.dom.acceptAnswerButton, "click", () => void this.acceptAnswer());
    this.on(this.dom.shareOfferButton, "click", () => void this.shareCode("Game invite", this.dom.offerOutput.value));
    this.on(this.dom.shareAnswerButton, "click", () => void this.shareCode("Game reply", this.dom.answerOutput.value));
    this.on(this.dom.copyOfferButton, "click", () => void this.copyCode(this.dom.offerOutput.value));
    this.on(this.dom.copyAnswerButton, "click", () => void this.copyCode(this.dom.answerOutput.value));
    this.on(this.dom.rematchButton, "click", () => this.requestRematch());
    this.on(this.dom.resetButton, "click", () => this.resetConnection());
    this.on(this.dom.backButton, "click", () => {
      // If we're inside a setup panel, go back to the choice panel
      if (!this.dom.hostPanel.hidden || !this.dom.clientPanel.hidden) {
        this.resetConnection(true);
        return;
      }
      
      // Otherwise go back to previous page
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.assign("/");
    });

    const handleVisibility = () => {
      if (!document.hidden || !this.connected || !this.role) return;
      // Manual peer matches have no arbiter. Treat hiding/leaving the page as a
      // forfeit so the remaining player gets a clear end state.
      this.sendFlow({ v: 1, type: "forfeit", role: this.role, message: "Opponent Fled - You Win" });
      this.handleDisconnect("You left the match. That counts as a forfeit.");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    this.teardowns.push(() => document.removeEventListener("visibilitychange", handleVisibility));
  }

  private async createHostInvite(): Promise<void> {
    try {
      this.role = "host";
      await this.ensureRenderer("host");
      this.renderPanels("host");
      this.dom.offerOutput.value = "Generating...";
      this.setBusy(true);
      this.setStatus("Generating invite code. Keep this tab open.");
      const offer = await this.network.createHostOffer();
      this.dom.offerOutput.value = offer;
      this.setStatus("Invite ready. Send it, then paste the reply here.");
    } catch (error) {
      this.showError(error);
      this.resetConnection(false);
    } finally {
      this.setBusy(false);
    }
  }

  private async createClientAnswer(): Promise<void> {
    try {
      this.role = "client";
      await this.ensureRenderer("client");
      this.dom.answerOutput.value = "Generating...";
      this.setBusy(true);
      this.setStatus("Generating reply to the invite...");
      const answer = await this.network.createClientAnswer(this.dom.offerInput.value);
      this.dom.answerOutput.value = answer;
      this.setStatus("Reply ready. Send it back to the host, then wait for the match.");
    } catch (error) {
      this.showError(error);
    } finally {
      this.setBusy(false);
    }
  }

  private async acceptAnswer(): Promise<void> {
    try {
      this.setBusy(true);
      await this.network.acceptClientAnswer(this.dom.answerInput.value);
    } catch (error) {
      this.showError(error);
    } finally {
      this.setBusy(false);
    }
  }

  private handleNetworkOpen(): void {
    if (!this.role) return;
    this.connected = true;
    this.renderPanels("connected");
    this.setStatus(this.role === "host" ? "Connected. Match starts now." : "Connected. Waiting for the host serve.");
    this.setupInput(this.role);

    if (this.role === "host") {
      // Host authority starts only after the unreliable data channel is open.
      startMatch(this.state);
      this.sendFlow({ v: 1, type: "countdown", role: "host", tick: this.state.tick });
      this.network.send(packState(snapshotState(this.state)));
    }
  }

  private handleNetworkMessage(data: unknown): void {
    if (typeof data === "string") {
      this.handleStringMessage(data);
      return;
    }

    const parsed = parseProtocolMessage(data);
    if (!parsed) return;

    if (parsed.kind === "input" && this.role === "host") {
      // Client input is advisory; the host clamps and simulates the authoritative result.
      applyPlayerInput(this.state, parsed.input);
      return;
    }

    if (parsed.kind === "state" && this.role === "client") {
      // Clients render host snapshots and only predict their own paddle locally.
      this.latestRemoteState = stateFromPayload(parsed.state);
      this.updateScore(this.latestRemoteState);
      this.updateStatusFromState(this.latestRemoteState);
      return;
    }

    if (parsed.kind === "flow") {
      this.handleFlow(parsed.flow);
    }
  }

  private handleStringMessage(data: string): void {
    try {
      const flow = JSON.parse(data) as FlowMessage;
      if (flow.v === 1) this.handleFlow(flow);
    } catch {
      // Ignore untrusted text frames.
    }
  }

  private handleFlow(flow: FlowMessage): void {
    if (flow.type === "rematch-request" && this.role === "host") {
      startMatch(this.state);
      this.sendFlow({ v: 1, type: "rematch-accept", role: "host", tick: this.state.tick });
      this.setStatus("Rematch accepted. Starting again.");
      return;
    }

    if (flow.type === "rematch-accept" && this.role === "client") {
      this.setStatus("Rematch accepted. Get ready.");
      return;
    }

    if (flow.type === "disconnect" || flow.type === "forfeit") {
      this.handleDisconnect(flow.message ?? "Opponent Fled - You Win");
    }
  }

  private frame(time: number): void {
    if (this.destroyed) return;
    const deltaMs = Math.min(SIMULATION.maxFrameMs, time - this.lastFrameAt);
    const deltaSeconds = deltaMs / 1000;
    this.lastFrameAt = time;

    // The frame loop is shared, but only the host advances the game simulation.
    if (this.role === "host" && this.connected) this.stepHost(deltaMs);
    if (this.role === "client" && this.connected) this.stepClient(deltaMs);

    const renderState = this.role === "client" ? this.getClientRenderState() : this.state;
    if (this.renderer) {
      this.applyLocalPrediction(renderState);
      this.renderer.render(renderState, deltaSeconds);
      this.updateScore(renderState);
      this.updateOverlay(renderState);
    }

    this.frameId = window.requestAnimationFrame((nextTime) => this.frame(nextTime));
  }

  private stepHost(deltaMs: number): void {
    if (this.input) applyPlayerInput(this.state, this.input.getCurrentInput());

    this.accumulatorMs += deltaMs;
    while (this.accumulatorMs >= SIMULATION.fixedStepMs) {
      // Fixed slices keep collision behavior consistent even if requestAnimationFrame jitters.
      const scoredBy = stepHostSimulation(this.state, SIMULATION.fixedStepMs);
      advanceScoredPause(this.state, SIMULATION.fixedStepMs);
      if (scoredBy) {
        this.sendFlow({ v: 1, type: this.state.roundState === "gameover" ? "gameover" : "scored", role: scoredBy, tick: this.state.tick });
      }
      this.accumulatorMs -= SIMULATION.fixedStepMs;
    }

    this.stateSendAccumulatorMs += deltaMs;
    if (this.stateSendAccumulatorMs >= 1000 / NETWORK.stateHz) {
      this.stateSendAccumulatorMs = 0;
      // Send snapshots below simulation rate to reduce bandwidth and mobile CPU pressure.
      this.network.send(packState(snapshotState(this.state)));
    }

    this.updateStatusFromState(this.state);
  }

  private stepClient(deltaMs: number): void {
    if (!this.input) return;
    this.inputSendAccumulatorMs += deltaMs;
    if (this.inputSendAccumulatorMs < 1000 / NETWORK.inputHz) return;
    this.inputSendAccumulatorMs = 0;
    this.network.send(packInput(this.input.getCurrentInput()));
  }

  private getClientRenderState(): MatchState {
    return this.latestRemoteState ?? this.state;
  }

  private applyLocalPrediction(state: MatchState): void {
    if (!this.input || !this.role) return;
    // This mutates the render copy only. It hides network latency for the local paddle
    // while the puck and opponent still come from host-authoritative snapshots.
    const localInput = this.input.getCurrentInput();
    const paddle = this.role === "host" ? state.hostPaddle : state.clientPaddle;
    paddle.x = localInput.paddleX;
    paddle.vx = localInput.paddleVx;
  }

  private setupInput(role: PlayerRole): void {
    this.input?.destroy();
    this.input = new InputTracker({
      element: this.dom.touchZone,
      role,
      getTick: () => this.state.tick,
      onInput: (input: PlayerInput) => {
        if (this.role === "host") applyPlayerInput(this.state, input);
      },
    });
  }

  private async ensureRenderer(role: PlayerRole): Promise<void> {
    if (this.renderer) return;
    this.renderer = await MatchRenderer.create(this.dom.stage, role);
  }

  private requestRematch(): void {
    if (!this.connected || !this.role) return;
    if (this.role === "host") {
      startMatch(this.state);
      this.sendFlow({ v: 1, type: "rematch-accept", role: "host", tick: this.state.tick });
      this.setStatus("Rematch started.");
      return;
    }
    this.sendFlow({ v: 1, type: "rematch-request", role: "client" });
    this.setStatus("Rematch requested. Waiting for the host.");
  }

  private sendFlow(flow: FlowMessage): void {
    this.network.send(packFlow(flow));
  }

  private resetConnection(resetUi = true): void {
    this.connected = false;
    // Destroy the peer entirely; half-reset WebRTC state is easy to strand during manual signaling.
    this.network.destroy();
    this.input?.destroy();
    this.input = null;
    this.state = createInitialMatchState();
    this.latestRemoteState = null;
    this.role = null;
    this.dom.offerInput.value = "";
    this.dom.offerOutput.value = "";
    this.dom.answerInput.value = "";
    this.dom.answerOutput.value = "";
    this.dom.acceptAnswerButton.disabled = true;
    this.dom.createAnswerButton.disabled = true;
    if (resetUi) {
      this.renderPanels("choice");
      this.setStatus("Choose whether to host a new match or join a friend's game.");
    }
  }

  private handleDisconnect(reason: string): void {
    this.connected = false;
    this.state.roundState = "disconnected";
    this.latestRemoteState = null;
    this.setStatus(reason);
    this.dom.overlay.textContent = reason;
    this.dom.overlay.hidden = false;
    this.renderPanels("choice");
  }

  private updateStatusFromState(state: MatchState): void {
    if (state.roundState === this.lastRenderedRoundState) return;
    this.lastRenderedRoundState = state.roundState;
    if (state.roundState === "countdown") this.setStatus("Get ready.");
    if (state.roundState === "playing") this.setStatus("Playing.");
    if (state.roundState === "scored" && state.lastScoredBy) this.setStatus(`${state.lastScoredBy === "host" ? "Host" : "Client"} scored.`);
    if (state.roundState === "gameover" && state.winner) this.setStatus(`${state.winner === this.role ? "You win" : "You lose"}`);
  }

  private updateOverlay(state: MatchState): void {
    if (state.roundState === "countdown") {
      const seconds = Math.ceil(state.countdownMs / 800);
      this.dom.overlay.textContent = seconds <= 0 ? "GO" : String(seconds);
      this.dom.overlay.hidden = false;
      return;
    }

    if (state.roundState === "gameover") {
      this.dom.overlay.textContent = state.winner === this.role ? "YOU WIN" : "YOU LOSE";
      this.dom.overlay.hidden = false;
      return;
    }

    if (state.roundState === "disconnected") {
      this.dom.overlay.hidden = false;
      return;
    }

    this.dom.overlay.hidden = true;
  }

  private updateScore(state: MatchState): void {
    this.dom.scoreHost.textContent = String(state.scores.host);
    this.dom.scoreClient.textContent = String(state.scores.client);
    this.dom.hostLabel.textContent = this.role === "host" ? "You" : "Opponent";
    this.dom.clientLabel.textContent = this.role === "client" ? "You" : "Opponent";
    
    // Only show scoreboard during round breaks/restarts
    const isOverlayingHUD = state.roundState === "playing" || state.roundState === "handshake";
    this.dom.scoreboard.hidden = isOverlayingHUD;

    // Show rematch button only during gameover
    this.dom.rematchButton.hidden = state.roundState !== "gameover";

    // Toggle the status bubbles during gameplay to unblock the view
    this.dom.statusNodes.forEach(node => {
      if (node.classList.contains("browser-multiplayer__status")) {
        node.hidden = isOverlayingHUD;
      }
    });
  }

  private renderPanels(panel: "choice" | "host" | "client" | "connected"): void {
    this.dom.handshake.hidden = panel === "connected";
    this.dom.game.hidden = panel !== "connected";
    this.dom.choicePanel.hidden = panel !== "choice";
    this.dom.hostPanel.hidden = panel !== "host";
    this.dom.clientPanel.hidden = panel !== "client";
    this.dom.connectedPanel.hidden = panel !== "connected";
    
    // Manage top actions: "connected" has rematch/disconnect, choice is empty so hidden
    this.dom.topActions.hidden = panel === "choice";
    
    this.dom.resetButton.hidden = panel === "choice"; // Disconnect button is hidden on choice panel
  }

  private setStatus(message: string): void {
    this.dom.statusNodes.forEach(node => node.textContent = message)// this.dom.status.textContent = message;
  }

  private showError(error: unknown): void {
    this.setStatus(error instanceof Error ? error.message : "Something went wrong. Start a fresh connection.");
  }

  private setBusy(isBusy: boolean): void {
    [...this.dom.createButtons, ...this.dom.joinButtons, this.dom.createAnswerButton, this.dom.acceptAnswerButton].forEach((button) => {
      button.disabled = isBusy;
    });
    this.dom.root.classList.toggle("browser-multiplayer--busy", isBusy);
  }

  private async shareCode(title: string, code: string): Promise<void> {
    if (!code) return;
    const shareData: ShareData = { title, text: code };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fall back to copy below.
      }
    }
    await this.copyCode(code);
  }

  private async copyCode(code: string): Promise<void> {
    if (!code) return;
    await navigator.clipboard?.writeText(code);
    this.setStatus("Code copied.");
  }

  private on<T extends keyof HTMLElementEventMap>(element: HTMLElement, event: T, handler: (event: HTMLElementEventMap[T]) => void): void {
    element.addEventListener(event, handler);
    this.teardowns.push(() => element.removeEventListener(event, handler));
  }
}

function getDom(root: HTMLElement): BrowserMultiplayerDom {
  // Centralized lookup documents the required page markup and fails during mount
  // instead of producing null-reference bugs later in a match.
  return {
    root,
    stage: getElement(root, "[data-browser-multiplayer-stage]", HTMLElement),
    statusNodes: Array.from(root.querySelectorAll<HTMLElement>("[data-browser-multiplayer-status]")), // status: getElement(root, "[data-browser-multiplayer-status]", HTMLElement),
    overlay: getElement(root, "[data-browser-multiplayer-overlay]", HTMLElement),
    scoreboard: getElement(root, ".browser-multiplayer__scoreboard", HTMLElement),
    scoreHost: getElement(root, "[data-browser-multiplayer-score='host']", HTMLElement),
    scoreClient: getElement(root, "[data-browser-multiplayer-score='client']", HTMLElement),
    hostLabel: getElement(root, "[data-browser-multiplayer-label='host']", HTMLElement),
    clientLabel: getElement(root, "[data-browser-multiplayer-label='client']", HTMLElement),
    handshake: getElement(root, "[data-browser-multiplayer-handshake]", HTMLElement),
    game: getElement(root, "[data-browser-multiplayer-game]", HTMLElement),
    choicePanel: getElement(root, "[data-browser-multiplayer-panel='choice']", HTMLElement),
    hostPanel: getElement(root, "[data-browser-multiplayer-panel='host']", HTMLElement),
    clientPanel: getElement(root, "[data-browser-multiplayer-panel='client']", HTMLElement),
    connectedPanel: getElement(root, "[data-browser-multiplayer-panel='connected']", HTMLElement),
    topActions: getElement(root, "[data-browser-multiplayer-top-actions]", HTMLElement),
    createButtons: Array.from(root.querySelectorAll<HTMLButtonElement>("[data-browser-multiplayer-action='create']")),
    joinButtons: Array.from(root.querySelectorAll<HTMLButtonElement>("[data-browser-multiplayer-action='join']")),
    resetButton: getElement(root, "[data-browser-multiplayer-action='reset']", HTMLButtonElement),
    offerOutput: getElement(root, "[data-browser-multiplayer-offer-output]", HTMLInputElement),
    offerInput: getElement(root, "[data-browser-multiplayer-offer-input]", HTMLInputElement),
    answerOutput: getElement(root, "[data-browser-multiplayer-answer-output]", HTMLInputElement),
    answerInput: getElement(root, "[data-browser-multiplayer-answer-input]", HTMLInputElement),
    acceptAnswerButton: getElement(root, "[data-browser-multiplayer-action='accept-answer']", HTMLButtonElement),
    createAnswerButton: getElement(root, "[data-browser-multiplayer-action='create-answer']", HTMLButtonElement),
    shareOfferButton: getElement(root, "[data-browser-multiplayer-action='share-offer']", HTMLButtonElement),
    shareAnswerButton: getElement(root, "[data-browser-multiplayer-action='share-answer']", HTMLButtonElement),
    copyOfferButton: getElement(root, "[data-browser-multiplayer-action='copy-offer']", HTMLButtonElement),
    copyAnswerButton: getElement(root, "[data-browser-multiplayer-action='copy-answer']", HTMLButtonElement),
    rematchButton: getElement(root, "[data-browser-multiplayer-action='rematch']", HTMLButtonElement),
    touchZone: getElement(root, "[data-browser-multiplayer-touch]", HTMLElement),
    backButton: getElement(root, "[data-browser-multiplayer-back]", HTMLButtonElement),
  };
}

function getElement<T extends HTMLElement>(root: HTMLElement, selector: string, constructor: new () => T): T {
  const element = root.querySelector(selector);
  if (!(element instanceof constructor)) {
    throw new Error(`Browser multiplayer mount point is missing: ${selector}`);
  }
  return element;
}
