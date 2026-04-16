/**
 * Astro view-transition-aware lifecycle helpers for wave scenes.
 *
 * Every `<script>` block that calls `mountWaveEngine` needs to re-run on
 * `astro:page-load` (new document swapped in) and tear down on
 * `astro:before-preparation` (old document about to be replaced) to avoid
 * leaking rAF loops, observers, and DOM listeners across navigations.
 *
 * Callers register once via {@link setupWaveLifecycle} with a stable
 * `scopeKey` — this module keeps a per-scope registry so repeat calls
 * (e.g. a component mounted twice, or HMR) replace the previous wiring
 * instead of stacking duplicates.
 *
 * {@link ensureScopedDocumentListener} exposes the same dedupe guarantee for
 * ad-hoc `document` listeners that other wave components need.
 */
type Teardown = () => void;

interface LifecycleState {
  cleanup: Teardown;
  removePageLoadListener: Teardown;
  removeBeforePreparationListener: Teardown;
}

interface SetupWaveLifecycleOptions {
  scopeKey: string;
  init: () => Teardown | void;
}

interface ScopedDocumentListenerOptions {
  scopeKey: string;
  event: string;
  handler: EventListenerOrEventListenerObject;
  options?: AddEventListenerOptions;
}

const lifecycleStates = new Map<string, LifecycleState>();
const scopedDocumentListeners = new Map<string, Teardown>();

const noop = () => {};

const normalizeCleanup = (cleanup: Teardown | void): Teardown => cleanup ?? noop;

const getListenerKey = (scopeKey: string, event: string): string => `${scopeKey}::${event}`;

/**
 * Adds a `document` event listener keyed by `scopeKey` + `event`. If a
 * listener already exists for that key it is removed first, so calling
 * this helper repeatedly (e.g. across view transitions or HMR) never
 * stacks duplicate handlers. The returned teardown detaches the listener
 * and clears the registry entry.
 */
export function ensureScopedDocumentListener({ scopeKey, event, handler, options }: ScopedDocumentListenerOptions): Teardown {
  const listenerKey = getListenerKey(scopeKey, event);
  scopedDocumentListeners.get(listenerKey)?.();

  document.addEventListener(event, handler, options);

  const removeListener = () => {
    document.removeEventListener(event, handler, options);
    if (scopedDocumentListeners.get(listenerKey) === removeListener) {
      scopedDocumentListeners.delete(listenerKey);
    }
  };

  scopedDocumentListeners.set(listenerKey, removeListener);
  return removeListener;
}

/**
 * Tears down a scope's active cleanup and removes its Astro transition
 * listeners. Safe to call for unknown scopes (noop).
 */
export function teardownWaveLifecycle(scopeKey: string): void {
  const state = lifecycleStates.get(scopeKey);
  if (!state) return;

  state.cleanup();
  state.removePageLoadListener();
  state.removeBeforePreparationListener();
  lifecycleStates.delete(scopeKey);
}

/**
 * Invokes `init` immediately and re-invokes it on every Astro
 * `astro:page-load`, tearing down the previous cleanup on
 * `astro:before-preparation`. Returns a teardown that fully unregisters the
 * scope.
 *
 * `init` may return a teardown function or nothing; a missing teardown is
 * treated as a noop, so simple setups don't need to thread cleanup manually.
 *
 * Re-calling with an existing `scopeKey` replaces the previous registration,
 * which makes this safe to call at module scope in components that may be
 * re-hydrated (view transitions, HMR).
 */
export function setupWaveLifecycle({ scopeKey, init }: SetupWaveLifecycleOptions): Teardown {
  teardownWaveLifecycle(scopeKey);

  const state: LifecycleState = {
    cleanup: normalizeCleanup(init()),
    removePageLoadListener: noop,
    removeBeforePreparationListener: noop,
  };

  const handleInit = () => {
    state.cleanup();
    state.cleanup = normalizeCleanup(init());
  };

  const handleBeforePreparation = () => {
    state.cleanup();
    state.cleanup = noop;
  };

  // Scope suffix is only for Astro transition events in this helper, so custom component events
  // can keep their base scope key while still using `ensureScopedDocumentListener` deduping.
  const removePageLoadListener = ensureScopedDocumentListener({
    scopeKey: `${scopeKey}:lifecycle`,
    event: "astro:page-load",
    handler: handleInit,
  });

  const removeBeforePreparationListener = ensureScopedDocumentListener({
    scopeKey: `${scopeKey}:lifecycle`,
    event: "astro:before-preparation",
    handler: handleBeforePreparation,
  });

  state.removePageLoadListener = removePageLoadListener;
  state.removeBeforePreparationListener = removeBeforePreparationListener;
  lifecycleStates.set(scopeKey, state);

  return () => {
    teardownWaveLifecycle(scopeKey);
  };
}
