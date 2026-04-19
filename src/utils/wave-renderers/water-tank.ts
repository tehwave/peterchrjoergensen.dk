/**
 * Water tank renderer — playful rubber duck in a navy-and-pastel aquarium.
 *
 * Mounted by `WaterTank.astro` and driven by the shared wave engine. The
 * scene simulates a 1D spring-coupled water surface and a physics-driven
 * duck (gravity + buoyancy + local slope rotation). On top of that it layers
 * a handful of charm passes: idle body wobble, blinking eyes, a smile,
 * rosy cheeks, impact squash when the duck hits the water hard, and tiny
 * heart/sparkle particles emitted on interaction.
 */
import type { WaveSceneBase } from "../wave-engine";
import { SUNSET_WAVE_PALETTE } from "../wave-palettes";

interface Particle {
  kind: "heart" | "sparkle" | "droplet";
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
}

interface Duck {
  x: number;
  y: number;
  vy: number;
  vx: number;
  rotation: number;
  radius: number;
  // Body stretch applied on impact; lerps back to 1.
  squash: number;
  // 0..1 fade that brightens cheeks/brow after interaction (happy flash).
  excitement: number;
  // Blink progress: 0 = open, 1 = fully closed.
  blink: number;
  // ms until the next blink begins.
  nextBlinkIn: number;
  // Active blink phase ms; when > 0 the duck is mid-blink.
  blinkPhase: number;
  idleClock: number;
}

export interface WaterTankScene extends WaveSceneBase {
  duck: Duck;
  restWaterY: number;
  particles: Particle[];
  // Running clock (ms) for ambient animation and blink scheduling.
  sceneClockMs: number;
  hoverDuck: boolean;
}
// Integration timestep normalized to a 60fps frame.
const BASELINE_FRAME_MS = 16.67;
// Duck physics.
const GRAVITY = 0.07;
const BUOYANCY_SPRING = 0.06;
const DUCK_DAMPING = 0.985;
const DUCK_DRIFT_MAX = 0.07;

const FOOTER_WAVE_LAYERS = [
  { base: 0.44, amp: 0.098, freq: 0.0101, speed: 0.0011, alpha: 0.72, phaseOffset: 0 },
  { base: 0.55, amp: 0.082, freq: 0.0122, speed: -0.0013, alpha: 0.62, phaseOffset: 1.6 },
  { base: 0.66, amp: 0.066, freq: 0.0137, speed: 0.00156, alpha: 0.52, phaseOffset: 3.2 },
  { base: 0.75, amp: 0.052, freq: 0.015, speed: -0.00188, alpha: 0.44, phaseOffset: 4.8 },
] as const;
const FOOTER_WAVE_HARMONIC_SCALE = 0.22;
const FOOTER_FRONT_LAYER = FOOTER_WAVE_LAYERS[FOOTER_WAVE_LAYERS.length - 1];

// Cheap cap so spam clicks don't compound.
const MAX_PARTICLES = 48;

export function createWaterTankScene(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): WaterTankScene {
  return {
    canvas,
    context,
    width: 0,
    height: 0,
    dpr: 1,
    visible: true,
    phaseTime: 0,
    speedMultiplier: 1,
    paused: false,
    duck: {
      x: 0,
      y: 0,
      vy: 0,
      vx: 0.05,
      rotation: 0,
      radius: 22,
      squash: 1,
      excitement: 0,
      blink: 0,
      nextBlinkIn: 1800 + Math.random() * 2200,
      blinkPhase: 0,
      idleClock: 0,
    },
    restWaterY: 0,
    particles: [],
    sceneClockMs: 0,
    hoverDuck: false,
  };
}

export function syncWaterTankSceneLayout(scene: WaterTankScene): void {
  scene.restWaterY = scene.height * FOOTER_FRONT_LAYER.base;

  // Larger, more readable duck. -> Wait, scaled down 50%
  const duckRadius = Math.max(8, Math.min(scene.height * 0.11, scene.width * 0.055));
  scene.duck.radius = duckRadius;

  if (scene.duck.x === 0 && scene.duck.y === 0) {
    scene.duck.x = scene.width * 0.5;
    scene.duck.y = scene.restWaterY - duckRadius * 0.4;
  } else {
    const margin = duckRadius * 1.2;
    scene.duck.x = Math.min(scene.width - margin, Math.max(margin, scene.duck.x));
  }
}

function sampleWaterY(scene: WaterTankScene, x: number): number {
  return sampleFooterWaveY(scene, FOOTER_FRONT_LAYER, x);
}

