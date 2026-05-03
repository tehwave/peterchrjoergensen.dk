import { ARENA, PADDLE, PUCK } from "./constants";
import type { Vec2 } from "./types";

/** Bound a value into an inclusive range; used anywhere untrusted input touches simulation state. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation with clamped alpha so callers cannot overshoot by accident. */
export function lerp(from: number, to: number, alpha: number): number {
  return from + (to - from) * clamp(alpha, 0, 1);
}

export function magnitude(x: number, y: number): number {
  return Math.hypot(x, y);
}

/** Normalize safely; near-zero vectors become zero instead of producing unstable directions. */
export function normalize(x: number, y: number): Vec2 {
  const length = magnitude(x, y);
  if (length <= 0.0001) return { x: 0, y: 0 };
  return { x: x / length, y: y / length };
}

export function limitVector(x: number, y: number, maxLength: number): Vec2 {
  const length = magnitude(x, y);
  if (length <= maxLength || length <= 0.0001) return { x, y };
  const scale = maxLength / length;
  return { x: x * scale, y: y * scale };
}

/** Keep the full paddle inside the arena walls, not just its center point. */
export function clampPaddleX(x: number): number {
  return clamp(x, PADDLE.width / 2 + ARENA.wallThickness, ARENA.width - PADDLE.width / 2 - ARENA.wallThickness);
}

/** Cap puck velocity after paddle spin so rallies stay playable. */
export function clampPuckVelocity(vx: number, vy: number): Vec2 {
  return limitVector(vx, vy, PUCK.maxSpeed);
}

/** Small damped spring used for squash/shake-style presentation without a physics dependency. */
export function integrateSpring(position: number, velocity: number, target: number, stiffness: number, damping: number, deltaSeconds: number): { position: number; velocity: number } {
  const force = -stiffness * (position - target) - damping * velocity;
  const nextVelocity = velocity + force * deltaSeconds;
  return {
    position: position + nextVelocity * deltaSeconds,
    velocity: nextVelocity,
  };
}

/** Compact role encoding for float32 binary packets. Zero is reserved for nullable roles. */
export function roleToNumber(role: "host" | "client" | null): number {
  if (role === "host") return 1;
  if (role === "client") return 2;
  return 0;
}

/** Decode role values defensively; invalid payloads become null and can be rejected upstream. */
export function numberToRole(value: number): "host" | "client" | null {
  if (Math.round(value) === 1) return "host";
  if (Math.round(value) === 2) return "client";
  return null;
}

/** Keep round states stable in the binary state layout. */
export function roundStateToNumber(state: string): number {
  switch (state) {
    case "handshake":
      return 0;
    case "countdown":
      return 1;
    case "playing":
      return 2;
    case "scored":
      return 3;
    case "gameover":
      return 4;
    case "disconnected":
      return 5;
    default:
      return 0;
  }
}

/** Unknown numeric states fall back to handshake instead of crashing the receiver. */
export function numberToRoundState(value: number): "handshake" | "countdown" | "playing" | "scored" | "gameover" | "disconnected" {
  switch (Math.round(value)) {
    case 1:
      return "countdown";
    case 2:
      return "playing";
    case 3:
      return "scored";
    case 4:
      return "gameover";
    case 5:
      return "disconnected";
    default:
      return "handshake";
  }
}

/** Mirror y only, so both players render their own paddle at the bottom while sharing x coordinates. */
export function viewYForRole(role: "host" | "client", y: number): number {
  return role === "host" ? ARENA.height - y : y;
}
