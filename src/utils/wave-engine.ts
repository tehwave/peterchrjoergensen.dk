export interface WaveSceneBase {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  visible: boolean;
  phaseTime: number;
  speedMultiplier: number;
  paused: boolean;
}

export interface WaveInteractionAttributes {
  hoverSpeedMultiplier: number;
  hoverFillEnabled: boolean;
  fillLocked: boolean;
}

interface CanvasDiscoveryOptions {
  root?: ParentNode;
  rootSelector?: string;
  canvasSelector: string;
}

interface SyncCanvasSceneSizeOptions {
  minWidth: number;
  minHeight: number;
  maxDpr?: number;
}

interface WaveEngineSceneMountContext<Scene extends WaveSceneBase> {
  scene: Scene;
  sceneIndex: number;
  reduceMotionQuery: MediaQueryList;
  registerCleanup: (cleanup: () => void) => void;
  renderStatic: () => void;
  updatePlayback: () => void;
}

interface MountWaveEngineOptions<Scene extends WaveSceneBase> extends CanvasDiscoveryOptions {
  createScene: (options: { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D; index: number }) => Scene | null;
  drawScene: (scene: Scene, time: number) => void;
  size?: SyncCanvasSceneSizeOptions;
  syncSceneSize?: (scene: Scene) => void;
  updateScene?: (scene: Scene, deltaTime: number) => void;
  onSceneMount?: (context: WaveEngineSceneMountContext<Scene>) => void;
  shouldAnimateScene?: (scene: Scene) => boolean;
  intersectionThreshold?: number;
  reducedMotionQuery?: string;
  staticTime?: number;
}

interface WaveHoverInteractionOptions {
  canvas: HTMLCanvasElement;
  hoverSpeedMultiplier: number;
  hoverFillEnabled: boolean;
  fillLocked: boolean;
  setSpeedMultiplier: (value: number) => void;
  setTargetFillProgress: (value: number) => void;
  setFillProgress: (value: number) => void;
  isReducedMotion: () => boolean;
  renderStatic: () => void;
  targetSelector?: string;
}

const noop = () => {};
const BASELINE_FRAME_MS = 16.67;
const MAX_FRAME_MS = 40;

export function discoverWaveCanvases({ root, rootSelector, canvasSelector }: CanvasDiscoveryOptions): HTMLCanvasElement[] {
  const rootNode = root ?? document;
  const scope = rootSelector ? rootNode.querySelector(rootSelector) : rootNode;
  if (!scope) return [];

  const nodes = Array.from(scope.querySelectorAll(canvasSelector));
  return nodes.filter((node): node is HTMLCanvasElement => node instanceof HTMLCanvasElement);
}

export function syncCanvasSceneSize<Scene extends WaveSceneBase>(scene: Scene, options: SyncCanvasSceneSizeOptions): void {
  const rect = scene.canvas.getBoundingClientRect();
  const maxDpr = options.maxDpr ?? 2;

  scene.width = Math.max(options.minWidth, Math.floor(rect.width));
  scene.height = Math.max(options.minHeight, Math.floor(rect.height));
  scene.dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

  scene.canvas.width = Math.max(1, Math.floor(scene.width * scene.dpr));
  scene.canvas.height = Math.max(1, Math.floor(scene.height * scene.dpr));
  scene.context.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
}

export function readWaveInteractionAttributes(canvas: HTMLCanvasElement): WaveInteractionAttributes {
  // Shared data-wave-* contract emitted by Button.astro and consumed by wave scenes.
  // data-wave-hover-speed: hover speed multiplier (clamped to [1..4])
  // data-wave-hover-fill: toggle fill transitions on hover/focus
  // data-wave-fill-locked: force a permanently filled state
  const hoverSpeedRaw = Number(canvas.dataset.waveHoverSpeed ?? "1");

  return {
    hoverSpeedMultiplier: Number.isFinite(hoverSpeedRaw) ? Math.min(Math.max(hoverSpeedRaw, 1), 4) : 1,
    hoverFillEnabled: canvas.dataset.waveHoverFill === "1",
    fillLocked: canvas.dataset.waveFillLocked === "1",
  };
}

export function attachWaveHoverInteraction({
  canvas,
  hoverSpeedMultiplier,
  hoverFillEnabled,
  fillLocked,
  setSpeedMultiplier,
  setTargetFillProgress,
  setFillProgress,
  isReducedMotion,
  renderStatic,
  targetSelector = ".button-sample",
}: WaveHoverInteractionOptions): () => void {
  if (fillLocked || (!hoverFillEnabled && hoverSpeedMultiplier <= 1)) {
    return noop;
  }

  const hoverTarget = canvas.closest(targetSelector);
  if (!(hoverTarget instanceof HTMLElement)) {
    return noop;
  }

  const updateHoverState = (isActive: boolean) => {
    setSpeedMultiplier(isActive ? hoverSpeedMultiplier : 1);

    if (!hoverFillEnabled) return;

    const nextFillProgress = isActive ? 1 : 0;
    setTargetFillProgress(nextFillProgress);

    if (isReducedMotion()) {
      setFillProgress(nextFillProgress);
      renderStatic();
    }
  };

  const activate = () => updateHoverState(true);
  const deactivate = () => updateHoverState(false);

  hoverTarget.addEventListener("mouseenter", activate);
  hoverTarget.addEventListener("mouseleave", deactivate);
  hoverTarget.addEventListener("focusin", activate);
  hoverTarget.addEventListener("focusout", deactivate);

  return () => {
    hoverTarget.removeEventListener("mouseenter", activate);
    hoverTarget.removeEventListener("mouseleave", deactivate);
    hoverTarget.removeEventListener("focusin", activate);
    hoverTarget.removeEventListener("focusout", deactivate);
  };
}

