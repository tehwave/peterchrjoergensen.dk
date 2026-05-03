import { NETWORK } from "./constants";
import { createHandshakeEnvelope, decodeHandshake, encodeHandshake } from "./handshake";
import type { PlayerRole, Teardown } from "./types";

interface NetworkCallbacks {
  onOpen: () => void;
  onMessage: (data: unknown) => void;
  onClose: (reason: string) => void;
  onStatus: (message: string) => void;
}

/**
 * Thin WebRTC wrapper for the manual-offer flow. The controller owns game state;
 * this class only owns peer/channel lifecycle and converts SDP to shareable codes.
 */
export class PeerNetwork {
  private peer: RTCPeerConnection | null = null;
  private channel: RTCDataChannel | null = null;
  private readonly callbacks: NetworkCallbacks;
  private readonly teardowns: Teardown[] = [];
  private closed = false;

  constructor(callbacks: NetworkCallbacks) {
    this.callbacks = callbacks;
  }

  async createHostOffer(): Promise<string> {
    this.ensureSupported();
    // A fresh `RTCPeerConnection` is easier to reason about than trying to reuse a
    // partially connected one after failed or stale handshakes.
    this.destroy();
    this.closed = false;
    const peer = this.createPeer();
    const channel = peer.createDataChannel(NETWORK.channelLabel, {
      // Fast-paced paddle input should prefer current packets over reliable delivery.
      ordered: false,
      maxRetransmits: 0,
    });
    this.peer = peer;
    this.attachChannel(channel);

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    // Manual signaling has no trickle-ICE channel, so wait for gathered candidates
    // before serializing the offer into the invite code.
    await waitForIceGathering(peer);

    if (!peer.localDescription) throw new Error("Could not create an invite on this browser.");
    return encodeHandshake(createHandshakeEnvelope("offer", peer.localDescription.toJSON()));
  }

  async acceptClientAnswer(answerCode: string): Promise<void> {
    if (!this.peer) throw new Error("Create an invite before pasting a reply.");
    const answer = await decodeHandshake(answerCode, "answer");
    await this.peer.setRemoteDescription(answer.sdp);
    this.callbacks.onStatus("Reply accepted. Waiting for the connection to open.");
  }

  async createClientAnswer(offerCode: string): Promise<string> {
    this.ensureSupported();
    this.destroy();
    this.closed = false;
    const offer = await decodeHandshake(offerCode, "offer");
    const peer = this.createPeer();
    this.peer = peer;

    peer.addEventListener("datachannel", (event) => {
      this.attachChannel(event.channel);
    });

    await peer.setRemoteDescription(offer.sdp);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    // Same non-trickle constraint as the host: the answer code must contain all ICE candidates.
    await waitForIceGathering(peer);

    if (!peer.localDescription) throw new Error("Could not create a reply on this browser.");
    return encodeHandshake(createHandshakeEnvelope("answer", peer.localDescription.toJSON()));
  }

  send(data: ArrayBuffer): void {
    if (this.channel?.readyState !== "open") return;
    this.channel.send(data);
  }

  sendText(data: string): void {
    if (this.channel?.readyState !== "open") return;
    this.channel.send(data);
  }

  disconnect(role: PlayerRole): void {
    this.sendText(JSON.stringify({ v: 1, type: "disconnect", role }));
    this.destroy();
  }

  destroy(): void {
    this.closed = true;
    this.teardowns.splice(0).forEach((teardown) => teardown());
    this.channel?.close();
    this.peer?.close();
    this.channel = null;
    this.peer = null;
  }

  private ensureSupported(): void {
    if (!("RTCPeerConnection" in window)) {
      throw new Error("This browser does not support peer-to-peer connections.");
    }
  }

  private createPeer(): RTCPeerConnection {
    const peer = new RTCPeerConnection({ iceServers: [...NETWORK.iceServers] });

    const handleStateChange = () => {
      const state = peer.connectionState;
      if (state === "connected") {
        this.callbacks.onStatus("Connected. Starting match.");
      }
      if ((state === "failed" || state === "closed" || state === "disconnected") && !this.closed) {
        this.callbacks.onClose("The connection was lost.");
      }
    };

    peer.addEventListener("connectionstatechange", handleStateChange);
    this.teardowns.push(() => peer.removeEventListener("connectionstatechange", handleStateChange));
    return peer;
  }

  private attachChannel(channel: RTCDataChannel): void {
    this.channel = channel;
    // Binary messages stay as ArrayBuffers so protocol parsing can use DataView directly.
    channel.binaryType = "arraybuffer";

    const handleOpen = () => this.callbacks.onOpen();
    const handleMessage = (event: MessageEvent) => this.callbacks.onMessage(event.data);
    const handleClose = () => {
      if (!this.closed) this.callbacks.onClose("The opponent disconnected.");
    };
    const handleError = () => {
      if (!this.closed) this.callbacks.onClose("This connection could not be established on this network.");
    };

    channel.addEventListener("open", handleOpen);
    channel.addEventListener("message", handleMessage);
    channel.addEventListener("close", handleClose);
    channel.addEventListener("error", handleError);

    this.teardowns.push(() => {
      channel.removeEventListener("open", handleOpen);
      channel.removeEventListener("message", handleMessage);
      channel.removeEventListener("close", handleClose);
      channel.removeEventListener("error", handleError);
    });
  }
}

async function waitForIceGathering(peer: RTCPeerConnection): Promise<void> {
  if (peer.iceGatheringState === "complete") return;

  await new Promise<void>((resolve) => {
    // Some networks never reach `complete`; timing out still yields a usable code in
    // many local-network cases and avoids trapping the UI in a spinner.
    const timeout = window.setTimeout(resolve, NETWORK.handshakeTimeoutMs);
    const handleGatheringChange = () => {
      if (peer.iceGatheringState !== "complete") return;
      window.clearTimeout(timeout);
      peer.removeEventListener("icegatheringstatechange", handleGatheringChange);
      resolve();
    };

    peer.addEventListener("icegatheringstatechange", handleGatheringChange);
  });
}
