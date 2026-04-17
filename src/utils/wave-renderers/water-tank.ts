/**
 * Water tank renderer — playful rubber duck in a navy-and-pastel aquarium.
 *
 * Mounted by `WaterTank.astro` and driven by the shared wave engine. The
 * scene simulates a 1D spring-coupled water surface and a physics-driven
 * duck (gravity + buoyancy + local slope rotation). On top of that it layers
 * a handful of charm passes: idle body wobble, blinking eyes, a smile,
 * rosy cheeks, impact squash when the duck hits the water hard, and tiny
 * heart/sparkle particles emitted on interaction.
 *
 * Interaction state lives on the scene so pointer handlers in the component
 * can drag/dunk/splash by mutating fields directly — the engine loop stays
 * agnostic about input sources.
 */
import type { WaveSceneBase } from "../wave-engine";
import { SUNSET_WAVE_PALETTE } from "../wave-palettes";

interface WaterPoint {
  // Vertical offset from the rest water line (CSS px). Positive = below rest.
  offset: number;
  // Vertical velocity of this surface column.
  velocity: number;
}

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
  grabbed: boolean;
  grabOffsetX: number;
  grabOffsetY: number;
  lastPointerX: number;
  lastPointerY: number;
  lastPointerAt: number;
  idleClock: number;
}

export interface WaterTankScene extends WaveSceneBase {
  points: WaterPoint[];
  duck: Duck;
  restWaterY: number;
  particles: Particle[];
  // Running clock (ms) for ambient animation and blink scheduling.
  sceneClockMs: number;
  hoverDuck: boolean;
}

// Point spacing in CSS px.
const POINT_SPACING = 6;
// Hooke's-law spring constant pulling each point back to rest.
const SURFACE_TENSION = 0.024;
// Per-frame velocity damping for water points.
const SURFACE_DAMPING = 0.996;
// Neighbor coupling: how strongly a point drags its neighbors along.
const NEIGHBOR_SPREAD = 0.32;
// Integration timestep normalized to a 60fps frame.
const BASELINE_FRAME_MS = 16.67;
// Duck physics.
const GRAVITY = 0.07;
const BUOYANCY_SPRING = 0.06;
const DUCK_DAMPING = 0.985;
const DUCK_DRIFT_MAX = 0.07;

// Ambient sine wave added to the physical points so the duck rides it continuously
const PHYSICS_WAVE_FREQ = 0.015;
const PHYSICS_WAVE_SPEED = -0.001;

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
    points: [],
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
      grabbed: false,
      grabOffsetX: 0,
      grabOffsetY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      lastPointerAt: 0,
      idleClock: 0,
    },
    restWaterY: 0,
    particles: [],
    sceneClockMs: 0,
    hoverDuck: false,
  };
}

export function syncWaterTankSceneLayout(scene: WaterTankScene): void {
  const pointCount = Math.max(12, Math.round(scene.width / POINT_SPACING));
  const previous = scene.points;

  const nextPoints: WaterPoint[] = new Array(pointCount);
  for (let i = 0; i < pointCount; i += 1) {
    const sampleIndex = previous.length > 0 ? Math.round((i / (pointCount - 1)) * (previous.length - 1)) : -1;
    nextPoints[i] = {
      offset: sampleIndex >= 0 ? previous[sampleIndex].offset : 0,
      velocity: sampleIndex >= 0 ? previous[sampleIndex].velocity : 0,
    };
  }
  scene.points = nextPoints;

  // Water rests at ~55% down so the duck has breathing room above.
  scene.restWaterY = scene.height * 0.55;

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
  const { points, restWaterY, width, height, sceneClockMs } = scene;
  const mathAmp = height * 0.035;
  const mathWave = Math.sin(x * PHYSICS_WAVE_FREQ + sceneClockMs * PHYSICS_WAVE_SPEED) * mathAmp;

  if (points.length === 0) return restWaterY + mathWave;
  const clampedX = Math.min(width, Math.max(0, x));
  const segmentWidth = width / (points.length - 1);
  const index = clampedX / segmentWidth;
  const i0 = Math.floor(index);
  const i1 = Math.min(points.length - 1, i0 + 1);
  const t = index - i0;
  const offset = points[i0].offset * (1 - t) + points[i1].offset * t;
  return restWaterY + offset + mathWave;
}

