// Required before importing Pixi symbols in this project: it patches Pixi internals
// so the renderer works with the site's strict Content Security Policy.
import "pixi.js/unsafe-eval";
import { Application, Container, Graphics } from "pixi.js";

import { ARENA, PADDLE, PUCK, RENDER } from "./constants";
import { integrateSpring, magnitude, viewYForRole } from "./math";
import type { MatchState, PlayerRole, StatePayload, Teardown } from "./types";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: number;
  size: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

/**
 * Pixi renderer for the action layer. The DOM owns the HUD and controls; keeping
 * Pixi focused on the court makes accessibility and teardown simpler.
 */
export class MatchRenderer {
  private readonly mount: HTMLElement;
  private readonly role: PlayerRole;
  private readonly app = new Application();
  private readonly world = new Container();
  private readonly court = new Graphics();
  private readonly action = new Graphics();
  private readonly effects = new Graphics();
  private readonly particles: Particle[] = [];
  private readonly trail: TrailPoint[] = [];
  private readonly teardowns: Teardown[] = [];
  private width = 1;
  private height = 1;
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;
  private squash = 1;
  private squashVelocity = 0;
  private shakeTime = 0;
  private shakeMagnitude = 0;
  private lastTick = -1;
  private lastHostScore = 0;
  private lastClientScore = 0;
  private destroyed = false;

  private constructor(mount: HTMLElement, role: PlayerRole) {
    this.mount = mount;
    this.role = role;
  }

  static async create(mount: HTMLElement, role: PlayerRole): Promise<MatchRenderer> {
    const renderer = new MatchRenderer(mount, role);
    await renderer.init();
    return renderer;
  }

  /** Draw one frame from an already-authoritative state. This class never mutates gameplay state. */
  render(state: MatchState, deltaSeconds: number): void {
    if (this.destroyed) return;
    this.updateReactions(state, deltaSeconds);
    this.updateTrail(state, deltaSeconds);
    this.updateParticles(deltaSeconds);

    const shake = this.getShakeOffset();
    this.world.position.set(this.offsetX + shake.x, this.offsetY + shake.y);
    this.drawAction(state);
    this.drawEffects();
  }

