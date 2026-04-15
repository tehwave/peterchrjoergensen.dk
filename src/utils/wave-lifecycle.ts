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

export function teardownWaveLifecycle(scopeKey: string): void {
  const state = lifecycleStates.get(scopeKey);
  if (!state) return;

  state.cleanup();
  state.removePageLoadListener();
  state.removeBeforePreparationListener();
  lifecycleStates.delete(scopeKey);
}

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