export function mountWaveEngine<Scene extends WaveSceneBase>({
  root,
  rootSelector,
  canvasSelector,
  createScene,
  drawScene,
  size,
  syncSceneSize,
  updateScene,
  onSceneMount,
  shouldAnimateScene,
  intersectionThreshold,
  reducedMotionQuery = "(prefers-reduced-motion: reduce)",
  staticTime,
}: MountWaveEngineOptions<Scene>): () => void {
  const canvases = discoverWaveCanvases({ root, rootSelector, canvasSelector });
  if (canvases.length === 0) return noop;

  const scenes = canvases
    .map((canvas, index) => {
      const context = canvas.getContext("2d", { alpha: true });
      if (!context) return null;
      return createScene({ canvas, context, index });
    })
    .filter((scene): scene is Scene => Boolean(scene));

  if (scenes.length === 0) return noop;

  const syncSceneDimensions = (() => {
    if (syncSceneSize) {
      return syncSceneSize;
    }

    if (!size) {
      return undefined;
    }

    return (scene: Scene) => {
      syncCanvasSceneSize(scene, size);
    };
  })();

  const reduceMotionMediaQuery = window.matchMedia(reducedMotionQuery);
  const cleanupCallbacks: Array<() => void> = [];
  const sceneShouldAnimate = shouldAnimateScene ?? ((scene: Scene) => scene.visible);
  let frameId: number | null = null;
  let lastFrameTimestamp: number | null = null;
  let pageVisible = !document.hidden;
  let observer: IntersectionObserver | null = null;

  const stopLoop = () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    lastFrameTimestamp = null;
  };

  const renderStatic = () => {
    for (const scene of scenes) {
      const time = staticTime ?? scene.phaseTime;
      drawScene(scene, time);
    }
  };

  const updatePlayback = () => {
    const hasVisibleScene = scenes.some((scene) => sceneShouldAnimate(scene));
    const shouldAnimate = !reduceMotionMediaQuery.matches && pageVisible && hasVisibleScene;

    if (!shouldAnimate) {
      stopLoop();
      renderStatic();
      return;
    }

    if (frameId === null) {
      frameId = requestAnimationFrame(renderFrame);
    }
  };

  const renderFrame = (timestamp: number) => {
    const deltaTime = lastFrameTimestamp === null ? BASELINE_FRAME_MS : Math.min(MAX_FRAME_MS, Math.max(0, timestamp - lastFrameTimestamp));
    lastFrameTimestamp = timestamp;

    for (const scene of scenes) {
      if (!sceneShouldAnimate(scene)) continue;

      updateScene?.(scene, deltaTime);

      if (!scene.paused) {
        scene.phaseTime += deltaTime * scene.speedMultiplier;
      }

      drawScene(scene, scene.phaseTime);
    }

    frameId = requestAnimationFrame(renderFrame);
  };

  for (const [sceneIndex, scene] of scenes.entries()) {
    syncSceneDimensions?.(scene);

    onSceneMount?.({
      scene,
      sceneIndex,
      reduceMotionQuery: reduceMotionMediaQuery,
      registerCleanup: (cleanup) => {
        cleanupCallbacks.push(cleanup);
      },
      renderStatic,
      updatePlayback,
    });
  }

  if (typeof intersectionThreshold === "number") {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target;
          if (!(target instanceof HTMLCanvasElement)) continue;

          const scene = scenes.find((item) => item.canvas === target);
          if (!scene) continue;

          scene.visible = entry.isIntersecting;
        }

        updatePlayback();
      },
      { threshold: intersectionThreshold },
    );

    for (const scene of scenes) {
      observer.observe(scene.canvas);
    }
  }

  const handleResize = () => {
    for (const scene of scenes) {
      syncSceneDimensions?.(scene);
    }

    updatePlayback();
  };

  const handlePageVisibilityChange = () => {
    pageVisible = !document.hidden;
    updatePlayback();
  };

  const handleMotionChange = () => {
    updatePlayback();
  };

  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("visibilitychange", handlePageVisibilityChange);
  reduceMotionMediaQuery.addEventListener("change", handleMotionChange);

  updatePlayback();

  return () => {
    stopLoop();
    observer?.disconnect();
    cleanupCallbacks.forEach((cleanup) => cleanup());
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("visibilitychange", handlePageVisibilityChange);
    reduceMotionMediaQuery.removeEventListener("change", handleMotionChange);
  };
}
