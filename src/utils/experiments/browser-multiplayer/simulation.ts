import { ARENA, CLIENT_PADDLE_Y, DEFAULT_PADDLE_X, HOST_PADDLE_Y, PADDLE, PUCK, SIMULATION } from "./constants";
import { clamp, clampPaddleX, clampPuckVelocity, magnitude } from "./math";
import type { MatchState, PlayerInput, PlayerRole, ScoredPlayer, StatePayload } from "./types";

/** Create an idle match. The host moves this into countdown after the data channel opens. */
export function createInitialMatchState(): MatchState {
  return {
    tick: 0,
    roundState: "handshake",
    countdownMs: 0,
    freezeMs: 0,
    ball: {
      x: ARENA.width / 2,
      y: ARENA.height / 2,
      vx: 0,
      vy: 0,
      speedMultiplier: 1,
    },
    hostPaddle: {
      x: DEFAULT_PADDLE_X,
      y: HOST_PADDLE_Y,
      vx: 0,
    },
    clientPaddle: {
      x: DEFAULT_PADDLE_X,
      y: CLIENT_PADDLE_Y,
      vx: 0,
    },
    scores: {
      host: 0,
      client: 0,
    },
    lastScoredBy: null,
    winner: null,
    serveToward: "client",
  };
}

/** Reset scores and serve toward the client first so the host cannot score instantly on connect. */
export function startMatch(state: MatchState): void {
  state.scores.host = 0;
  state.scores.client = 0;
  state.winner = null;
  state.lastScoredBy = null;
  state.serveToward = "client";
  resetRound(state, "client");
}

/** Center the puck and enter a countdown, preserving each player's current paddle x. */
export function resetRound(state: MatchState, serveToward: PlayerRole): void {
  state.roundState = "countdown";
  state.countdownMs = SIMULATION.countdownMs;
  state.freezeMs = 0;
  state.serveToward = serveToward;
  state.ball.x = ARENA.width / 2;
  state.ball.y = ARENA.height / 2;
  state.ball.vx = 0;
  state.ball.vy = 0;
  state.ball.speedMultiplier = 1;
  state.hostPaddle.x = clampPaddleX(state.hostPaddle.x);
  state.clientPaddle.x = clampPaddleX(state.clientPaddle.x);
}

/** Apply the latest absolute paddle sample. Velocity is clamped because touch deltas can spike. */
export function applyPlayerInput(state: MatchState, input: PlayerInput): void {
  const paddle = input.role === "host" ? state.hostPaddle : state.clientPaddle;
  paddle.x = clampPaddleX(input.paddleX);
  paddle.vx = clamp(input.paddleVx, -2200, 2200);
}

/**
 * Advance the host-owned simulation by one fixed slice. Clients never call this for
 * authority; they render snapshots plus local paddle prediction.
 */
export function stepHostSimulation(state: MatchState, deltaMs: number): ScoredPlayer {
  const stepMs = clamp(deltaMs, 0, SIMULATION.maxFrameMs);
  state.tick += 1;

  if (state.freezeMs > 0) {
    // Freezes are cosmetic hit-stop. Input and networking continue outside this function.
    state.freezeMs = Math.max(0, state.freezeMs - stepMs);
    return null;
  }

  if (state.roundState === "countdown") {
    state.countdownMs = Math.max(0, state.countdownMs - stepMs);
    if (state.countdownMs <= 0) {
      serveBall(state, state.serveToward);
      state.roundState = "playing";
    }
    return null;
  }

  if (state.roundState !== "playing") return null;

  const dt = stepMs / 1000;
  state.ball.x += state.ball.vx * dt;
  state.ball.y += state.ball.vy * dt;

  handleWallCollision(state);
  handlePaddleCollision(state, "host");
  handlePaddleCollision(state, "client");

  if (state.ball.y < -PUCK.radius) {
    return scorePoint(state, "client");
  }

  if (state.ball.y > ARENA.height + PUCK.radius) {
    return scorePoint(state, "host");
  }

  return null;
}

/** Convert rich state to its flat transport shape. */
export function snapshotState(state: MatchState): StatePayload {
  return {
    tick: state.tick,
    roundState: state.roundState,
    countdownMs: state.countdownMs,
    freezeMs: state.freezeMs,
    ballX: state.ball.x,
    ballY: state.ball.y,
    ballVx: state.ball.vx,
    ballVy: state.ball.vy,
    hostPaddleX: state.hostPaddle.x,
    hostPaddleVx: state.hostPaddle.vx,
    clientPaddleX: state.clientPaddle.x,
    clientPaddleVx: state.clientPaddle.vx,
    hostScore: state.scores.host,
    clientScore: state.scores.client,
    lastScoredBy: state.lastScoredBy,
    winner: state.winner,
    serveToward: state.serveToward,
  };
}

