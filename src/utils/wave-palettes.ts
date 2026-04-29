/**
 * Shared 5-stop color palettes used by every wave renderer on the site.
 *
 * Exported as `as const` tuples so renderers can index into them safely and
 * rotate stops via `(i + layer) % palette.length` without cloning arrays.
 * Adding a new wave variant should prefer reusing one of these palettes so
 * header, footer, and button surfaces stay visually coherent.
 */

// Cool-to-warm gradient used by the ribbon strip variant (hover/active
// buttons and the header logo). Also reused by the footer stacked waves as
// SUNSET_WAVE_PALETTE — the two aliases exist to keep usage sites readable,
// not because the color values differ.
export const RIBBON_WAVE_PALETTE = ["#58e6ff", "#6a8bff", "#b06bff", "#ff7ca8", "#ff8f5e"] as const;

// Brighter, more saturated variant used by default (idle) buttons so the
// resting state reads as "cooler" than hover without changing shape.
export const TIDAL_WAVE_PALETTE = ["#8df7ff", "#5ab2ff", "#9688ff", "#ff8be1", "#ffc97a"] as const;

export const SUNSET_WAVE_PALETTE = ["#58e6ff", "#6a8bff", "#b06bff", "#ff7ca8", "#ff8f5e"] as const;
