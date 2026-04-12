## Plan: Astro-native Tracker Components

Refactor `Task` and `CompletedTask` into true Astro-native `.astro` components in `src/components/tracker/`, and drive runtime interactivity with standard browser custom elements + processed Astro scripts (no React/Vue/Svelte, no TS class pseudo-components).

**Steps**
1. Phase 1 — Introduce shared tracker types and constants (*foundation, blocks all other steps*)
   1. Create `/Users/peterchrjoergensen/webdev/peterchrjoergensen.dk/src/types/tracker.ts` with `TaskType`, `Task`, and `CompletedTask = Task & { completedAt: number }`.
   2. Move `XP_VALUES` into a shared tracker constants module (or same type module if small) for a single source of truth.
   3. Update `tracker.astro` imports to consume shared types/constants in the client script.

2. Phase 2 — Create Astro-native `Task` component
   1. Add `/Users/peterchrjoergensen/webdev/peterchrjoergensen.dk/src/components/tracker/Task.astro`.
   2. `Task.astro` responsibilities:
      - Define semantic task-card markup skeleton (same classes: `task-card*`) and slot-free prop-driven template.
      - Accept typed props (`id`, `title`, `type`, `decay`, `xp`, optional decay progress, drag state flags).
      - Keep scoped SCSS with repo token/mixin imports.
   3. Include a processed `<script src="...">` hook or embedded processed `<script>` in `Task.astro` only for per-instance element behavior that belongs to the component (drag handles/state class toggles), using custom element scoping (`this.querySelector(...)`) pattern from Astro docs.

3. Phase 3 — Create Astro-native `CompletedTask` component
   1. Add `/Users/peterchrjoergensen/webdev/peterchrjoergensen.dk/src/components/tracker/CompletedTask.astro`.
   2. `CompletedTask.astro` responsibilities:
      - Render completed item row markup (same classes: `completed-item*`).
      - Accept typed props (`id`, `title`, `typeLabel`, `completedAtLabel`, `xp`).
      - Preserve a11y attributes and delete button action payload (`data-action="delete-completed"`, `data-id`).
   3. Keep escaping safe by relying on Astro expression escaping (`{title}`) instead of string `innerHTML` assembly.

4. Phase 4 — Wire Astro components into tracker page without framework islands
   1. In `/Users/peterchrjoergensen/webdev/peterchrjoergensen.dk/src/pages/tracker.astro`, replace string-template rendering paths with DOM cloning from server-rendered component templates:
      - Add hidden template hosts that render `Task.astro` and `CompletedTask.astro` once with placeholder markers.
      - In client script, clone these templates and patch text/attributes/datasets per runtime task row.
   2. Eliminate direct `innerHTML` composition for task/completed rows where components are now used.
   3. Keep existing board event delegation API unchanged to minimize behavior churn.

5. Phase 5 — Optional simplification branch (parallel decision)
   1. If template-clone wiring becomes too brittle, switch to custom elements that own internal rendering, but still define visual structure in `.astro` wrappers and use processed scripts from `src/`.
   2. Avoid `is:inline` for main app logic so Astro can bundle TS imports.

6. Phase 6 — Validation and regression checks
   1. Run `npm run check`.
   2. Run `npx prettier --check .`.
   3. Manual validation on `/tracker/`:
      - Add/edit/complete/delete
      - drag-drop across sections
      - completed filter + pagination
      - decay visuals for stale/rotten tasks

**Relevant files**
- `/Users/peterchrjoergensen/webdev/peterchrjoergensen.dk/src/pages/tracker.astro` — replace inline row markup generation with Astro-component-driven rendering pipeline.
- `/Users/peterchrjoergensen/webdev/peterchrjoergensen.dk/src/components/tracker/Task.astro` — new Astro native task card component.
- `/Users/peterchrjoergensen/webdev/peterchrjoergensen.dk/src/components/tracker/CompletedTask.astro` — new Astro native completed row component.
- `/Users/peterchrjoergensen/webdev/peterchrjoergensen.dk/src/types/tracker.ts` — shared tracker domain types.
- `/Users/peterchrjoergensen/webdev/peterchrjoergensen.dk/src/utils/tracker/*` — keep only pure utility logic (decay calculation, formatting) as needed; remove pseudo-component classes.

**Verification**
1. `npm run check`
2. `npx prettier --check .`
3. Manual smoke test using current dev server:
   1. No missing task/completed rows.
   2. No regressions in action handlers (`complete`, `edit`, `delete`, `delete-completed`).
   3. No duplicated script execution from component reuse.

**Decisions**
- Use Astro-native `.astro` components for both `Task` and `CompletedTask`.
- Keep interactivity in standard browser APIs (custom elements/event delegation), not framework hydration.
- Keep current tracker UX and CSS class contract unchanged.

**Further Considerations**
1. Recommendation: use `textContent`/attribute assignment instead of `innerHTML` where possible for stronger XSS safety.