  /** Trigger short-lived visual feedback for collisions and goals. */
  flashImpact(strength: number, color: number): void {
    this.squash = Math.max(this.squash, 1 + strength * 0.18);
    this.squashVelocity -= strength * 1.6;
    this.shakeMagnitude = Math.max(this.shakeMagnitude, strength * 18);
    this.shakeTime = Math.max(this.shakeTime, 0.24);

    for (let index = 0; index < Math.min(RENDER.maxParticles - this.particles.length, 18); index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 340 * strength;
      this.particles.push({
        x: ARENA.width / 2,
        y: ARENA.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.45 + Math.random() * 0.35,
        maxLife: 0.8,
        color,
        size: 6 + Math.random() * 10,
      });
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.teardowns.splice(0).forEach((teardown) => teardown());
    this.app.destroy(true, { children: true });
    this.mount.replaceChildren();
  }

  private async init(): Promise<void> {
    await this.app.init({
      width: this.mount.clientWidth || 360,
      height: this.mount.clientHeight || 640,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      // Cap DPR for thermal/battery reasons; mobile multiplayer is more sensitive
      // to steady frame pacing than ultra-crisp canvas pixels.
      resolution: Math.min(window.devicePixelRatio || 1, RENDER.maxDpr),
      sharedTicker: false,
      autoStart: true,
    });

    this.app.canvas.setAttribute("aria-hidden", "true");
    this.mount.replaceChildren(this.app.canvas);
    this.world.addChild(this.court, this.effects, this.action);
    this.app.stage.addChild(this.world);
    this.resize();
    this.drawCourt();

    const resizeObserver = new ResizeObserver(() => {
      this.resize();
      this.drawCourt();
    });
    resizeObserver.observe(this.mount);
    this.teardowns.push(() => resizeObserver.disconnect());
  }

  private resize(): void {
    this.width = Math.max(1, this.mount.clientWidth);
    this.height = Math.max(1, this.mount.clientHeight);
    this.app.renderer.resize(this.width, this.height);
    // Scale the fixed logical arena into the responsive CSS container without
    // changing simulation coordinates.
    this.scale = Math.min(this.width / ARENA.width, this.height / ARENA.height);
    this.offsetX = (this.width - ARENA.width * this.scale) / 2;
    this.offsetY = (this.height - ARENA.height * this.scale) / 2;
    this.world.scale.set(this.scale);
    this.world.position.set(this.offsetX, this.offsetY);
  }

  private drawCourt(): void {
    this.court.clear();
    this.court.rect(0, 0, ARENA.width, ARENA.height).fill({ color: RENDER.surface });
    // Removed black border stroke per user request
    this.court.rect(ARENA.wallThickness, ARENA.height / 2 - ARENA.centerLineWidth / 2, ARENA.width - ARENA.wallThickness * 2, ARENA.centerLineWidth).fill({ alpha: 0.5, color: RENDER.ink });
    this.court.rect(ARENA.wallThickness * 2, ARENA.wallThickness * 2, ARENA.width - ARENA.wallThickness * 4, ARENA.goalDepth).fill({ alpha: 0.7, color: RENDER.goal });
    this.court.rect(ARENA.wallThickness * 2, ARENA.height - ARENA.goalDepth - ARENA.wallThickness * 2, ARENA.width - ARENA.wallThickness * 4, ARENA.goalDepth).fill({ alpha: 0.7, color: RENDER.goal });

    for (let y = 280; y < ARENA.height; y += 220) {
      this.court.rect(ARENA.width / 2 - 2, y, 4, 72).fill({ alpha: 0.12, color: RENDER.ink });
    }
  }

  private drawAction(state: MatchState): void {
    // Each player sees themselves at the bottom; only y is mirrored because x remains shared.
    const hostY = viewYForRole(this.role, state.hostPaddle.y);
    const clientY = viewYForRole(this.role, state.clientPaddle.y);
    const ballY = viewYForRole(this.role, state.ball.y);

    this.action.clear();
    this.drawPaddle(state.hostPaddle.x, hostY, RENDER.host, this.role === "host");
    this.drawPaddle(state.clientPaddle.x, clientY, RENDER.client, this.role === "client");

    this.action.circle(state.ball.x + 8, ballY + 14, PUCK.radius * 0.92).fill({ alpha: 0.16, color: 0x000000 });
    this.action.ellipse(state.ball.x, ballY, PUCK.radius * this.squash, PUCK.radius / this.squash).fill({ color: RENDER.ink });
    this.action.circle(state.ball.x - PUCK.radius * 0.24, ballY - PUCK.radius * 0.24, PUCK.radius * 0.18).fill({ alpha: 0.5, color: 0xffffff });
  }

  private drawPaddle(x: number, y: number, color: number, local: boolean): void {
    this.action.roundRect(x - PADDLE.width / 2, y - PADDLE.height / 2, PADDLE.width, PADDLE.height, PADDLE.radius).fill({ color });
    this.action.roundRect(x - PADDLE.width / 2, y - PADDLE.height / 2, PADDLE.width, PADDLE.height, PADDLE.radius).stroke({ alpha: local ? 1 : 0.36, color: RENDER.ink, width: local ? 8 : 4 });
  }

  private drawEffects(): void {
    this.effects.clear();

    this.trail.forEach((point, index) => {
      const alpha = Math.max(0, 1 - point.age / 0.35) * (1 - index / Math.max(1, this.trail.length));
      if (alpha <= 0.01) return;
      this.effects.circle(point.x, viewYForRole(this.role, point.y), PUCK.radius * (0.3 + alpha * 0.55)).fill({ alpha: alpha * 0.22, color: RENDER.ink });
    });

    this.particles.forEach((particle) => {
      const alpha = Math.max(0, particle.life / particle.maxLife);
      this.effects.rect(particle.x - particle.size / 2, viewYForRole(this.role, particle.y) - particle.size / 2, particle.size, particle.size).fill({ alpha, color: particle.color });
    });
  }

  private updateReactions(state: MatchState, deltaSeconds: number): void {
    const spring = integrateSpring(this.squash, this.squashVelocity, 1, 58, 13, deltaSeconds);
    this.squash = spring.position;
    this.squashVelocity = spring.velocity;
    this.shakeTime = Math.max(0, this.shakeTime - deltaSeconds);

    if (state.tick !== this.lastTick && state.freezeMs > 0) {
      // Simulation hit-stop doubles as a cheap signal that an impact happened.
      const speed = magnitude(state.ball.vx, state.ball.vy);
      const strength = state.roundState === "scored" || state.roundState === "gameover" ? 1.8 : Math.min(1.3, speed / 1100);
      this.flashImpact(strength, state.lastScoredBy === "host" ? RENDER.host : state.lastScoredBy === "client" ? RENDER.client : RENDER.ink);
    }

    if (state.scores.host !== this.lastHostScore) this.flashImpact(1.8, RENDER.host);
    if (state.scores.client !== this.lastClientScore) this.flashImpact(1.8, RENDER.client);

    this.lastHostScore = state.scores.host;
    this.lastClientScore = state.scores.client;
    this.lastTick = state.tick;
  }

  private updateTrail(state: MatchState, deltaSeconds: number): void {
    this.trail.forEach((point) => {
      point.age += deltaSeconds;
    });
    this.trail.unshift({ x: state.ball.x, y: state.ball.y, age: 0 });
    this.trail.splice(RENDER.trailLength);
  }

  private updateParticles(deltaSeconds: number): void {
    for (let index = this.particles.length - 1; index >= 0; index -= 1) {
      const particle = this.particles[index];
      particle.life -= deltaSeconds;
      particle.x += particle.vx * deltaSeconds;
      particle.y += particle.vy * deltaSeconds;
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      if (particle.life <= 0) this.particles.splice(index, 1);
    }
  }

  private getShakeOffset(): { x: number; y: number } {
    if (this.shakeTime <= 0) return { x: 0, y: 0 };
    const decay = this.shakeTime / 0.24;
    const wave = Math.sin((1 - decay) * Math.PI * 12);
    return {
      x: wave * this.shakeMagnitude * decay,
      y: Math.cos((1 - decay) * Math.PI * 10) * this.shakeMagnitude * decay * 0.45,
    };
  }
}

/** Utility kept for future consumers that receive `StatePayload` outside the controller path. */
export function payloadToRenderableState(payload: StatePayload): MatchState {
  return {
    tick: payload.tick,
    roundState: payload.roundState,
    countdownMs: payload.countdownMs,
    freezeMs: payload.freezeMs,
    ball: {
      x: payload.ballX,
      y: payload.ballY,
      vx: payload.ballVx,
      vy: payload.ballVy,
      speedMultiplier: 1,
    },
    hostPaddle: {
      x: payload.hostPaddleX,
      y: PADDLE.insetY,
      vx: payload.hostPaddleVx,
    },
    clientPaddle: {
      x: payload.clientPaddleX,
      y: ARENA.height - PADDLE.insetY,
      vx: payload.clientPaddleVx,
    },
    scores: {
      host: payload.hostScore,
      client: payload.clientScore,
    },
    lastScoredBy: payload.lastScoredBy,
    winner: payload.winner,
    serveToward: payload.serveToward,
  };
}