/** Rehydrate a received snapshot into the renderer/simulation-friendly shape. */
export function stateFromPayload(payload: StatePayload): MatchState {
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
      y: HOST_PADDLE_Y,
      vx: payload.hostPaddleVx,
    },
    clientPaddle: {
      x: payload.clientPaddleX,
      y: CLIENT_PADDLE_Y,
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

function serveBall(state: MatchState, target: PlayerRole): void {
  // A small horizontal bias prevents perfectly vertical first serves.
  const direction = target === "host" ? -1 : 1;
  const xBias = target === "host" ? -0.18 : 0.18;
  state.ball.vx = PUCK.serveSpeed * xBias;
  state.ball.vy = PUCK.serveSpeed * direction;
}

function handleWallCollision(state: MatchState): void {
  const left = ARENA.wallThickness + PUCK.radius;
  const right = ARENA.width - ARENA.wallThickness - PUCK.radius;

  if (state.ball.x < left) {
    state.ball.x = left;
    state.ball.vx = Math.abs(state.ball.vx);
    state.freezeMs = Math.max(state.freezeMs, SIMULATION.wallFreezeMs);
  } else if (state.ball.x > right) {
    state.ball.x = right;
    state.ball.vx = -Math.abs(state.ball.vx);
    state.freezeMs = Math.max(state.freezeMs, SIMULATION.wallFreezeMs);
  }
}

function handlePaddleCollision(state: MatchState, role: PlayerRole): void {
  const paddle = role === "host" ? state.hostPaddle : state.clientPaddle;
  const ball = state.ball;
  const halfWidth = PADDLE.width / 2;
  const halfHeight = PADDLE.height / 2;
  const closestX = clamp(ball.x, paddle.x - halfWidth, paddle.x + halfWidth);
  const closestY = clamp(ball.y, paddle.y - halfHeight, paddle.y + halfHeight);
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  const distance = magnitude(dx, dy);

  if (distance > PUCK.radius) return;

  // Only collide while the puck is travelling into the paddle. This avoids double
  // hits while the puck is being pushed out after a contact.
  const movingTowardHost = role === "host" && ball.vy < 0;
  const movingTowardClient = role === "client" && ball.vy > 0;
  if (!movingTowardHost && !movingTowardClient) return;

  const normalY = role === "host" ? 1 : -1;
  const offset = clamp((ball.x - paddle.x) / halfWidth, -1, 1);
  const currentSpeed = Math.min(PUCK.maxSpeed, Math.max(PUCK.serveSpeed, magnitude(ball.vx, ball.vy)) * PUCK.speedGain);
  // Paddle velocity adds controllable spin, making horizontal swipes matter without
  // needing a full angular-physics model.
  const spin = paddle.vx * PUCK.spinInfluence;
  const nextVx = offset * currentSpeed * 0.42 + spin;
  const nextVy = normalY * Math.sqrt(Math.max(PUCK.serveSpeed * PUCK.serveSpeed, currentSpeed * currentSpeed - nextVx * nextVx));
  const limited = clampPuckVelocity(nextVx, nextVy);

  ball.vx = limited.x;
  ball.vy = limited.y;
  ball.speedMultiplier = Math.min(PUCK.maxSpeed / PUCK.serveSpeed, ball.speedMultiplier * PUCK.speedGain);
  ball.y = paddle.y + normalY * (halfHeight + PUCK.radius + 1);
  state.freezeMs = Math.max(state.freezeMs, SIMULATION.paddleFreezeMs);
}

function scorePoint(state: MatchState, scoredBy: PlayerRole): ScoredPlayer {
  state.scores[scoredBy] += 1;
  state.lastScoredBy = scoredBy;
  state.freezeMs = SIMULATION.goalFreezeMs;

  if (state.scores[scoredBy] >= SIMULATION.scoreLimit) {
    state.winner = scoredBy;
    state.roundState = "gameover";
    state.ball.vx = 0;
    state.ball.vy = 0;
    return scoredBy;
  }

  state.roundState = "scored";
  state.countdownMs = SIMULATION.scoredPauseMs;
  state.ball.vx = 0;
  state.ball.vy = 0;
  state.ball.x = ARENA.width / 2;
  state.ball.y = ARENA.height / 2;
  state.ball.speedMultiplier = 1;
  state.serveToward = scoredBy;
  return scoredBy;
}

export function advanceScoredPause(state: MatchState, deltaMs: number): void {
  if (state.roundState !== "scored") return;
  state.countdownMs = Math.max(0, state.countdownMs - deltaMs);
  if (state.countdownMs <= 0) {
    resetRound(state, state.serveToward);
  }
}
