/**
 * Water tank renderer — playful rubber ducks in a navy-and-pastel aquarium.
 *
 * Mounted by `WaterTank.astro` and driven by the shared wave engine. Layered
 * sunset waves bob behind a flock of physics-driven ducks (gravity + buoyancy
 * + local slope rotation). Each click spawns a duck that cycles through five
 * palettes — yellow, blue, red, black, white — up to a small cap, so the
 * tank fills with a tidy little rainbow. On top of the physics every duck
 * layers charm passes: idle body wobble, blinking eyes, a smile, rosy
 * cheeks, and heart/sparkle particles on interaction.
 */
import type { WaveSceneBase } from "../wave-engine";
import { SUNSET_WAVE_PALETTE } from "../wave-palettes";

// ---------- Types ----------

type ParticleKind = "heart" | "sparkle" | "droplet";

interface Particle {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  // Per-ms growth in `size`. Hearts slowly swell as they drift upward.
  growthRate: number;
}

interface DuckPalette {
  name: string;
  // Body gradient (top → middle → bottom).
  bodyLight: string;
  bodyMid: string;
  bodyDark: string;
  // Head radial gradient (highlight → base).
  headLight: string;
  headBase: string;
  tuftColor: string;
  wingFill: string;
  wingStroke: string;
  tailColor: string;
  // Eye colors. For dark bodies we paint a soft sclera behind the pupil so
  // the eye still reads; other palettes leave it null.
  eyePupil: string;
  eyeHighlight: string;
  eyeSclera: string | null;
}

interface Duck {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  radius: number;
  // Per-duck radius multiplier so the flock isn't perfectly uniform.
  sizeScale: number;
  // 1 = facing right, -1 = facing left. Mirrors the sprite horizontally.
  facing: 1 | -1;
  // 0..1 fade that brightens cheeks/brow after interaction.
  excitement: number;
  // 0 = open, 1 = fully closed.
  blink: number;
  // ms until the next blink begins.
  nextBlinkIn: number;
  // Active blink phase ms; > 0 while mid-blink.
  blinkPhase: number;
  // Per-duck phase offset so the flock doesn't bob in lockstep.
  idleClock: number;
  palette: DuckPalette;
}

export interface WaterTankScene extends WaveSceneBase {
  ducks: Duck[];
  restWaterY: number;
  particles: Particle[];
  // Rotating index into DUCK_PALETTES for the next spawn.
  nextPaletteIndex: number;
}

// ---------- Constants ----------

// Integration timestep normalized to a 60fps frame.
const BASELINE_FRAME_MS = 16.67;

// Duck physics.
const GRAVITY = 0.04;
const BUOYANCY_SPRING = 0.025;
const DUCK_DAMPING = 0.985;
const DUCK_DRIFT_DAMPING = 0.992;
const DUCK_DRIFT_MAX = 0.07;
const DUCK_DRIFT_ABS_CAP = DUCK_DRIFT_MAX * 8;
const DUCK_X_MARGIN_MULT = 1.2;
const DUCK_BOUNCE_MARGIN_MULT = 1.3;
const DUCK_FLOAT_OFFSET = 0.35; // fraction of radius above the waterline
// Per-duck radius variance: each duck picks a scale in this range so the
// tank doesn't look like a cloned assembly line.
const DUCK_SIZE_MIN = 0.88;
const DUCK_SIZE_MAX = 1.12;

// Blink timing (ms).
const BLINK_DURATION_MS = 140;
const BLINK_NEXT_MIN_MS = 1600;
const BLINK_NEXT_RANGE_MS = 2800;

// Heart particle lifetime + growth. Hearts drift up slowly and gently swell
// so they feel like a lingering affection bubble rather than a quick pop.
const HEART_LIFE_MIN_MS = 3200;
const HEART_LIFE_MAX_MS = 4600;
const HEART_GROWTH_MIN = 0.004; // px per ms
const HEART_GROWTH_MAX = 0.008;

