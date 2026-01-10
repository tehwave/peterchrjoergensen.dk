export interface FathomClient {
  trackEvent: (name: string, value?: number) => void;
  trackGoal?: (code: string, value?: number) => void;
  setSite?: (siteId: string) => void;
  enableAutoTracking?: () => void;
  blockTrackingForMe?: () => void;
}

export type TrackEvent = (name: string, value?: number) => void;

const getFathomClient = (): FathomClient | undefined => {
  if (typeof window === "undefined") return undefined;
  return window.fathom ?? globalThis.fathom;
};

export const trackEvent: TrackEvent = (name, value) => {
  const client = getFathomClient();
  if (!client?.trackEvent || !name) return;
  client.trackEvent(name, value);
};

const attachGlobalTrackEvent = () => {
  if (typeof window === "undefined") return;

  if (typeof window.trackEvent !== "function") {
    window.trackEvent = trackEvent;
  }

  if (typeof globalThis.trackEvent !== "function") {
    globalThis.trackEvent = trackEvent;
  }
};

attachGlobalTrackEvent();

declare global {
  interface Window {
    fathom?: FathomClient;
    trackEvent?: TrackEvent;
  }

  var fathom: FathomClient | undefined;
  var trackEvent: TrackEvent | undefined;
}

export {};