export function splashAt(scene: WaterTankScene, x: number, strength: number, radius = 36): void {
  if (scene.points.length === 0) return;
  const segmentWidth = scene.width / (scene.points.length - 1);
  const centerIndex = x / segmentWidth;
  const indexRadius = Math.max(1, radius / segmentWidth);

  for (let i = 0; i < scene.points.length; i += 1) {
    const distance = Math.abs(i - centerIndex);
    if (distance > indexRadius) continue;
    const falloff = 0.5 + 0.5 * Math.cos((distance / indexRadius) * Math.PI);
    scene.points[i].velocity += strength * falloff;
  }
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

export function grabDuck(scene: WaterTankScene, pointerX: number, pointerY: number, nowMs: number): void {
  const { duck } = scene;
  duck.grabbed = true;
  duck.grabOffsetX = duck.x - pointerX;
  duck.grabOffsetY = duck.y - pointerY;
  duck.lastPointerX = pointerX;
  duck.lastPointerY = pointerY;
  duck.lastPointerAt = nowMs;
  duck.vx *= 0.3;
  duck.vy = 0;
  duck.excitement = Math.min(1, duck.excitement + 0.6);
  spawnHearts(scene, duck.x, duck.y - duck.radius * 0.6, 2);
}

export function dragDuck(scene: WaterTankScene, pointerX: number, pointerY: number, nowMs: number): void {
  const { duck } = scene;
  if (!duck.grabbed) return;
  const margin = duck.radius;
  duck.x = Math.min(scene.width - margin, Math.max(margin, pointerX + duck.grabOffsetX));
  duck.y = Math.min(scene.height - margin * 0.4, Math.max(margin * 0.4, pointerY + duck.grabOffsetY));

  const dt = Math.max(1, nowMs - duck.lastPointerAt);
  const instantVx = ((pointerX - duck.lastPointerX) / dt) * BASELINE_FRAME_MS;
  const instantVy = ((pointerY - duck.lastPointerY) / dt) * BASELINE_FRAME_MS;
  duck.vx = duck.vx * 0.5 + instantVx * 0.5;
  duck.vy = duck.vy * 0.5 + instantVy * 0.5;
  duck.lastPointerX = pointerX;
  duck.lastPointerY = pointerY;
  duck.lastPointerAt = nowMs;
}

export function releaseDuck(scene: WaterTankScene): void {
  const { duck } = scene;
  if (!duck.grabbed) return;
  duck.grabbed = false;
  // Clamp release velocity so an aggressive flick doesn't launch the duck out of bounds.
  duck.vx = Math.max(-1.2, Math.min(1.2, duck.vx));
  duck.vy = Math.max(-3, Math.min(3, duck.vy));
  splashAt(scene, duck.x, Math.max(1, 0.9 + Math.abs(duck.vy) * 0.6), duck.radius * 1.6);
  scene.duck.excitement = Math.min(1, scene.duck.excitement + 0.5);
  scene.duck.squash = Math.max(0.7, scene.duck.squash - 0.1);
  spawnSparkles(scene, duck.x, sampleWaterY(scene, duck.x), 4);
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

function spawnSparkles(scene: WaterTankScene, x: number, y: number, count: number): void {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 1.5;
    pushParticle(scene, {
      kind: "sparkle",
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: -Math.abs(Math.sin(angle) * speed) - 0.3,
      life: 600,
      maxLife: 600,
      size: 4 + Math.random() * 3,
      rotation: Math.random() * Math.PI,
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
    simulateWaterStep(scene, frameScale);
    if (!scene.duck.grabbed) {
      simulateDuckStep(scene, frameScale);
    } else {
      // While grabbed, still update rotation so the body tilts as it moves.
      const leftY = sampleWaterY(scene, scene.duck.x - scene.duck.radius);
      const rightY = sampleWaterY(scene, scene.duck.x + scene.duck.radius);
      const slope = (rightY - leftY) / (scene.duck.radius * 2);
      const targetRotation = Math.atan(slope) * 0.4 + Math.sin(scene.sceneClockMs * 0.004) * 0.08;
      scene.duck.rotation += (targetRotation - scene.duck.rotation) * Math.min(1, 0.2 * frameScale);
    }
    updateCharmState(scene, stepDelta, frameScale);
  }

  updateParticles(scene, deltaTime);
}

function simulateWaterStep(scene: WaterTankScene, frameScale: number): void {
  const { points } = scene;
  const count = points.length;
  if (count === 0) return;

  for (let i = 0; i < count; i += 1) {
    const point = points[i];
    const acceleration = -SURFACE_TENSION * point.offset;
    point.velocity = (point.velocity + acceleration * frameScale) * Math.pow(SURFACE_DAMPING, frameScale);
    point.offset += point.velocity * frameScale;
  }

  const deltas = new Float32Array(count);
  for (let pass = 0; pass < 2; pass += 1) {
    for (let i = 0; i < count; i += 1) {
      if (i > 0) {
        const diff = points[i].offset - points[i - 1].offset;
        deltas[i - 1] += diff * NEIGHBOR_SPREAD * frameScale;
        points[i].velocity -= diff * NEIGHBOR_SPREAD * 0.5 * frameScale;
      }
      if (i < count - 1) {
        const diff = points[i].offset - points[i + 1].offset;
        deltas[i + 1] += diff * NEIGHBOR_SPREAD * frameScale;
        points[i].velocity -= diff * NEIGHBOR_SPREAD * 0.5 * frameScale;
      }
    }
    for (let i = 0; i < count; i += 1) {
      points[i].offset += deltas[i];
      deltas[i] = 0;
    }
  }

  // Ambient swell so the surface never looks frozen even when idle.
  scene.duck.idleClock += frameScale;
  const wiggle = Math.sin(scene.duck.idleClock * 0.04) * 0.02;
  points[0].velocity += wiggle * frameScale;
  points[count - 1].velocity -= wiggle * frameScale;

  // Add ambient traveling sine wave motion
  // Use `sceneClockMs` to create a continuous right-to-left wave.
  const waveSpeed = scene.sceneClockMs * 0.0005;
  const waveFreq = 0.015;
  for (let i = 0; i < count; i += 1) {
    const x = i * POINT_SPACING;
    const travelingSwell = Math.sin(x * waveFreq - waveSpeed) * 0.025;
    points[i].velocity += travelingSwell * frameScale;
  }
}

function simulateDuckStep(scene: WaterTankScene, frameScale: number): void {
  const { duck } = scene;

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
  const { context, width, height, points, restWaterY, sceneClockMs } = scene;
  context.clearRect(0, 0, width, height);

  // 1. Base Gradient Wash (matching footer aesthetic)
  const baseWash = context.createLinearGradient(0, restWaterY * 0.5, 0, height);
  baseWash.addColorStop(0, "rgba(88, 230, 255, 0)");
  baseWash.addColorStop(0.34, "rgba(106, 139, 255, 0.2)");
  baseWash.addColorStop(0.62, "rgba(176, 107, 255, 0.28)");
  baseWash.addColorStop(0.84, "rgba(255, 124, 168, 0.34)");
  baseWash.addColorStop(1, "rgba(255, 143, 94, 0.45)");

  context.save();
  context.globalCompositeOperation = "source-over";
  context.fillStyle = baseWash;
  context.fillRect(0, restWaterY * 0.5, width, height - restWaterY * 0.5);
  context.restore();

  // 2. Background math layers synced to Footer specs
  const layerAmpScale = height * 0.05;
  const bgLayers = [
    { base: restWaterY - height * 0.1, amp: layerAmpScale * 1.5, freq: 0.0101, speed: 0.0006, alpha: 0.72 },
    { base: restWaterY - height * 0.05, amp: layerAmpScale * 1.1, freq: 0.0122, speed: -0.0008, alpha: 0.62 },
    { base: restWaterY - height * 0.01, amp: layerAmpScale * 0.8, freq: 0.0137, speed: 0.0010, alpha: 0.52 },
  ] as const;

  for (const [index, layer] of bgLayers.entries()) {
    const gradient = context.createLinearGradient(0, 0, width, 0);
    for (let c = 0; c < SUNSET_WAVE_PALETTE.length; c += 1) {
      gradient.addColorStop(c / (SUNSET_WAVE_PALETTE.length - 1), SUNSET_WAVE_PALETTE[(c + index) % SUNSET_WAVE_PALETTE.length]);
    }

    context.save();
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = layer.alpha;
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(0, height);
    for (let x = 0; x <= width + 5; x += 5) {
      // Gentle math waves for backgrounds
      const y = layer.base + Math.sin(x * layer.freq + sceneClockMs * layer.speed + index * 1.6) * layer.amp;
      context.lineTo(x, y);
    }
    context.lineTo(width, height);
    context.closePath();
    context.fill();
    context.restore();
  }

  // 3. Foreground Physics Layer (Duck floats strictly on this layer)
  const frontIndex = bgLayers.length;
  const frontGradient = context.createLinearGradient(0, 0, width, 0);
  for (let c = 0; c < SUNSET_WAVE_PALETTE.length; c += 1) {
    frontGradient.addColorStop(c / (SUNSET_WAVE_PALETTE.length - 1), SUNSET_WAVE_PALETTE[(c + frontIndex) % SUNSET_WAVE_PALETTE.length]);
  }

  context.save();
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 0.95;
  context.fillStyle = frontGradient;
  context.beginPath();
  context.moveTo(0, height);

  const mathAmp = height * 0.035;
  if (points.length > 0) {
    const segmentWidth = width / (points.length - 1);
    
    // Add the physics math wave to the visual rendering of the physics layer
    const getPhysicsY = (i: number) => {
      const x = i * segmentWidth;
      const mathWave = Math.sin(x * PHYSICS_WAVE_FREQ + sceneClockMs * PHYSICS_WAVE_SPEED) * mathAmp;
      return restWaterY + points[i].offset + mathWave;
    };

    context.lineTo(0, getPhysicsY(0));
    for (let i = 1; i < points.length; i += 1) {
      const x = i * segmentWidth;
      const prevY = getPhysicsY(i - 1);
      const currY = getPhysicsY(i);
      const controlX = x - segmentWidth * 0.5;
      const controlY = (prevY + currY) * 0.5;
      context.quadraticCurveTo(controlX, controlY, x, currY);
    }
  } else {
    context.lineTo(0, restWaterY);
    context.lineTo(width, restWaterY);
  }
  
  context.lineTo(width, height);
  context.closePath();
  context.fill();

  // Subtle bright rim on the physics layer
  if (points.length > 0) {
    context.strokeStyle = "rgba(255, 255, 255, 0.4)";
    context.lineWidth = 1.2;
    context.stroke();
  }
  context.restore();

  drawDuck(scene);

  const fgFreq = 0.018;
  const fgSpeedScale = 0.0012;
  const fgWaveHeight = height * 0.045;

  // Single Foreground Overlay Wave (overlaps the duck for depth)
  context.save();
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 0.85;
  context.fillStyle = SUNSET_WAVE_PALETTE[(frontIndex + 1) % SUNSET_WAVE_PALETTE.length];
  context.beginPath();
  context.moveTo(0, height);
  for (let x = 0; x <= width + 5; x += 5) {
    const y = restWaterY + height * 0.06 + Math.sin(x * fgFreq + sceneClockMs * fgSpeedScale) * fgWaveHeight;
    context.lineTo(x, y);
  }
  context.lineTo(width, height);
  context.closePath();
  context.fill();
  context.restore();

  // 4. Shimmer from Footer
  const shimmer = context.createLinearGradient(0, restWaterY * 0.8, 0, height);
  shimmer.addColorStop(0, "rgba(255, 255, 255, 0)");
  shimmer.addColorStop(1, "rgba(255, 255, 255, 0.2)");

  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = 0.4;
  context.fillStyle = shimmer;
  context.fillRect(0, restWaterY * 0.8, width, height - restWaterY * 0.8);
  context.restore();

  drawDuck(scene);
  drawParticles(scene);
}

function drawDuck(scene: WaterTankScene): void {
  const { context, duck } = scene;
  const r = duck.radius;
  const squashX = 1 / duck.squash;
  const squashY = duck.squash;

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
  context.fillStyle = "rgba(233, 169, 74, 0.65)";
  context.beginPath();
  context.moveTo(-r * 0.1, -r * 0.1);
  context.quadraticCurveTo(r * 0.05, r * 0.45, r * 0.55, r * 0.35);
  context.quadraticCurveTo(r * 0.3, r * 0.05, -r * 0.1, -r * 0.1);
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
  const headGradient = context.createRadialGradient(
    headX - headRadius * 0.3,
    headY - headRadius * 0.3,
    headRadius * 0.15,
    headX,
    headY,
    headRadius,
  );
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

  // Beak — pastel orange, opens slightly when excited.
  const beakOpen = duck.excitement * 0.15;
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