// Wave layers. The last entry is the foreground band that occludes ducks.
const FOOTER_WAVE_LAYERS = [
  { base: 0.44, amp: 0.098, freq: 0.0101, speed: 0.0011, alpha: 0.72, phaseOffset: 0 },
  { base: 0.55, amp: 0.082, freq: 0.0122, speed: -0.0013, alpha: 0.62, phaseOffset: 1.6 },
  { base: 0.66, amp: 0.066, freq: 0.0137, speed: 0.00156, alpha: 0.52, phaseOffset: 3.2 },
  { base: 0.75, amp: 0.052, freq: 0.015, speed: -0.00188, alpha: 0.44, phaseOffset: 4.8 },
] as const;
const FOOTER_WAVE_HARMONIC_SCALE = 0.22;
const FOOTER_FRONT_LAYER = FOOTER_WAVE_LAYERS[FOOTER_WAVE_LAYERS.length - 1];
type FooterWaveLayer = (typeof FOOTER_WAVE_LAYERS)[number];

// Caps.
const MAX_PARTICLES = 48;
const MAX_DUCKS = 5;

// Shared accent colors.
const BEAK_FILL = "#ffb469";
const BEAK_STROKE = "rgba(140, 70, 10, 0.35)";
const BEAK_STROKE_OPEN = "rgba(140, 70, 10, 0.5)";
const CHEEK_BLUSH = "#ff9fbe";
const HEART_COLOR = "#ff9fbe";
const HEART_OUTLINE = "rgba(180, 50, 90, 0.55)";
const SPARKLE_COLOR = "#fff2d6";
const DROPLET_COLOR = "rgba(200, 220, 255, 0.8)";
const SHADOW_COLOR_INNER = "rgba(10, 10, 40, 0.35)";
const SHADOW_COLOR_OUTER = "rgba(10, 10, 40, 0)";

// Cycling color palettes. Spawn order: yellow → blue → red → black → white.
const DUCK_PALETTES: readonly DuckPalette[] = [
  {
    name: "yellow",
    bodyLight: "#fff6c8",
    bodyMid: "#ffe38a",
    bodyDark: "#e9a94a",
    headLight: "#fffbe0",
    headBase: "#f3bf4a",
    tuftColor: "#f3bf4a",
    wingFill: "rgba(233, 169, 74, 0.65)",
    wingStroke: "rgba(180, 120, 30, 0.4)",
    tailColor: "#e9a94a",
    eyePupil: "#241028",
    eyeHighlight: "#ffffff",
    eyeSclera: null,
  },
  {
    name: "blue",
    bodyLight: "#e4f3ff",
    bodyMid: "#8ec7f2",
    bodyDark: "#2c7bc0",
    headLight: "#eaf5ff",
    headBase: "#3d88cc",
    tuftColor: "#3d88cc",
    wingFill: "rgba(44, 123, 192, 0.7)",
    wingStroke: "rgba(20, 60, 110, 0.5)",
    tailColor: "#2c7bc0",
    eyePupil: "#0e1a2e",
    eyeHighlight: "#ffffff",
    eyeSclera: null,
  },
  {
    name: "red",
    bodyLight: "#ffe4de",
    bodyMid: "#ff927e",
    bodyDark: "#c93a2a",
    headLight: "#ffeae4",
    headBase: "#d44b38",
    tuftColor: "#d44b38",
    wingFill: "rgba(201, 58, 42, 0.7)",
    wingStroke: "rgba(120, 20, 14, 0.5)",
    tailColor: "#c93a2a",
    eyePupil: "#240808",
    eyeHighlight: "#ffffff",
    eyeSclera: null,
  },
  {
    name: "black",
    bodyLight: "#5a5a62",
    bodyMid: "#2c2c32",
    bodyDark: "#0d0d12",
    headLight: "#4a4a52",
    headBase: "#141418",
    tuftColor: "#141418",
    wingFill: "rgba(40, 40, 46, 0.85)",
    wingStroke: "rgba(0, 0, 0, 0.55)",
    tailColor: "#0d0d12",
    // Invert so a bright pupil reads inside a pale sclera.
    eyePupil: "#ffffff",
    eyeHighlight: "#cfd4dc",
    eyeSclera: "rgba(240, 240, 248, 0.9)",
  },
  {
    name: "white",
    bodyLight: "#ffffff",
    bodyMid: "#eef2f8",
    bodyDark: "#b9c3d1",
    headLight: "#ffffff",
    headBase: "#cfd7e2",
    tuftColor: "#cfd7e2",
    wingFill: "rgba(185, 195, 209, 0.75)",
    wingStroke: "rgba(110, 125, 145, 0.45)",
    tailColor: "#b9c3d1",
    eyePupil: "#1a1a22",
    eyeHighlight: "#ffffff",
    eyeSclera: null,
  },
];

