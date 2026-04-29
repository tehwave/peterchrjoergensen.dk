/**
 * Shared canvas wave engine.
 *
 * Provides the scene shape, canvas discovery/sizing helpers, hover-interaction
 * wiring, and a `requestAnimationFrame` driver used by every wave surface on
 * the site (header logo button, footer wave, standalone `Button.astro`
 * instances, and the Groovy Waves experiment). Renderers stay pure: each
 * renderer owns a `createScene` / `drawScene` pair and plugs into
 * `mountWaveEngine` through the generic `Scene extends WaveSceneBase` slot.
 *
 * Responsibilities kept in this module:
 * - Honor `prefers-reduced-motion`, tab visibility, and viewport intersection
 *   so offscreen / hidden scenes do not burn frames.
 * - Clamp delta-time to avoid huge jumps after a tab resumes from background.
 * - Standardize the `data-wave-*` attribute contract emitted by `Button.astro`
 *   and consumed by `wave-renderers/strip-wave.ts`.
 */

/**
 * Minimal shape every wave scene must satisfy so the shared loop can size,
 * schedule, and throttle it without knowing renderer-specific state.
 *
 * `phaseTime` is a monotonically-increasing scene clock driven by the loop
 * (scaled by `speedMultiplier`); renderers read it as their `time` input and
 * must not mutate it directly — toggle `paused` instead.
 */
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

/**
 * Normalized values read off the `data-wave-*` attributes authored in
 * `Button.astro`. Produced by {@link readWaveInteractionAttributes} and
 * stored on strip-wave scenes so {@link attachWaveHoverInteraction} can wire
 * hover/focus behavior without re-parsing the DOM.
 */
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
// Assumed ~60fps baseline used when we have no previous timestamp to diff
// against (first frame, or right after a pause). Keeps the first update from
// integrating a 0ms or multi-second delta.
const BASELINE_FRAME_MS = 16.67;
// Upper bound on per-frame delta. When a tab is backgrounded rAF pauses but
// `performance.now()` keeps counting, so the first frame after resume can
// report hundreds of ms. Capping avoids phase jumps and fill-lerp overshoot.
const MAX_FRAME_MS = 40;

/**
 * Collects every `<canvas>` matching `canvasSelector` inside an optional
 * scope (`root` element or `rootSelector` lookup). Returns an empty array
 * when the scope is missing so `mountWaveEngine` can early-exit on pages
 * that do not render the component.
 */
export function discoverWaveCanvases({ root, rootSelector, canvasSelector }: CanvasDiscoveryOptions): HTMLCanvasElement[] {
  const rootNode = root ?? document;
  const scope = rootSelector ? rootNode.querySelector(rootSelector) : rootNode;
  if (!scope) return [];

  const nodes = Array.from(scope.querySelectorAll(canvasSelector));
  return nodes.filter((node): node is HTMLCanvasElement => node instanceof HTMLCanvasElement);
}

/**
 * Resizes a scene's backing canvas to match its CSS box, accounting for
 * device pixel ratio. Clamps to a sensible floor (`minWidth`/`minHeight`)
 * so zero-sized layouts during hydration still produce a valid context,
 * and caps DPR (default 2) to keep fill-rate reasonable on HiDPI displays.
 *
 * Applies `setTransform(dpr, 0, 0, dpr, 0, 0)` so renderers can draw in CSS
 * pixels without manually scaling every coordinate.
 */
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

/**
 * Wires `mouseenter` / `mouseleave` / `focusin` / `focusout` on the closest
 * `targetSelector` ancestor so hover and keyboard focus share behavior.
 *
 * Returns a noop when nothing interactive is configured (neither a speed
 * boost nor a fill toggle) or when the ancestor cannot be located, so
 * callers can register the result unconditionally.
 *
 * Under `prefers-reduced-motion` the transition is skipped: `setFillProgress`
 * is called directly with the target value and a static frame is rendered,
 * preserving the visual state change without the lerp animation.
 */
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

/**
 * Discovers canvases, creates per-scene state, and runs a single shared
 * `requestAnimationFrame` loop that draws each scene. Returns a teardown
 * function that cancels the loop, detaches observers/listeners, and invokes
 * any per-scene cleanups registered via `onSceneMount`.
 *
 * The loop is self-throttling and only runs when all of the following hold:
 * - the document is visible (`visibilitychange`),
 * - `prefers-reduced-motion` is not set,
 * - at least one scene reports `shouldAnimateScene` (defaults to `scene.visible`).
 *
 * When animation is paused the engine renders a single static frame so the
 * surface never goes blank. Pass `staticTime` to pin that static frame to a
 * deterministic phase (used by the footer to avoid a random first paint).
 *
 * Pass `intersectionThreshold` to opt into `IntersectionObserver`-driven
 * visibility tracking; omit it (e.g. the footer, which is always onscreen
 * when mounted) to keep scenes animating regardless of viewport position.
 */
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
