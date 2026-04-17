# Plan: Implement Interactive Water Tank 🌊🦆

## Goal
Add a playful, interactive "Water Tank" micro-component to the `.about__left` column of `src/components/About.astro`. This bridges Peter's web and game dev expertise using a performance-first, custom 2D fluid simulation (leveraging the existing `wave-engine.ts`) with a cute, physics-driven floating entity (like a duck, boat, or simple shape).

## Constraints & Preferences
- **High-Craft Aesthetics**: Must look visually polished, beautiful, and fit the existing site's dark/vibrant theme.
- **Performance First**: Must not block the main thread. Should pause when out of viewport (using `IntersectionObserver` or existing wave lifecycle).
- **Existing Tech**: Re-use `src/utils/wave-engine.ts`, `src/utils/wave-lifecycle.ts`, and palettes.

## Implementation Steps

### 1. Create `src/components/WaterTank.astro`
- **Markup**: 
  - A highly styled wrapper (e.g., rounded corners, subtle inner shadow).
  - A `<canvas>` element for the wave engine.
  - An absolutely positioned DOM element (or draw directly to canvas) for the "floating pet".
- **Styling (`<style lang="scss">`)**:
  - Load `_variables.scss` and `_mixins.scss`.
  - Ensure the tank is responsive but maintains a nice aspect ratio (e.g., a square or elegant vertical block).

### 2. Client-Side Physics Script (Inside `WaterTank.astro`)
- **Wave Setup**: 
  - Initialize a new wave instance utilizing the project's standard lifecycle (`setupWaveLifecycle` / `mountWaveEngine` if applicable).
  - Apply a custom palette from `wave-palettes.ts` (e.g., a bright, liquid blue or neon).
- **Pet Physics**:
  - Implement simple 1D or 2D physics: Gravity pulling down, Buoyancy pushing up based on the underlying wave coordinate's height.
  - Apply friction/damping.
- **Interactivity**:
  - Mouse down/click on the canvas triggers:
    1. A "splash" (downward force on the wave points at the cursor X).
    2. A downward impulse on the pet if clicked directly, making it bob back up.

### 3. Integrate into `src/components/About.astro`
- **Import Component**: `import WaterTank from "./WaterTank.astro";`
- **Layout Update**: Place `<WaterTank />` inside the `.about__left` div, just underneath the `<h2 class="about__heading">`.
- **CSS Formatting**: Adjust the spacing/margins in `About.astro` so the tank acts as a visual anchor bridging the left column to the text on the right.

### 4. Polish and Test
- **A11y**: Add `aria-hidden="true"` to the tank, as it is purely decorative and we don't want screen readers getting stuck on it.
- **Performance Test**: Ensure no layout shifts (CLS = 0) and the requestAnimationFrame loop pauses when the user scrolls past the About section.