// ---------- Small utilities ----------

const clampNum = (value: number, min: number, max: number): number => (value < min ? min : value > max ? max : value);

const randRange = (min: number, max: number): number => min + Math.random() * (max - min);

function computeDuckRadius(scene: WaterTankScene): number {
  return Math.max(8, Math.min(scene.height * 0.11, scene.width * 0.055));
}

function clampDuckX(scene: WaterTankScene, x: number, radius: number): number {
  const margin = radius * DUCK_X_MARGIN_MULT;
  return clampNum(x, margin, scene.width - margin);
}

function takeNextPalette(scene: WaterTankScene): DuckPalette {
  const palette = DUCK_PALETTES[scene.nextPaletteIndex % DUCK_PALETTES.length];
  scene.nextPaletteIndex = (scene.nextPaletteIndex + 1) % DUCK_PALETTES.length;
  return palette;
}

function createDuck(x: number, y: number, palette: DuckPalette, baseRadius: number): Duck {
  const sizeScale = randRange(DUCK_SIZE_MIN, DUCK_SIZE_MAX);
  return {
    x,
    y,
    vx: (Math.random() < 0.5 ? -1 : 1) * randRange(0.03, 0.08),
    vy: 0,
    rotation: 0,
    radius: baseRadius * sizeScale,
    sizeScale,
    facing: Math.random() < 0.5 ? -1 : 1,
    excitement: 0,
    blink: 0,
    nextBlinkIn: BLINK_NEXT_MIN_MS + Math.random() * (BLINK_NEXT_RANGE_MS - BLINK_NEXT_MIN_MS),
    blinkPhase: 0,
    idleClock: Math.random() * 20,
    palette,
  };
}

// ---------- Scene lifecycle ----------

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
    ducks: [],
    restWaterY: 0,
    particles: [],
    nextPaletteIndex: 0,
  };
}

export function syncWaterTankSceneLayout(scene: WaterTankScene): void {
  scene.restWaterY = scene.height * FOOTER_FRONT_LAYER.base;

  const duckRadius = computeDuckRadius(scene);

  // Seed the first duck the moment we have a meaningful layout.
  if (scene.ducks.length === 0 && scene.width > 0 && scene.height > 0) {
    scene.ducks.push(createDuck(scene.width * 0.5, scene.restWaterY - duckRadius * 0.4, takeNextPalette(scene), duckRadius));
  }

  for (const duck of scene.ducks) {
    duck.radius = duckRadius * duck.sizeScale;
    duck.x = clampDuckX(scene, duck.x, duck.radius);
  }
}

// ---------- Public interactions ----------

export function spawnDuck(scene: WaterTankScene, x?: number): Duck | null {
  if (scene.width <= 0 || scene.height <= 0) return null;

  // Hard cap: at the limit we refuse new spawns. Existing ducks stay put.
  if (scene.ducks.length >= MAX_DUCKS) return null;

  const baseRadius = computeDuckRadius(scene);
  const duck = createDuck(0, 0, takeNextPalette(scene), baseRadius);
  const targetX = x ?? scene.width * randRange(0.2, 0.8);
  duck.x = clampDuckX(scene, targetX, duck.radius);

  // Drop from just above the waterline with a small toss for a lively splash.
  duck.y = Math.max(duck.radius, scene.restWaterY - duck.radius * (1.6 + Math.random() * 0.6));
  duck.vy = randRange(1.2, 2.0);
  duck.vx = (Math.random() - 0.5) * 0.3;

  scene.ducks.push(duck);

  // Small welcome sparkle.
  emitSparkles(scene, duck.x, duck.y, 3);

  return duck;
}

export function pointHitsDuck(scene: WaterTankScene, x: number, y: number): boolean {
  return findDuckAt(scene, x, y) !== null;
}

