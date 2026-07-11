export const BLOG_TRANSLATION_KEYS = [
  "adding-comments-with-giscus",
  "building-performance-first-websites",
  "godot-cli-on-macos-zsh",
  "quick-dirty-webrtc-manual-signaling",
  "rebuilt-my-site-with-astro",
  "welcome",
] as const;

export const PROJECT_TRANSLATION_KEYS = ["browser-multiplayer", "github-brick-breaker"] as const;

export const DANISH_BLOG_TRANSLATION_KEYS = [...BLOG_TRANSLATION_KEYS] as const;
export const DANISH_PROJECT_TRANSLATION_KEYS = [...PROJECT_TRANSLATION_KEYS] as const;

export const PUBLIC_CONTENT_PATHS = [
  "/",
  "/blog/",
  ...BLOG_TRANSLATION_KEYS.map((translationKey) => `/blog/${translationKey}/`),
  ...PROJECT_TRANSLATION_KEYS.map((translationKey) => `/projects/${translationKey}/`),
] as const;

export const DANISH_CONTENT_PATHS = new Set<string>([
  "/",
  "/blog/",
  ...DANISH_BLOG_TRANSLATION_KEYS.map((translationKey) => `/blog/${translationKey}/`),
  ...DANISH_PROJECT_TRANSLATION_KEYS.map((translationKey) => `/projects/${translationKey}/`),
]);
