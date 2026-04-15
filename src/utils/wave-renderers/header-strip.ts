import type { WaveSceneBase } from "../wave-engine";
import { readWaveInteractionAttributes } from "../wave-engine";
import { HEADER_RIBBON_WAVE_PALETTE, HEADER_TIDAL_WAVE_PALETTE } from "../wave-palettes";

export type HeaderWaveVariant = "ribbon" | "tidal";

export interface HeaderStripScene extends WaveSceneBase {
  variant: HeaderWaveVariant;
  hoverSpeedMultiplier: number;
  hoverFillEnabled: boolean;
  fillLocked: boolean;
  fillProgress: number;
  targetFillProgress: number;
}

export interface HeaderStripSceneOptions {
  variant: HeaderWaveVariant;
  hoverSpeedMultiplier: number;
  hoverFillEnabled: boolean;
  fillLocked: boolean;
  paused: boolean;
}

const HEADER_WAVE_PALETTES = {
  ribbon: HEADER_RIBBON_WAVE_PALETTE,
  tidal: HEADER_TIDAL_WAVE_PALETTE,
} satisfies Record<HeaderWaveVariant, readonly string[]>;
// Time constant (τ) used by 1 - exp(-Δt/τ) smoothing for fill transitions.
const FILL_TRANSITION_TIME_CONSTANT_MS = 90;

export function parseHeaderStripSceneOptions(canvas: HTMLCanvasElement): HeaderStripSceneOptions {
  const variantRaw = canvas.dataset.waveVariant;
  const variant: HeaderWaveVariant = variantRaw === "ribbon" || variantRaw === "tidal" ? variantRaw : "tidal";
  const interactions = readWaveInteractionAttributes(canvas);

  return {
    variant,
    hoverSpeedMultiplier: interactions.hoverSpeedMultiplier,
    hoverFillEnabled: interactions.hoverFillEnabled,
    fillLocked: interactions.fillLocked,
    paused: canvas.dataset.wavePaused === "1",
  };
}

export function createHeaderStripScene(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): HeaderStripScene {
  const options = parseHeaderStripSceneOptions(canvas);
  const fillProgress = options.fillLocked ? 1 : 0;

  return {
    canvas,
    context,
    width: 0,
    height: 0,
    dpr: 1,
    visible: true,
    phaseTime: 0,
    speedMultiplier: 1,
    paused: options.paused,
    variant: options.variant,
    hoverSpeedMultiplier: options.hoverSpeedMultiplier,
    hoverFillEnabled: options.hoverFillEnabled,
    fillLocked: options.fillLocked,
    fillProgress,
    targetFillProgress: fillProgress,
  };
}

export function updateHeaderStripScene(scene: HeaderStripScene, deltaTime: number): void {
  const fillDelta = scene.targetFillProgress - scene.fillProgress;
  const fillLerp = 1 - Math.exp(-deltaTime / FILL_TRANSITION_TIME_CONSTANT_MS);

  if (Math.abs(fillDelta) > 0.001) {
    scene.fillProgress += fillDelta * fillLerp;
  } else {
    scene.fillProgress = scene.targetFillProgress;
  }
}

function drawWaveStrip(context: CanvasRenderingContext2D, width: number, height: number, palette: readonly string[], time: number, fillProgress = 0, dynamicCoverage = false): void {
  const clampedFillProgress = Math.min(Math.max(fillProgress, 0), 1);
  const boostedFillProgress = Math.min(1.3, clampedFillProgress * 1.3);
  const coverageProgress = Math.pow(clampedFillProgress, 0.84);
  const bandTop = Math.max(-height * 0.22, height * (0.7 - boostedFillProgress * 0.7));
  const baseY = height * (0.86 - boostedFillProgress * 0.58);
  const maxAmplitude = 10 + boostedFillProgress * 18;
  const lineAlpha = 0.46 + clampedFillProgress * 0.2;

  if (dynamicCoverage && coverageProgress > 0.0001) {
    const coverageGradient = context.createLinearGradient(0, 0, width, height);
    coverageGradient.addColorStop(0, palette[0]);
    coverageGradient.addColorStop(0.46, palette[2]);
    coverageGradient.addColorStop(1, palette[4]);

    context.save();
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = Math.min(1, coverageProgress * 0.96);
    context.fillStyle = coverageGradient;
    context.fillRect(0, 0, width, height);
    context.restore();
  }

  for (let layer = 0; layer < 3; layer += 1) {
    const gradient = context.createLinearGradient(0, 0, width, 0);
    for (let index = 0; index < palette.length; index += 1) {
      gradient.addColorStop(index / (palette.length - 1), palette[(index + layer) % palette.length]);
    }

    const amplitude = Math.max(2.8, maxAmplitude - layer * (2 + boostedFillProgress * 0.9));
    const frequency = 0.0145 + layer * 0.0032;
    const phase = time * (0.0002 + layer * 0.00005) + layer * 0.6;

    context.save();
    context.globalCompositeOperation = "screen";
    context.globalAlpha = lineAlpha - layer * 0.08;
    context.strokeStyle = gradient;
    context.fillStyle = gradient;
    context.lineWidth = 1.6;
    context.beginPath();

    for (let x = 0; x <= width + 2; x += 3) {
      const primaryWave = Math.sin(x * frequency + phase) * amplitude;
      const harmonicWave = Math.cos(x * frequency * 2.05 + phase * 0.9) * (amplitude * 0.42);
      const crestDetail = Math.sin(x * frequency * 3.45 + phase * 1.55) * (amplitude * 0.28);
      const microCrest = Math.sin(x * frequency * 5.6 + phase * 2.05) * (amplitude * 0.11);
      const rawDisplacement = primaryWave + harmonicWave + crestDetail + microCrest;
      const crestShape = rawDisplacement < 0 ? Math.pow(Math.abs(rawDisplacement), 1.18) : -Math.pow(rawDisplacement, 0.92);
      const crestBoostedDisplacement = crestShape < 0 ? crestShape * 2.35 : crestShape;
      const waveY = baseY + crestBoostedDisplacement;

      if (x === 0) {
        context.moveTo(x, waveY);
      } else {
        context.lineTo(x, waveY);
      }
    }

    context.lineTo(width, height + 4);
    context.lineTo(0, height + 4);
    context.closePath();
    context.fill();
    context.restore();
  }

  const topGlow = context.createLinearGradient(0, bandTop, 0, height);
  topGlow.addColorStop(0, "rgba(255, 255, 255, 0)");
  topGlow.addColorStop(1, "rgba(255, 255, 255, 0.16)");

  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = dynamicCoverage ? coverageProgress * 0.26 : 0.18 + clampedFillProgress * 0.12;
  context.fillStyle = topGlow;
  context.fillRect(0, bandTop, width, Math.max(1, height - bandTop));
  context.restore();
}

export function drawHeaderStripScene(scene: HeaderStripScene, time: number): void {
  const palette = HEADER_WAVE_PALETTES[scene.variant];
  scene.context.clearRect(0, 0, scene.width, scene.height);
  drawWaveStrip(scene.context, scene.width, scene.height, palette, time, scene.fillProgress, scene.hoverFillEnabled);
}
