import { ARENA } from "./constants";
import { clampPaddleX } from "./math";
import type { PlayerInput, PlayerRole, Teardown } from "./types";

interface InputTrackerOptions {
  element: HTMLElement;
  role: PlayerRole;
  getTick: () => number;
  onInput: (input: PlayerInput) => void;
}

/**
 * Tracks a single active pointer in the bottom touch zone and emits absolute paddle
 * positions. Absolute control keeps the game playable even if some input packets drop.
 */
export class InputTracker {
  private readonly element: HTMLElement;
  private readonly role: PlayerRole;
  private readonly getTick: () => number;
  private readonly onInput: (input: PlayerInput) => void;
  private readonly teardowns: Teardown[] = [];
  private pointerId: number | null = null;
  private lastX = ARENA.width / 2;
  private lastAt = performance.now();
  private lastVelocity = 0;

  constructor(options: InputTrackerOptions) {
    this.element = options.element;
    this.role = options.role;
    this.getTick = options.getTick;
    this.onInput = options.onInput;
    this.bind();
    this.emit(this.lastX, 0);
  }

  getCurrentInput(): PlayerInput {
    return {
      tick: this.getTick(),
      role: this.role,
      paddleX: this.lastX,
      paddleVx: this.lastVelocity,
    };
  }

  destroy(): void {
    this.teardowns.splice(0).forEach((teardown) => teardown());
  }

  private bind(): void {
    const down = (event: PointerEvent) => {
      this.pointerId = event.pointerId;
      // Capture keeps movement flowing even when the thumb drifts outside the touch zone.
      this.element.setPointerCapture?.(event.pointerId);
      this.updateFromEvent(event);
    };
    const move = (event: PointerEvent) => {
      if (this.pointerId !== event.pointerId) return;
      this.updateFromEvent(event);
    };
    const up = (event: PointerEvent) => {
      if (this.pointerId !== event.pointerId) return;
      this.pointerId = null;
      this.lastVelocity = 0;
      this.emit(this.lastX, 0);
    };

    this.element.addEventListener("pointerdown", down);
    this.element.addEventListener("pointermove", move);
    this.element.addEventListener("pointerup", up);
    this.element.addEventListener("pointercancel", up);

    this.teardowns.push(() => {
      this.element.removeEventListener("pointerdown", down);
      this.element.removeEventListener("pointermove", move);
      this.element.removeEventListener("pointerup", up);
      this.element.removeEventListener("pointercancel", up);
    });
  }

  private updateFromEvent(event: PointerEvent): void {
    event.preventDefault();
    const rect = this.element.getBoundingClientRect();
    // Only horizontal position matters. The touch zone is deliberately large so
    // players can keep their thumb low without covering the puck.
    const normalizedX = (event.clientX - rect.left) / Math.max(1, rect.width);
    const x = clampPaddleX(normalizedX * ARENA.width);
    const now = performance.now();
    const deltaSeconds = Math.max(0.001, (now - this.lastAt) / 1000);
    const velocity = (x - this.lastX) / deltaSeconds;
    this.lastX = x;
    this.lastAt = now;
    this.lastVelocity = velocity;
    this.emit(x, velocity);
  }

  private emit(paddleX: number, paddleVx: number): void {
    this.onInput({
      tick: this.getTick(),
      role: this.role,
      paddleX,
      paddleVx,
    });
  }
}
