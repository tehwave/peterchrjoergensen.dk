# Tracker Product and Architecture Reference

## Product and Isolation

The tracker is a standalone personal productivity app at `/tracker/`, embedded in the Astro repository only for convenience. It is private, hidden, single-user, and purely client-side.

It is not portfolio content, a blog entry, a case study, or a public product. Keep `noindex, nofollow`; do not add it to navigation, sitemap, redirects, social metadata, Open Graph, or other pages. Do not apply blog/project frontmatter or content-collection rules.

Tracker changes remain inside `src/pages/tracker.astro`, `src/components/tracker/`, `src/utils/tracker/`, its browser extension integration, and directly related tests/assets. It uses its own `tracker-layout` body class, full-page styles, client script, and `$tracker-*` variables layered over shared Sass variables/mixins.

## Persistence and Share Format

Canonical app state lives in `localStorage` under `tracker`. Cross-device transfer uses `#data=` containing compact JSON compressed with browser `CompressionStream`/`DecompressionStream` gzip and encoded as base64url.

The state and URL formats are intentionally strict and breaking:

- no app-state version field;
- no migration layer;
- no legacy decoder or token fallback;
- no promise that old tracker tokens remain compatible.

Do not add backward compatibility by default. Validate current payloads strictly and fail safely. There is no server-side data, account, or synchronization service.

## Ownership Boundaries

### `tracker.astro`

Owns canonical state mutation, validation, persistence, orchestration, and integration handling. It pushes active snapshots into `Board.astro` with `setTasks(...)` and completed snapshots into `CompletedTasks.astro` with `setCompletedTasks(...)`.

It listens for task intents:

- `tracker-task-complete`
- `tracker-task-delete`
- `tracker-task-titlechange`
- `tracker-task-move`
- `tracker-completed-task-archive`

It handles board intents:

- `tracker-board-add-task`
- `tracker-board-drop`, including optional `dropPosition`

It handles completed-history intents:

- `tracker-completed-archive-all`
- `tracker-completed-restore-all`
- `tracker-completed-clear-history`

Components dispatch semantic intent; the page validates, mutates, persists, and sends new snapshots down.

### Board and Card Components

- `Board.astro` owns board markup/styles and board-local UI control: task rendering, empty states, add intent, drag insertion preview, edge auto-scroll, and drop intents.
- `Task.astro` owns active-card markup/styles and card-local interaction: custom drag ghost, inline title editing, and semantic keyboard/move intents.
- `CompletedTask.astro` owns completed-card markup/styles plus archive and uncomplete intents.
- `CompletedTasks.astro` owns completed-section markup/styles and local filter, pagination, list rendering, archive, and history controls.

These components do not become alternate persistence or canonical state layers.

## External Imports

External integrations, including the browser extension, dispatch `tracker-external-import` with:

```ts
{
  source?: string;
  showToasts?: boolean;
  tasks: Array<{
    title: string;
    type: "short" | "medium" | "long";
    description?: string;
  }>;
}
```

`tracker.astro` validates the payload, deduplicates active tasks, mutates state, persists, and shows import toasts unless `showToasts` is `false`. External producers must not mutate localStorage or component internals directly.

## Toast Ownership

`Toast.astro` owns the live-region/container markup and every toast presentation concern: placement, variants, animation, and reduced-motion styling. Mount it at the end of `<body>` so fixed overlays are not constrained by tracker layout containers.

`src/utils/tracker/toast.ts` owns the imperative runtime API: `showToast(...)`, `clearToasts()`, and create/show/hide/remove lifecycle. Call this API instead of creating toast DOM in `tracker.astro` or feature components.

## Intentional Product Features

XP, levels, streaks, achievements, task decay, stink particles, and visual rot are deliberate mechanics, not bugs or accidental decoration. Preserve their product intent when refactoring. The tracker is a kanban/productivity tool for one user, so prefer direct workflows over generalized multi-user abstractions.

## Implementation Rules

- Treat the tracker as a standalone SPA inside an Astro page.
- Keep all runtime behavior client-side and TypeScript strict.
- Follow repository Sass/BEM conventions inside the tracker namespace.
- Keep runtime-created markup compatible with Astro-scoped styles.
- Preserve semantic DOM, live-region announcements, keyboard operation, focus visibility, and reduced-motion behavior.
- Keep architecture documentation in this skill reference current when state structure, components, storage format, events, or integrations change.

## Verification Scenarios

- create, edit, move, complete, restore, archive, and delete tasks;
- drag insertion position, edge scrolling, and keyboard move intents;
- reload persistence and clean handling of malformed stored state;
- current share export/import and intentional rejection of unsupported legacy formats;
- external imports with duplicate tasks and `showToasts` both true and false;
- toast live-region behavior and reduced motion;
- completed filters, pagination, archive-all, restore-all, and clear-history;
- narrow/mobile layouts and isolation from public-site styles, navigation, sitemap, and metadata.
