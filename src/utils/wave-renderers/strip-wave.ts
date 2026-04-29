/**
 * Strip wave renderer.
 *
 * Draws three stacked sine-based bands across the bottom of a canvas,
 * sweeping a gradient from one of two palettes. Used for the button/header
 * surfaces where the wave must respond to hover and focus:
 *
 * - `tidal` variant: idle state, brighter palette.
 * - `ribbon` variant: hover/active state, cooler palette.
 *
 * Scene state mirrors the `data-wave-*` contract parsed by
 * {@link readWaveInteractionAttributes}, so hover wiring in
 * `attachWaveHoverInteraction` only needs to mutate `speedMultiplier` and
 * `targetFillProgress` — {@link updateStripWaveScene} handles the smoothing.
 */
import type { WaveSceneBase } from "../wave-engine";
import { readWaveInteractionAttributes } from "../wave-engine";
import { RIBBON_WAVE_PALETTE, TIDAL_WAVE_PALETTE } from "../wave-palettes";

export type StripWaveVariant = "ribbon" | "tidal";

/**
 * Strip-wave scene state extending the base engine shape.
 *
 * `fillProgress` is the currently-rendered fill value in `[0..1]` and is
 * smoothed toward `targetFillProgress` each frame; hover code should flip
 * `targetFillProgress` only and let the lerp settle.
 *
 * When `fillLocked` is `true` the scene initializes with
 * `fillProgress === 1` and stays there regardless of hover — used for the
 * permanently-active state of `Button.astro` (`waveState="active"`).
 */
export interface StripWaveScene extends WaveSceneBase {
  variant: StripWaveVariant;
  hoverSpeedMultiplier: number;
  hoverFillEnabled: boolean;
  fillLocked: boolean;
  fillProgress: number;
  targetFillProgress: number;
}

interface StripWaveSceneOptions {
  variant: StripWaveVariant;
  hoverSpeedMultiplier: number;
  hoverFillEnabled: boolean;
  fillLocked: boolean;
  paused: boolean;
}

const STRIP_WAVE_PALETTES = {
  ribbon: RIBBON_WAVE_PALETTE,
  tidal: TIDAL_WAVE_PALETTE,
} satisfies Record<StripWaveVariant, readonly string[]>;

// Time constant (τ) used by 1 - exp(-Δt/τ) smoothing for fill transitions.
const FILL_TRANSITION_TIME_CONSTANT_MS = 90;

/**
 * Builds a strip-wave scene from a canvas, reading variant and interaction
 * attributes off `data-wave-*`. Unknown variants fall back to `tidal` so
 * typos in templates never produce a blank surface.
 */
export function createStripWaveScene(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): StripWaveScene {
  const variantRaw = canvas.dataset.waveVariant;
  const variant: StripWaveVariant = variantRaw === "ribbon" || variantRaw === "tidal" ? variantRaw : "tidal";
  const interactions = readWaveInteractionAttributes(canvas);
  const options: StripWaveSceneOptions = {
    variant,
    hoverSpeedMultiplier: interactions.hoverSpeedMultiplier,
    hoverFillEnabled: interactions.hoverFillEnabled,
    fillLocked: interactions.fillLocked,
    paused: canvas.dataset.wavePaused === "1",
  };
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

/**
 * Per-frame update hook passed to `mountWaveEngine`. Exponentially eases
 * `fillProgress` toward `targetFillProgress` using a time-constant-based
 * lerp, which makes the animation framerate-independent and stable after
 * long deltas are clamped by the engine.
 *
 * Snaps to the target when the remaining distance is below a small epsilon
 * to avoid a perpetually-animating scene keeping the rAF loop alive.
 */
export function updateStripWaveScene(scene: StripWaveScene, deltaTime: number): void {
  const fillDelta = scene.targetFillProgress - scene.fillProgress;
  const fillLerp = 1 - Math.exp(-deltaTime / FILL_TRANSITION_TIME_CONSTANT_MS);

  if (Math.abs(fillDelta) > 0.001) {
    scene.fillProgress += fillDelta * fillLerp;
  } else {
    scene.fillProgress = scene.targetFillProgress;
  }
}

/**
 * Draws a single strip-wave frame.
 *
 * `dynamicCoverage` is enabled on scenes whose canvas opted into
 * `data-wave-hover-fill`: it adds a gradient wash that grows with
 * `fillProgress`, producing the "ink filling the button" effect on hover.
 * Scenes without hover-fill render the bands only, which is cheaper and
 * visually quieter for idle surfaces.
 */
function renderStripWaveFrame(context: CanvasRenderingContext2D, width: number, height: number, palette: readonly string[], time: number, fillProgress = 0, dynamicCoverage = false): void {
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

export function drawStripWaveScene(scene: StripWaveScene, time: number): void {
  const palette = STRIP_WAVE_PALETTES[scene.variant];
  scene.context.clearRect(0, 0, scene.width, scene.height);
  renderStripWaveFrame(scene.context, scene.width, scene.height, palette, time, scene.fillProgress, scene.hoverFillEnabled);
}