// Dunk whichever duck was hit, or fall back to the nearest one so taps on
// open water still feel alive.
export function dunkDuck(scene: WaterTankScene, clickX: number, clickY: number, strength: number): void {
  const target = findDuckAt(scene, clickX, clickY) ?? findNearestDuck(scene, clickX, clickY);
  if (!target) return;

  target.vy += strength * 0.5;
  const offsetFromClick = target.x - clickX;
  const direction = offsetFromClick === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(offsetFromClick);
  target.vx += direction * 0.22;
  target.excitement = Math.min(1, target.excitement + 0.9);
  emitHearts(scene, target.x, target.y - target.radius * 0.4, 3);
}

export function splashAt(scene: WaterTankScene, x: number, strength: number, radius = 36): void {
  // Water surface is purely sinusoidal — we just emit droplets so clicks
  // feel responsive. `radius` scales the jitter so bigger ducks splash wider.
  if (scene.width <= 0) return;
  const count = clampNum(Math.round(strength), 2, 5);
  const splashY = sampleWaterY(scene, x);
  const jitter = Math.max(6, radius * 0.28);
  for (let i = 0; i < count; i += 1) {
    pushParticle(scene, {
      kind: "droplet",
      x: x + (Math.random() - 0.5) * jitter,
      y: splashY,
      vx: (Math.random() - 0.5) * 1.6,
      vy: -randRange(0.8, 2.0),
      life: 600,
      maxLife: 600,
      size: randRange(4, 7),
      rotation: 0,
      growthRate: 0,
    });
  }
}

// ---------- Duck lookup ----------

function findDuckAt(scene: WaterTankScene, x: number, y: number): Duck | null {
  // Iterate topmost-first so the most recently spawned duck wins overlap.
  for (let i = scene.ducks.length - 1; i >= 0; i -= 1) {
    const d = scene.ducks[i];
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.radius * d.radius * 1.6) return d;
  }
  return null;
}

function findNearestDuck(scene: WaterTankScene, x: number, y: number): Duck | null {
  if (scene.ducks.length === 0) return null;
  let best = scene.ducks[0];
  let bestDistSq = Infinity;
  for (const d of scene.ducks) {
    const dx = d.x - x;
    const dy = d.y - y;
    const distSq = dx * dx + dy * dy;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      best = d;
    }
  }
  return best;
}

// ---------- Particles ----------

function pushParticle(scene: WaterTankScene, particle: Particle): void {
  scene.particles.push(particle);
  if (scene.particles.length > MAX_PARTICLES) {
    scene.particles.splice(0, scene.particles.length - MAX_PARTICLES);
  }
}

function emitHearts(scene: WaterTankScene, x: number, y: number, count: number): void {
  for (let i = 0; i < count; i += 1) {
    const life = randRange(HEART_LIFE_MIN_MS, HEART_LIFE_MAX_MS);
    pushParticle(scene, {
      kind: "heart",
      x: x + (Math.random() - 0.5) * 12,
      y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -randRange(0.6, 1.1),
      life,
      maxLife: life,
      size: randRange(6, 9),
      rotation: (Math.random() - 0.5) * 0.6,
      growthRate: randRange(HEART_GROWTH_MIN, HEART_GROWTH_MAX),
    });
  }
}

function emitSparkles(scene: WaterTankScene, x: number, y: number, count: number): void {
  for (let i = 0; i < count; i += 1) {
    pushParticle(scene, {
      kind: "sparkle",
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -randRange(0.4, 0.9),
      life: 700,
      maxLife: 700,
      size: randRange(4, 6),
      rotation: Math.random() * Math.PI,
      growthRate: 0,
    });
  }
}

// ---------- Simulation ----------

export function updateWaterTankScene(scene: WaterTankScene, deltaTime: number): void {
  const steps = clampNum(Math.round(deltaTime / BASELINE_FRAME_MS), 1, 4);
  const stepDelta = deltaTime / steps;
  const frameScale = stepDelta / BASELINE_FRAME_MS;

  for (let step = 0; step < steps; step += 1) {
    for (const duck of scene.ducks) {
      simulateDuckStep(scene, duck, frameScale);
      updateCharmState(duck, stepDelta, frameScale);
    }
  }

  updateParticles(scene, deltaTime);
}

