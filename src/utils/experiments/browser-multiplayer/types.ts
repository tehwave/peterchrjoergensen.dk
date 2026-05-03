export type PlayerRole = "host" | "client";
export type RoundState = "handshake" | "countdown" | "playing" | "scored" | "gameover" | "disconnected";
export type ScoredPlayer = PlayerRole | null;

/** Small vector shape used by math helpers without pulling renderer-specific types into simulation code. */
export interface Vec2 {
  x: number;
  y: number;
}

/** Paddle state is intentionally one-dimensional for gameplay; y is fixed by role. */
export interface PaddleState {
  x: number;
  y: number;
  vx: number;
}

/** Authoritative puck state. `speedMultiplier` is local simulation metadata, not sent over the wire. */
export interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speedMultiplier: number;
}

/** Scores are keyed by role because host authority does not depend on local perspective. */
export interface ScoreState {
  host: number;
  client: number;
}

/**
 * Canonical in-memory match model. The host owns this state; clients receive compact
 * snapshots and may locally override only their own paddle for responsiveness.
 */
export interface MatchState {
  tick: number;
  roundState: RoundState;
  countdownMs: number;
  freezeMs: number;
  ball: BallState;
  hostPaddle: PaddleState;
  clientPaddle: PaddleState;
  scores: ScoreState;
  lastScoredBy: ScoredPlayer;
  winner: ScoredPlayer;
  serveToward: PlayerRole;
}

/** Input packet sent by each peer. Absolute x avoids drift from dropped unreliable data-channel packets. */
export interface PlayerInput {
  tick: number;
  role: PlayerRole;
  paddleX: number;
  paddleVx: number;
}

/**
 * Flattened network snapshot. Keeping this shape scalar-only makes the binary layout
 * explicit and cheap to pack into a `DataView`.
 */
export interface StatePayload {
  tick: number;
  roundState: RoundState;
  countdownMs: number;
  freezeMs: number;
  ballX: number;
  ballY: number;
  ballVx: number;
  ballVy: number;
  hostPaddleX: number;
  hostPaddleVx: number;
  clientPaddleX: number;
  clientPaddleVx: number;
  hostScore: number;
  clientScore: number;
  lastScoredBy: ScoredPlayer;
  winner: ScoredPlayer;
  serveToward: PlayerRole;
}

export type FlowMessageType = "hello" | "countdown" | "scored" | "gameover" | "rematch-request" | "rematch-accept" | "disconnect" | "forfeit";

/** Low-frequency semantic events travel separately from high-frequency state snapshots. */
export interface FlowMessage {
  v: 1;
  type: FlowMessageType;
  role?: PlayerRole;
  message?: string;
  tick?: number;
}

export type ParsedProtocolMessage = { kind: "input"; input: PlayerInput } | { kind: "state"; state: StatePayload } | { kind: "flow"; flow: FlowMessage };

/** Manual signaling payload. SDP remains opaque here; validation only checks shape, type, and age. */
export interface HandshakeEnvelope {
  v: 1;
  type: "offer" | "answer";
  sdp: RTCSessionDescriptionInit;
  createdAt: number;
}

/**
 * DOM contract for the Astro page. Querying once at mount time fails fast if markup
 * changes and prevents selector strings from spreading through the controller.
 */
export interface BrowserMultiplayerDom {
  root: HTMLElement;
  stage: HTMLElement;
  status: HTMLElement;
  overlay: HTMLElement;
  scoreHost: HTMLElement;
  scoreClient: HTMLElement;
  hostLabel: HTMLElement;
  clientLabel: HTMLElement;
  handshake: HTMLElement;
  hostPanel: HTMLElement;
  clientPanel: HTMLElement;
  connectedPanel: HTMLElement;
  createButton: HTMLButtonElement;
  joinButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  offerOutput: HTMLTextAreaElement;
  offerInput: HTMLTextAreaElement;
  answerOutput: HTMLTextAreaElement;
  answerInput: HTMLTextAreaElement;
  acceptAnswerButton: HTMLButtonElement;
  createAnswerButton: HTMLButtonElement;
  shareOfferButton: HTMLButtonElement;
  shareAnswerButton: HTMLButtonElement;
  copyOfferButton: HTMLButtonElement;
  copyAnswerButton: HTMLButtonElement;
  rematchButton: HTMLButtonElement;
  roleText: HTMLElement;
  touchZone: HTMLElement;
  backButton: HTMLButtonElement;
}

export interface MultiplayerMount {
  destroy: () => void;
}

/** Shared cleanup shape for DOM listeners, ResizeObservers, and animation lifecycle hooks. */
export type Teardown = () => void;
