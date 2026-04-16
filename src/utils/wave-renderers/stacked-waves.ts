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

function traceWaveFill(context: CanvasRenderingContext2D, width: number, height: number, baseY: number, amplitude: number, frequency: number, phase: number, harmonicScale: number): void {
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

  for (const [index, layer] of layers.entries()) {
    const gradient = context.createLinearGradient(0, 0, width, 0);
    for (let colorIndex = 0; colorIndex < SUNSET_WAVE_PALETTE.length; colorIndex += 1) {
      gradient.addColorStop(colorIndex / (SUNSET_WAVE_PALETTE.length - 1), SUNSET_WAVE_PALETTE[(colorIndex + index) % SUNSET_WAVE_PALETTE.length]);
    }

    context.save();
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = layer.alpha;
    context.fillStyle = gradient;
    traceWaveFill(context, width, height, layer.base, layer.amp, layer.freq, time * layer.speed + index * 1.6, 0.22);
    context.fill();
    context.restore();
  }

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