function simulateDuckStep(scene: WaterTankScene, duck: Duck, frameScale: number): void {
  duck.idleClock += frameScale;

  // Vertical: gravity pulls down, buoyancy springs toward the float target.
  const waterY = sampleWaterY(scene, duck.x);
  const floatTarget = waterY - duck.radius * DUCK_FLOAT_OFFSET;
  const buoyancy = (floatTarget - duck.y) * BUOYANCY_SPRING;
  const previousVy = duck.vy;

  duck.vy += (GRAVITY + buoyancy) * frameScale;
  duck.vy *= Math.pow(DUCK_DAMPING, frameScale);
  duck.y += duck.vy * frameScale;

  // Horizontal: drift + wall bounce, with a tiny impulse so ducks don't
  // stall at a perfect zero velocity.
  const bounceMargin = duck.radius * DUCK_BOUNCE_MARGIN_MULT;
  duck.x += duck.vx * frameScale;
  if (duck.x < bounceMargin) {
    duck.x = bounceMargin;
    duck.vx = Math.abs(duck.vx);
  } else if (duck.x > scene.width - bounceMargin) {
    duck.x = scene.width - bounceMargin;
    duck.vx = -Math.abs(duck.vx);
  }
  duck.vx = clampNum(duck.vx, -DUCK_DRIFT_ABS_CAP, DUCK_DRIFT_ABS_CAP);
  duck.vx *= Math.pow(DUCK_DRIFT_DAMPING, frameScale);
  if (Math.abs(duck.vx) < DUCK_DRIFT_MAX) {
    duck.vx += (duck.vx >= 0 ? 1 : -1) * 0.001 * frameScale;
  }

  // Rotation follows local wave slope with a subtle per-duck idle sway.
  const leftY = sampleWaterY(scene, duck.x - duck.radius);
  const rightY = sampleWaterY(scene, duck.x + duck.radius);
  const slope = (rightY - leftY) / (duck.radius * 2);
  const idleSway = Math.sin(scene.phaseTime * 0.0016 + duck.idleClock * 0.05) * 0.04;
  const targetRotation = Math.atan(slope) * 0.8 + idleSway;
  duck.rotation += (targetRotation - duck.rotation) * Math.min(1, 0.2 * frameScale);
}