export function splashAt(scene: WaterTankScene, x: number, strength: number, radius = 36): void {
  void scene;
  void x;
  void strength;
  void radius;
}

export function dunkDuck(scene: WaterTankScene, clickX: number, strength: number): void {
  scene.duck.vy += strength * 0.5; // Scale animation for smaller duck
  const offsetFromClick = scene.duck.x - clickX;
  const direction = offsetFromClick === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(offsetFromClick);
  scene.duck.vx += direction * 0.22;
  scene.duck.excitement = Math.min(1, scene.duck.excitement + 0.9);
  scene.duck.squash = Math.max(0.6, scene.duck.squash - 0.25);
  spawnHearts(scene, scene.duck.x, scene.duck.y - scene.duck.radius * 0.4, 3);
}

export function pointHitsDuck(scene: WaterTankScene, x: number, y: number): boolean {
  const dx = x - scene.duck.x;
  const dy = y - scene.duck.y;
  return dx * dx + dy * dy <= scene.duck.radius * scene.duck.radius * 1.6;
}

function spawnHearts(scene: WaterTankScene, x: number, y: number, count: number): void {
  for (let i = 0; i < count; i += 1) {
    pushParticle(scene, {
      kind: "heart",
      x: x + (Math.random() - 0.5) * 12,
      y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -1.2 - Math.random() * 0.8,
      life: 900,
      maxLife: 900,
      size: 7 + Math.random() * 4,
      rotation: (Math.random() - 0.5) * 0.6,
    });
  }
}

function pushParticle(scene: WaterTankScene, particle: Particle): void {
  scene.particles.push(particle);
  if (scene.particles.length > MAX_PARTICLES) {
    scene.particles.splice(0, scene.particles.length - MAX_PARTICLES);
  }
}

export function updateWaterTankScene(scene: WaterTankScene, deltaTime: number): void {
  scene.sceneClockMs += deltaTime;

  const steps = Math.max(1, Math.min(4, Math.round(deltaTime / BASELINE_FRAME_MS)));
  const stepDelta = deltaTime / steps;
  const frameScale = stepDelta / BASELINE_FRAME_MS;

  for (let step = 0; step < steps; step += 1) {
    simulateDuckStep(scene, frameScale);
    updateCharmState(scene, stepDelta, frameScale);
  }

  updateParticles(scene, deltaTime);
}

function simulateDuckStep(scene: WaterTankScene, frameScale: number): void {
  const { duck } = scene;
  duck.idleClock += frameScale;

  const waterY = sampleWaterY(scene, duck.x);
  const floatTarget = waterY - duck.radius * 0.35;
  const buoyancy = (floatTarget - duck.y) * BUOYANCY_SPRING;
  const previousVy = duck.vy;

  duck.vy += (GRAVITY + buoyancy) * frameScale;
  duck.vy *= Math.pow(DUCK_DAMPING, frameScale);
  duck.y += duck.vy * frameScale;

  // Squash response on sharp vy swings.
  const vyDelta = Math.abs(duck.vy - previousVy);
  if (vyDelta > 0.4) {
    duck.squash = Math.max(0.65, duck.squash - vyDelta * 0.08);
  }

  const margin = duck.radius * 1.3;
  duck.x += duck.vx * frameScale;
  if (duck.x < margin) {
    duck.x = margin;
    duck.vx = Math.abs(duck.vx);
  } else if (duck.x > scene.width - margin) {
    duck.x = scene.width - margin;
    duck.vx = -Math.abs(duck.vx);
  }
  duck.vx = Math.max(-DUCK_DRIFT_MAX * 8, Math.min(DUCK_DRIFT_MAX * 8, duck.vx));
  duck.vx *= Math.pow(0.992, frameScale);
  if (Math.abs(duck.vx) < DUCK_DRIFT_MAX) {
    duck.vx += (duck.vx >= 0 ? 1 : -1) * 0.001 * frameScale;
  }

  const leftY = sampleWaterY(scene, duck.x - duck.radius);
  const rightY = sampleWaterY(scene, duck.x + duck.radius);
  const slope = (rightY - leftY) / (duck.radius * 2);
  const idleSway = Math.sin(scene.sceneClockMs * 0.0016) * 0.04;
  const targetRotation = Math.atan(slope) * 0.8 + idleSway;
  duck.rotation += (targetRotation - duck.rotation) * Math.min(1, 0.2 * frameScale);
}

