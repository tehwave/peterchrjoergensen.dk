/**
 * Stacked waves renderer (sunset variant).
 *
 * Used by the footer divider. Paints four sine-based fill layers
 * stacked vertically.
 * Unlike the strip renderer there is no hover/fill state — the footer wave
 * is purely ambient, so the scene shape is just `WaveSceneBase`.
 */
import type { WaveSceneBase } from "../wave-engine";
import { SUNSET_WAVE_PALETTE } from "../wave-palettes";

export type StackedWaveScene = WaveSceneBase;

export function createStackedWaveScene(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): StackedWaveScene {
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
  };
}

function buildWaveFillPath(context: CanvasRenderingContext2D, width: number, height: number, baseY: number, amplitude: number, frequency: number, phase: number, harmonicScale: number): void {
  context.beginPath();
  context.moveTo(0, height);

  for (let x = 0; x <= width + 2; x += 2) {
    const y = baseY + Math.sin(x * frequency + phase) * amplitude + Math.cos(x * frequency * 1.9 + phase * 0.82) * (amplitude * harmonicScale);
    context.lineTo(x, y);
  }

  context.lineTo(width, height);
  context.closePath();
}

export function drawStackedWaveScene(scene: StackedWaveScene, time: number): void {
  const { context, width, height } = scene;
  context.clearRect(0, 0, width, height);

  const layers = [
    // base: vertical position, amp: wave height, freq: oscillation density, speed: phase velocity, alpha: layer opacity.
    { base: height * 0.44, amp: height * 0.098, freq: 0.0101, speed: 0.0011, alpha: 0.72 },
    { base: height * 0.55, amp: height * 0.082, freq: 0.0122, speed: -0.0013, alpha: 0.62 },
    { base: height * 0.66, amp: height * 0.066, freq: 0.0137, speed: 0.00156, alpha: 0.52 },
    { base: height * 0.75, amp: height * 0.052, freq: 0.015, speed: -0.00188, alpha: 0.44 },
  ] as const;

  for (const [index, layer] of layers.entries()) {
    const gradient = context.createLinearGradient(0, 0, width, 0);
    for (let colorIndex = 0; colorIndex < SUNSET_WAVE_PALETTE.length; colorIndex += 1) {
      gradient.addColorStop(colorIndex / (SUNSET_WAVE_PALETTE.length - 1), SUNSET_WAVE_PALETTE[(colorIndex + index) % SUNSET_WAVE_PALETTE.length]);
    }

    context.save();
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = layer.alpha;
    context.fillStyle = gradient;
    buildWaveFillPath(context, width, height, layer.base, layer.amp, layer.freq, time * layer.speed + index * 1.6, 0.22);
    context.fill();
    context.restore();
  }
}
