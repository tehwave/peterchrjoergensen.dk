import type { WaveSceneBase } from "../wave-engine";
import { PROJECT_CARD_WAVE_PALETTE } from "../wave-palettes";

export interface ProjectCardWaveScene extends WaveSceneBase {
  phaseOffset: number;
}

export function createProjectCardWaveScene(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, index: number): ProjectCardWaveScene {
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
    phaseOffset: index * 0.65,
  };
}

export function drawProjectCardWaveScene(scene: ProjectCardWaveScene, time: number): void {
  const { context, width, height, phaseOffset } = scene;
  const baseY = height * 0.7;
  const maxAmplitude = 10;

  context.clearRect(0, 0, width, height);

  for (let layer = 0; layer < 3; layer += 1) {
    const gradient = context.createLinearGradient(0, 0, width, 0);
    for (let index = 0; index < PROJECT_CARD_WAVE_PALETTE.length; index += 1) {
      gradient.addColorStop(index / (PROJECT_CARD_WAVE_PALETTE.length - 1), PROJECT_CARD_WAVE_PALETTE[(index + layer) % PROJECT_CARD_WAVE_PALETTE.length]);
    }

    const amplitude = maxAmplitude - layer * 2;
    const frequency = 0.012 + layer * 0.0018;
    const phase = time * (0.00022 + layer * 0.00005) + phaseOffset + layer * 0.8;

    context.save();
    context.globalCompositeOperation = "screen";
    context.globalAlpha = 0.5 - layer * 0.09;
    context.strokeStyle = gradient;
    context.fillStyle = gradient;
    context.lineWidth = 1.5;
    context.beginPath();

    for (let x = 0; x <= width + 2; x += 3) {
      const waveY = baseY + Math.sin(x * frequency + phase) * amplitude + Math.cos(x * frequency * 1.76 + phase * 0.84) * (amplitude * 0.34);
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
}