function updateCharmState(scene: WaterTankScene, stepDeltaMs: number, frameScale: number): void {
  const { duck } = scene;

  duck.squash += (1 - duck.squash) * Math.min(1, 0.12 * frameScale);
  duck.excitement = Math.max(0, duck.excitement - 0.008 * frameScale);

  if (duck.blinkPhase > 0) {
    duck.blinkPhase -= stepDeltaMs;
    const totalBlink = 140;
    const progress = 1 - Math.max(0, duck.blinkPhase) / totalBlink;
    duck.blink = Math.sin(Math.min(1, progress) * Math.PI);
    if (duck.blinkPhase <= 0) {
      duck.blink = 0;
      duck.blinkPhase = 0;
      duck.nextBlinkIn = 1600 + Math.random() * 2800;
    }
  } else {
    duck.nextBlinkIn -= stepDeltaMs;
    if (duck.nextBlinkIn <= 0) {
      duck.blinkPhase = 140;
    }
  }
}

function updateParticles(scene: WaterTankScene, deltaTime: number): void {
  const frameScale = deltaTime / BASELINE_FRAME_MS;
  for (let i = scene.particles.length - 1; i >= 0; i -= 1) {
    const p = scene.particles[i];
    p.life -= deltaTime;
    if (p.life <= 0) {
      scene.particles.splice(i, 1);
      continue;
    }
    p.vy += (p.kind === "heart" ? -0.02 : 0.04) * frameScale;
    p.vx *= Math.pow(0.98, frameScale);
    p.x += p.vx * frameScale;
    p.y += p.vy * frameScale;
    p.rotation += 0.02 * frameScale;
  }
}

export function drawWaterTankScene(scene: WaterTankScene, _time: number): void {
  const { context, width, height } = scene;
  context.clearRect(0, 0, width, height);

  const baseWash = context.createLinearGradient(0, height * 0.22, 0, height);
  baseWash.addColorStop(0, "rgba(88, 230, 255, 0)");
  baseWash.addColorStop(0.34, "rgba(106, 139, 255, 0.2)");
  baseWash.addColorStop(0.62, "rgba(176, 107, 255, 0.28)");
  baseWash.addColorStop(0.84, "rgba(255, 124, 168, 0.34)");
  baseWash.addColorStop(1, "rgba(255, 143, 94, 0.38)");

  context.save();
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 1;
  context.fillStyle = baseWash;
  context.fillRect(0, height * 0.22, width, height * 0.84);
  context.restore();

  for (const layer of FOOTER_WAVE_LAYERS.slice(0, -1)) {
    drawFooterWaveLayer(scene, layer);
  }

  drawDuck(scene);

  drawFooterWaveLayer(scene, FOOTER_FRONT_LAYER);

  const shimmer = context.createLinearGradient(0, height * 0.34, 0, height);
  shimmer.addColorStop(0, "rgba(255, 255, 255, 0)");
  shimmer.addColorStop(1, "rgba(255, 255, 255, 0.16)");

  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = 0.5;
  context.fillStyle = shimmer;
  context.fillRect(0, height * 0.34, width, height * 0.66);
  context.restore();

  drawParticles(scene);
}

function drawFooterWaveLayer(scene: WaterTankScene, layer: (typeof FOOTER_WAVE_LAYERS)[number]): void {
  const { context, width } = scene;
  const layerIndex = FOOTER_WAVE_LAYERS.indexOf(layer);
  const gradient = context.createLinearGradient(0, 0, width, 0);

  for (let colorIndex = 0; colorIndex < SUNSET_WAVE_PALETTE.length; colorIndex += 1) {
    gradient.addColorStop(colorIndex / (SUNSET_WAVE_PALETTE.length - 1), SUNSET_WAVE_PALETTE[(colorIndex + layerIndex) % SUNSET_WAVE_PALETTE.length]);
  }

  context.save();
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = layer.alpha;
  context.fillStyle = gradient;
  buildFooterWaveFillPath(scene, layer);
  context.fill();
  context.restore();
}

function buildFooterWaveFillPath(scene: WaterTankScene, layer: (typeof FOOTER_WAVE_LAYERS)[number]): void {
  const { context, width, height } = scene;
  context.beginPath();
  context.moveTo(0, height);

  for (let x = 0; x <= width + 2; x += 2) {
    context.lineTo(x, sampleFooterWaveY(scene, layer, x));
  }

  context.lineTo(width, height);
  context.closePath();
}

