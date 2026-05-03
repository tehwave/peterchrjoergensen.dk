import type { PlayerRole } from "./types";

/**
 * Bump this when the binary protocol or handshake envelope becomes incompatible.
 * Both peers reject mismatched versions instead of trying to interpret stale data.
 */
export const PROTOCOL_VERSION = 1;

/**
 * Fixed simulation space. Rendering scales this rectangle to the available CSS box,
 * which keeps collision math deterministic across phones, tablets, and desktops.
 */
export const ARENA = {
  width: 1000,
  height: 1800,
  wallThickness: 18,
  goalDepth: 130,
  centerLineWidth: 6,
} as const;

/** Paddle dimensions are deliberately generous for thumb input on narrow screens. */
export const PADDLE = {
  width: 260,
  height: 54,
  radius: 27,
  insetY: 170,
} as const;

/**
 * Puck tuning favors short, readable rallies: hits accelerate the puck, but the cap
 * prevents long matches from becoming impossible on mobile touch input.
 */
export const PUCK = {
  radius: 28,
  serveSpeed: 850,
  maxSpeed: 1850,
  speedGain: 1.075,
  spinInfluence: 0.34,
} as const;

/**
 * The host steps at 120 Hz for stable collisions while broadcasting snapshots at a
 * lower rate. Short freezes make impacts readable without pausing the network loop.
 */
export const SIMULATION = {
  fixedStepMs: 1000 / 120,
  maxFrameMs: 80,
  countdownMs: 2400,
  scoredPauseMs: 900,
  goalFreezeMs: 100,
  paddleFreezeMs: 24,
  wallFreezeMs: 7,
  scoreLimit: 5,
} as const;

/**
 * One public STUN server helps peers discover usable network candidates. It is not
 * a signaling server; users still exchange the offer/answer codes manually.
 */
export const NETWORK = {
  stateHz: 30,
  inputHz: 60,
  handshakeTimeoutMs: 8500,
  staleHandshakeMs: 10 * 60 * 1000,
  channelLabel: "puck",
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
} as const;

/** Renderer-only values live here so game-feel constants stay separate from color and FX budgets. */
export const RENDER = {
  maxDpr: 2,
  trailLength: 9,
  maxParticles: 90,
  background: 0xf6f1e8,
  ink: 0x111111,
  mutedInk: 0x3b342d,
  surface: 0xfffbf3,
  host: 0xe94545,
  client: 0x2b65e8,
  goal: 0xf0e5d3,
} as const;

export const DEFAULT_PADDLE_X = ARENA.width / 2;
export const HOST_PADDLE_Y = PADDLE.insetY;
export const CLIENT_PADDLE_Y = ARENA.height - PADDLE.insetY;

export const ROLE_LABELS: Record<PlayerRole, string> = {
  host: "Host",
  client: "Client",
};