function updateCharmState(duck: Duck, stepDeltaMs: number, frameScale: number): void {
  // Excitement fades out over time.
  duck.excitement = Math.max(0, duck.excitement - 0.008 * frameScale);

  // Blink state machine: counting down to next blink, or mid-blink.
  if (duck.blinkPhase > 0) {
    duck.blinkPhase -= stepDeltaMs;
    const progress = 1 - Math.max(0, duck.blinkPhase) / BLINK_DURATION_MS;
    duck.blink = Math.sin(Math.min(1, progress) * Math.PI);
    if (duck.blinkPhase <= 0) {
      duck.blink = 0;
      duck.blinkPhase = 0;
      duck.nextBlinkIn = BLINK_NEXT_MIN_MS + Math.random() * (BLINK_NEXT_RANGE_MS - BLINK_NEXT_MIN_MS);
    }
  } else {
    duck.nextBlinkIn -= stepDeltaMs;
    if (duck.nextBlinkIn <= 0) {
      duck.blinkPhase = BLINK_DURATION_MS;
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
    // Hearts float up; droplets and sparkles fall.
    p.vy += (p.kind === "heart" ? -0.02 : 0.04) * frameScale;
    p.vx *= Math.pow(0.98, frameScale);
    p.x += p.vx * frameScale;
    p.y += p.vy * frameScale;
    p.rotation += 0.02 * frameScale;
    if (p.growthRate !== 0) {
      p.size += p.growthRate * deltaTime;
    }
  }
}

// ---------- Water surface sampling ----------

function sampleWaterY(scene: WaterTankScene, x: number): number {
  return sampleFooterWaveY(scene, FOOTER_FRONT_LAYER, x);
}

function sampleFooterWaveY(scene: WaterTankScene, layer: FooterWaveLayer, x: number): number {
  const { width, height, phaseTime } = scene;
  const normalizedX = clampNum(x, 0, width);
  const amplitude = height * layer.amp;
  const baseY = height * layer.base;
  const phase = phaseTime * layer.speed + layer.phaseOffset;

  return baseY + Math.sin(normalizedX * layer.freq + phase) * amplitude + Math.cos(normalizedX * layer.freq * 1.9 + phase * 0.82) * (amplitude * FOOTER_WAVE_HARMONIC_SCALE);
}

// ---------- Rendering ----------

export function drawWaterTankScene(scene: WaterTankScene, _time: number): void {
  const { context, width, height } = scene;
  context.clearRect(0, 0, width, height);

  drawBaseWash(scene);

  // Background wave layers → ducks → foreground wave → surface shimmer.
  for (let i = 0; i < FOOTER_WAVE_LAYERS.length - 1; i += 1) {
    drawFooterWaveLayer(scene, FOOTER_WAVE_LAYERS[i]);
  }

  // Static z-order: render in spawn order so the newest duck always sits
  // on top. No per-frame sorting — otherwise the stacking fights itself
  // as duck.y oscillates on the waves.
  for (const duck of scene.ducks) {
    drawDuck(scene, duck);
  }

  drawFooterWaveLayer(scene, FOOTER_FRONT_LAYER);
  drawSurfaceShimmer(scene);
  drawParticles(scene);
}

function drawBaseWash(scene: WaterTankScene): void {
  const { context, width, height } = scene;
  const wash = context.createLinearGradient(0, height * 0.22, 0, height);
  wash.addColorStop(0, "rgba(88, 230, 255, 0)");
  wash.addColorStop(0.34, "rgba(106, 139, 255, 0.2)");
  wash.addColorStop(0.62, "rgba(176, 107, 255, 0.28)");
  wash.addColorStop(0.84, "rgba(255, 124, 168, 0.34)");
  wash.addColorStop(1, "rgba(255, 143, 94, 0.38)");

  context.save();
  context.fillStyle = wash;
  context.fillRect(0, height * 0.22, width, height * 0.84);
  context.restore();
}

function drawSurfaceShimmer(scene: WaterTankScene): void {
  const { context, width, height } = scene;
  const shimmer = context.createLinearGradient(0, height * 0.34, 0, height);
  shimmer.addColorStop(0, "rgba(255, 255, 255, 0)");
  shimmer.addColorStop(1, "rgba(255, 255, 255, 0.16)");

  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = 0.5;
  context.fillStyle = shimmer;
  context.fillRect(0, height * 0.34, width, height * 0.66);
  context.restore();
}

function drawFooterWaveLayer(scene: WaterTankScene, layer: FooterWaveLayer): void {
  const { context, width } = scene;
  const layerIndex = FOOTER_WAVE_LAYERS.indexOf(layer);
  const gradient = context.createLinearGradient(0, 0, width, 0);
  const paletteLen = SUNSET_WAVE_PALETTE.length;

  for (let i = 0; i < paletteLen; i += 1) {
    gradient.addColorStop(i / (paletteLen - 1), SUNSET_WAVE_PALETTE[(i + layerIndex) % paletteLen]);
  }

  context.save();
  context.globalAlpha = layer.alpha;
  context.fillStyle = gradient;
  buildFooterWaveFillPath(scene, layer);
  context.fill();
  context.restore();
}

function buildFooterWaveFillPath(scene: WaterTankScene, layer: FooterWaveLayer): void {
  const { context, width, height } = scene;
  context.beginPath();
  context.moveTo(0, height);
  for (let x = 0; x <= width + 2; x += 2) {
    context.lineTo(x, sampleFooterWaveY(scene, layer, x));
  }
  context.lineTo(width, height);
  context.closePath();
}

// ---------- Duck rendering ----------

function drawDuck(scene: WaterTankScene, duck: Duck): void {
  drawDuckShadow(scene, duck);

  const { context } = scene;
  context.save();
  context.translate(duck.x, duck.y);
  // Negate rotation when mirrored so the duck still leans with the waves
  // in world space instead of tilting the wrong way.
  context.rotate(duck.rotation * duck.facing);
  context.scale(duck.facing, 1);

  drawDuckBody(context, duck);
  drawDuckHead(context, duck);
  drawDuckFace(scene, context, duck);

  context.restore();
}

function drawDuckShadow(scene: WaterTankScene, duck: Duck): void {
  const { context } = scene;
  const r = duck.radius;
  context.save();
  context.translate(duck.x, sampleWaterY(scene, duck.x) + r * 0.05);
  context.scale(1, 0.32);
  const shadow = context.createRadialGradient(0, 0, 1, 0, 0, r * 1.1);
  shadow.addColorStop(0, SHADOW_COLOR_INNER);
  shadow.addColorStop(1, SHADOW_COLOR_OUTER);
  context.fillStyle = shadow;
  context.beginPath();
  context.arc(0, 0, r * 1.1, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawDuckBody(context: CanvasRenderingContext2D, duck: Duck): void {
  const { palette } = duck;
  const r = duck.radius;

  // Body — vertical palette gradient.
  const body = context.createLinearGradient(0, -r, 0, r);
  body.addColorStop(0, palette.bodyLight);
  body.addColorStop(0.45, palette.bodyMid);
  body.addColorStop(1, palette.bodyDark);
  context.fillStyle = body;
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

  // Tail nub.
  context.fillStyle = palette.tailColor;
  context.beginPath();
  context.moveTo(-r * 1.08, -r * 0.05);
  context.quadraticCurveTo(-r * 1.55, -r * 0.55, -r * 0.95, -r * 0.48);
  context.quadraticCurveTo(-r * 0.85, -r * 0.2, -r * 1.08, -r * 0.05);
  context.closePath();
  context.fill();
}

function drawDuckHead(context: CanvasRenderingContext2D, duck: Duck): void {
  const { palette } = duck;
  const r = duck.radius;
  const hx = r * 0.78;
  const hy = -r * 0.65;
  const hr = r * 0.68;

  // Head.
  const head = context.createRadialGradient(hx - hr * 0.3, hy - hr * 0.3, hr * 0.15, hx, hy, hr);
  head.addColorStop(0, palette.headLight);
  head.addColorStop(1, palette.headBase);
  context.fillStyle = head;
  context.beginPath();
  context.arc(hx, hy, hr, 0, Math.PI * 2);
  context.fill();

  // Head tuft for extra personality.
  context.fillStyle = palette.tuftColor;
  context.beginPath();
  context.moveTo(hx - hr * 0.25, hy - hr * 0.95);
  context.quadraticCurveTo(hx, hy - hr * 1.5, hx + hr * 0.2, hy - hr * 0.95);
  context.quadraticCurveTo(hx, hy - hr * 0.75, hx - hr * 0.25, hy - hr * 0.95);
  context.closePath();
  context.fill();
}

function drawDuckFace(scene: WaterTankScene, context: CanvasRenderingContext2D, duck: Duck): void {
  const { palette } = duck;
  const r = duck.radius;
  const hx = r * 0.78;
  const hy = -r * 0.65;
  const hr = r * 0.68;

  const idleMotion = Math.sin(scene.phaseTime * 0.0032 + duck.idleClock * 0.08);
  const wingSwing = idleMotion * 0.08 + duck.excitement * 0.12;
  const beakOpen = Math.max(0, 0.025 + idleMotion * 0.018 + duck.excitement * 0.15);

  // Wing scallop on the side of the body.
  context.save();
  context.translate(r * 0.2, r * 0.08);
  context.rotate(wingSwing);
  context.translate(-r * 0.2, -r * 0.08);
  context.fillStyle = palette.wingFill;
  context.beginPath();
  context.moveTo(-r * 0.1, -r * 0.14);
  context.quadraticCurveTo(r * 0.12, r * (0.32 + wingSwing * 0.9), r * 0.58, r * (0.24 + wingSwing * 0.55));
  context.quadraticCurveTo(r * 0.28, r * (0.02 - wingSwing * 0.2), -r * 0.1, -r * 0.14);
  context.closePath();
  context.fill();
  context.strokeStyle = palette.wingStroke;
  context.lineWidth = 0.9;
  context.stroke();
  context.restore();

  // Cheek blush — intensifies with excitement.
  context.save();
  context.globalAlpha = 0.4 + duck.excitement * 0.5;
  context.fillStyle = CHEEK_BLUSH;
  context.beginPath();
  context.ellipse(hx - hr * 0.15, hy + hr * 0.35, hr * 0.22, hr * 0.12, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  // Beak — pastel orange for every duck (iconic rubber-duck beak).
  context.fillStyle = BEAK_FILL;
  context.strokeStyle = BEAK_STROKE;
  context.lineWidth = 0.9;
  context.beginPath();
  context.moveTo(hx + hr * 0.65, hy - hr * 0.08);
  context.lineTo(hx + hr * 1.55, hy + hr * 0.02 - beakOpen * hr);
  context.lineTo(hx + hr * 0.75, hy + hr * 0.3 + beakOpen * hr);
  context.closePath();
  context.fill();
  context.stroke();
  if (beakOpen > 0.02) {
    context.strokeStyle = BEAK_STROKE_OPEN;
    context.beginPath();
    context.moveTo(hx + hr * 0.72, hy + hr * 0.14);
    context.lineTo(hx + hr * 1.5, hy + hr * 0.1);
    context.stroke();
  }

  // Eye — blinks occasionally; closed = smile arc.
  const eyeX = hx + hr * 0.28;
  const eyeY = hy - hr * 0.12;
  drawDuckEye(context, palette, eyeX, eyeY, hr, 1 - duck.blink);

  // Brow arc that shows up when excited.
  if (duck.excitement > 0.05) {
    context.save();
    context.globalAlpha = Math.min(1, duck.excitement * 1.2);
    context.strokeStyle = palette.eyeSclera ?? palette.eyePupil;
    context.lineWidth = 1.1;
    context.beginPath();
    context.arc(eyeX, eyeY - hr * 0.35, hr * 0.25, 1.1 * Math.PI, 1.9 * Math.PI);
    context.stroke();
    context.restore();
  }
}

function drawDuckEye(context: CanvasRenderingContext2D, palette: DuckPalette, x: number, y: number, hr: number, eyeOpen: number): void {
  if (eyeOpen <= 0.1) {
    // Closed → happy little arc.
    context.strokeStyle = palette.eyeSclera ?? palette.eyePupil;
    context.lineWidth = 1.3;
    context.beginPath();
    context.arc(x, y, hr * 0.15, 0.2 * Math.PI, 0.8 * Math.PI);
    context.stroke();
    return;
  }

  // Soft sclera so a bright pupil (e.g. black duck) still reads.
  if (palette.eyeSclera) {
    context.fillStyle = palette.eyeSclera;
    context.beginPath();
    context.ellipse(x, y, hr * 0.21, hr * 0.22 * eyeOpen, 0, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = palette.eyePupil;
  context.beginPath();
  context.ellipse(x, y, hr * 0.16, hr * 0.18 * eyeOpen, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = palette.eyeHighlight;
  context.beginPath();
  context.arc(x - hr * 0.05, y - hr * 0.07, hr * 0.055, 0, Math.PI * 2);
  context.fill();
}

// ---------- Particle rendering ----------

function drawParticles(scene: WaterTankScene): void {
  const { context } = scene;
  for (const p of scene.particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    context.save();
    context.globalAlpha = alpha;
    context.translate(p.x, p.y);
    context.rotate(p.rotation);
    switch (p.kind) {
      case "heart":
        drawHeart(context, p.size);
        break;
      case "sparkle":
        drawSparkle(context, p.size);
        break;
      case "droplet":
        drawDroplet(context, p.size);
        break;
    }
    context.restore();
  }
}

function drawHeart(context: CanvasRenderingContext2D, size: number): void {
  context.fillStyle = HEART_COLOR;
  context.strokeStyle = HEART_OUTLINE;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, size * 0.3);
  context.bezierCurveTo(size, -size * 0.4, size * 0.6, -size * 1.1, 0, -size * 0.45);
  context.bezierCurveTo(-size * 0.6, -size * 1.1, -size, -size * 0.4, 0, size * 0.3);
  context.closePath();
  context.fill();
  context.stroke();
}

function drawSparkle(context: CanvasRenderingContext2D, size: number): void {
  context.fillStyle = SPARKLE_COLOR;
  context.beginPath();
  const outer = size;
  const inner = size * 0.35;
  context.moveTo(outer, 0);
  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2;
    const nextAngle = ((i + 1) / 4) * Math.PI * 2;
    context.lineTo(Math.cos(angle + Math.PI / 4) * inner, Math.sin(angle + Math.PI / 4) * inner);
    context.lineTo(Math.cos(nextAngle) * outer, Math.sin(nextAngle) * outer);
  }
  context.closePath();
  context.fill();
}

function drawDroplet(context: CanvasRenderingContext2D, size: number): void {
  context.fillStyle = DROPLET_COLOR;
  context.beginPath();
  context.arc(0, 0, size * 0.4, 0, Math.PI * 2);
  context.fill();
}
