import { readFileSync, writeFileSync } from 'fs';

const file = 'src/utils/wave-renderers/water-tank.ts';
let code = readFileSync(file, 'utf8');

// 1. Add PHYSICS constants
code = code.replace(
  '// Cheap cap so spam clicks don\'t compound.',
  `const PHYSICS_WAVE_FREQ = 0.015;
const PHYSICS_WAVE_SPEED = -0.001;
// Cheap cap so spam clicks don't compound.`
);

// 2. Modify sampleWaterY to include the math wave
code = code.replace(
  `function sampleWaterY(scene: WaterTankScene, x: number): number {
  const { points, restWaterY, width } = scene;
  if (points.length === 0) return restWaterY;
  const clampedX = Math.min(width, Math.max(0, x));
  const segmentWidth = width / (points.length - 1);
  const index = clampedX / segmentWidth;
  const i0 = Math.floor(index);
  const i1 = Math.min(points.length - 1, i0 + 1);
  const t = index - i0;
  const offset = points[i0].offset * (1 - t) + points[i1].offset * t;
  return restWaterY + offset;
}`,
  `function sampleWaterY(scene: WaterTankScene, x: number): number {
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
}`
);

// 3. Rewrite drawWaterTankScene to use the math wave inside the physics layer + one overlay wave
const drawSceneTarget = `export function drawWaterTankScene(scene: WaterTankScene, _time: number): void {
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

  if (points.length > 0) {
    context.strokeStyle = "rgba(255, 255, 255, 0.4)";
    context.lineWidth = 1.2;
    context.stroke();
  }
  context.restore();

  // 4. Duck floating ON the physics layer
  drawDuck(scene);

  // 5. Single Foreground Overlay Wave (overlaps the duck for depth)
  const fgColor = SUNSET_WAVE_PALETTE[(frontIndex + 1) % SUNSET_WAVE_PALETTE.length];
  context.save();
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 0.85;
  context.fillStyle = fgColor;
  context.beginPath();
  context.moveTo(0, height);
  for (let x = 0; x <= width + 5; x += 5) {
    const y = restWaterY + height * 0.06 + Math.sin(x * 0.018 + sceneClockMs * 0.0012) * (height * 0.045);
    context.lineTo(x, y);
  }
  context.lineTo(width, height);
  context.closePath();
  context.fill();
  context.restore();

  // 6. Shimmer from Footer
  const shimmer = context.createLinearGradient(0, restWaterY * 0.8, 0, height);
  shimmer.addColorStop(0, "rgba(255, 255, 255, 0)");
  shimmer.addColorStop(1, "rgba(255, 255, 255, 0.2)");

  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = 0.4;
  context.fillStyle = shimmer;
  context.fillRect(0, restWaterY * 0.8, width, height - restWaterY * 0.8);
  context.restore();

  drawParticles(scene);
}`;

code = code.replace(/export function drawWaterTankScene\(scene: WaterTankScene, _time: number\): void \{([\s\S]*?)function drawDuck\(scene: WaterTankScene\): void \{/, drawSceneTarget + '\n\nfunction drawDuck(scene: WaterTankScene): void {');

writeFileSync(file, code);
console.log('done');