function sampleFooterWaveY(scene: WaterTankScene, layer: (typeof FOOTER_WAVE_LAYERS)[number], x: number): number {
  const { width, height, sceneClockMs } = scene;
  const normalizedX = Math.min(width, Math.max(0, x));
  const amplitude = height * layer.amp;
  const baseY = height * layer.base;
  const phase = sceneClockMs * layer.speed + layer.phaseOffset;

  return baseY + Math.sin(normalizedX * layer.freq + phase) * amplitude + Math.cos(normalizedX * layer.freq * 1.9 + phase * 0.82) * (amplitude * FOOTER_WAVE_HARMONIC_SCALE);
}

function drawDuck(scene: WaterTankScene): void {
  const { context, duck } = scene;
  const r = duck.radius;
  const squashX = 1 / duck.squash;
  const squashY = duck.squash;
  const idleMotion = Math.sin(scene.sceneClockMs * 0.0032 + duck.idleClock * 0.08);
  const wingSwing = idleMotion * 0.08 + duck.excitement * 0.12;
  const beakOpen = Math.max(0, 0.025 + idleMotion * 0.018 + duck.excitement * 0.15);

  // Soft shadow on the water below the duck.
  context.save();
  context.translate(duck.x, sampleWaterY(scene, duck.x) + r * 0.05);
  context.scale(1, 0.32);
  const shadowGradient = context.createRadialGradient(0, 0, 1, 0, 0, r * 1.1);
  shadowGradient.addColorStop(0, "rgba(10, 10, 40, 0.35)");
  shadowGradient.addColorStop(1, "rgba(10, 10, 40, 0)");
  context.fillStyle = shadowGradient;
  context.beginPath();
  context.arc(0, 0, r * 1.1, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.translate(duck.x, duck.y);
  context.rotate(duck.rotation);
  context.scale(squashX, squashY);

  // Pastel yellow body.
  const bodyGradient = context.createLinearGradient(0, -r, 0, r);
  bodyGradient.addColorStop(0, "#fff6c8");
  bodyGradient.addColorStop(0.45, "#ffe38a");
  bodyGradient.addColorStop(1, "#e9a94a");
  context.fillStyle = bodyGradient;
  context.beginPath();
  context.ellipse(0, 0, r * 1.2, r * 0.9, 0, 0, Math.PI * 2);
  context.fill();

  // Body rim light.
  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = 0.45;
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.ellipse(-r * 0.2, -r * 0.4, r * 0.55, r * 0.2, -0.4, 0, Math.PI * 2);
  context.fill();
  context.restore();

  // Tail (rounded nub).
  context.fillStyle = "#e9a94a";
  context.beginPath();
  context.moveTo(-r * 1.08, -r * 0.05);
  context.quadraticCurveTo(-r * 1.55, -r * 0.55, -r * 0.95, -r * 0.48);
  context.quadraticCurveTo(-r * 0.85, -r * 0.2, -r * 1.08, -r * 0.05);
  context.closePath();
  context.fill();

  // Little wing scallop.
  context.save();
  context.translate(r * 0.2, r * 0.08);
  context.rotate(wingSwing);
  context.translate(-r * 0.2, -r * 0.08);
  context.fillStyle = "rgba(233, 169, 74, 0.65)";
  context.beginPath();
  context.moveTo(-r * 0.1, -r * 0.14);
  context.quadraticCurveTo(r * 0.12, r * (0.32 + wingSwing * 0.9), r * 0.58, r * (0.24 + wingSwing * 0.55));
  context.quadraticCurveTo(r * 0.28, r * (0.02 - wingSwing * 0.2), -r * 0.1, -r * 0.14);
  context.closePath();
  context.fill();
  context.strokeStyle = "rgba(180, 120, 30, 0.4)";
  context.lineWidth = 0.9;
  context.stroke();
  context.restore();

  // Head.
  const headX = r * 0.78;
  const headY = -r * 0.65;
  const headRadius = r * 0.68;
  const headGradient = context.createRadialGradient(headX - headRadius * 0.3, headY - headRadius * 0.3, headRadius * 0.15, headX, headY, headRadius);
  headGradient.addColorStop(0, "#fffbe0");
  headGradient.addColorStop(1, "#f3bf4a");
  context.fillStyle = headGradient;
  context.beginPath();
  context.arc(headX, headY, headRadius, 0, Math.PI * 2);
  context.fill();

  // Head tuft for extra personality.
  context.fillStyle = "#f3bf4a";
  context.beginPath();
  context.moveTo(headX - headRadius * 0.25, headY - headRadius * 0.95);
  context.quadraticCurveTo(headX, headY - headRadius * 1.5, headX + headRadius * 0.2, headY - headRadius * 0.95);
  context.quadraticCurveTo(headX, headY - headRadius * 0.75, headX - headRadius * 0.25, headY - headRadius * 0.95);
  context.closePath();
  context.fill();

  // Cheek blush — intensifies with excitement.
  const cheekAlpha = 0.4 + duck.excitement * 0.5;
  context.save();
  context.globalAlpha = cheekAlpha;
  context.fillStyle = "#ff9fbe";
  context.beginPath();
  context.ellipse(headX - headRadius * 0.15, headY + headRadius * 0.35, headRadius * 0.22, headRadius * 0.12, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  // Beak — pastel orange, gently chatters at idle and opens more when excited.
  context.fillStyle = "#ffb469";
  context.strokeStyle = "rgba(140, 70, 10, 0.35)";
  context.lineWidth = 0.9;
  context.beginPath();
  context.moveTo(headX + headRadius * 0.65, headY - headRadius * 0.08);
  context.lineTo(headX + headRadius * 1.55, headY + headRadius * 0.02 - beakOpen * headRadius);
  context.lineTo(headX + headRadius * 0.75, headY + headRadius * 0.3 + beakOpen * headRadius);
  context.closePath();
  context.fill();
  context.stroke();
  if (beakOpen > 0.02) {
    context.strokeStyle = "rgba(140, 70, 10, 0.5)";
    context.beginPath();
    context.moveTo(headX + headRadius * 0.72, headY + headRadius * 0.14);
    context.lineTo(headX + headRadius * 1.5, headY + headRadius * 0.1);
    context.stroke();
  }

  // Eye — blinks occasionally; closed = smile arc.
  const eyeX = headX + headRadius * 0.28;
  const eyeY = headY - headRadius * 0.12;
  const eyeOpen = 1 - duck.blink;
  if (eyeOpen > 0.1) {
    context.fillStyle = "#241028";
    context.beginPath();
    context.ellipse(eyeX, eyeY, headRadius * 0.16, headRadius * 0.18 * eyeOpen, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(eyeX - headRadius * 0.05, eyeY - headRadius * 0.07, headRadius * 0.055, 0, Math.PI * 2);
    context.fill();
  } else {
    context.strokeStyle = "#241028";
    context.lineWidth = 1.3;
    context.beginPath();
    context.arc(eyeX, eyeY, headRadius * 0.15, 0.2 * Math.PI, 0.8 * Math.PI);
    context.stroke();
  }

  // Brow arc that shows up when excited.
  if (duck.excitement > 0.05) {
    context.save();
    context.globalAlpha = Math.min(1, duck.excitement * 1.2);
    context.strokeStyle = "#241028";
    context.lineWidth = 1.1;
    context.beginPath();
    context.arc(eyeX, eyeY - headRadius * 0.35, headRadius * 0.25, 1.1 * Math.PI, 1.9 * Math.PI);
    context.stroke();
    context.restore();
  }

  context.restore();
}

function drawParticles(scene: WaterTankScene): void {
  const { context } = scene;
  for (const p of scene.particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    context.save();
    context.globalAlpha = alpha;
    context.translate(p.x, p.y);
    context.rotate(p.rotation);
    if (p.kind === "heart") {
      drawHeart(context, p.size, "#ff9fbe");
    } else if (p.kind === "sparkle") {
      drawSparkle(context, p.size, "#fff2d6");
    } else {
      context.fillStyle = "rgba(200, 220, 255, 0.8)";
      context.beginPath();
      context.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }
}

function drawHeart(context: CanvasRenderingContext2D, size: number, color: string): void {
  context.fillStyle = color;
  context.strokeStyle = "rgba(180, 50, 90, 0.55)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, size * 0.3);
  context.bezierCurveTo(size, -size * 0.4, size * 0.6, -size * 1.1, 0, -size * 0.45);
  context.bezierCurveTo(-size * 0.6, -size * 1.1, -size, -size * 0.4, 0, size * 0.3);
  context.closePath();
  context.fill();
  context.stroke();
}

function drawSparkle(context: CanvasRenderingContext2D, size: number, color: string): void {
  context.fillStyle = color;
  context.beginPath();
  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2;
    const outer = size;
    const inner = size * 0.35;
    context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    context.lineTo(Math.cos(angle + Math.PI / 4) * inner, Math.sin(angle + Math.PI / 4) * inner);
  }
  context.closePath();
  context.fill();
}
