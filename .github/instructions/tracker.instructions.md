---
applyTo: "**/tracker/**,**/tracker.astro"
---

# Tracker — Independent Personal Tool

The tracker is a **completely standalone personal productivity app** that lives at `/tracker`. It has nothing to do with the public-facing website.

## What it is

- A private, hidden page — `noindex, nofollow`, not linked anywhere on the site
- A personal kanban/productivity tool built for one user only (the site owner)
- A side project in its own right, sharing the Astro shell purely as a convenience

## What it is NOT

- Not part of the portfolio
- Not part of the blog
- Not a project showcase or case study
- Not something visitors are expected to find or use

## Scope boundaries

**Never apply portfolio/site concerns here:**

- Do not suggest adding it to the navigation, sitemap, or `_redirects`
- Do not treat it as content that needs SEO, Open Graph, or social sharing
- Do not link it from other pages or reference it in site-wide components
- Do not apply blog/project conventions (frontmatter, content collections, etc.)

**Changes here are isolated:**

- Edits to `tracker.astro`, `src/components/tracker/`, or `src/utils/tracker/` do not affect the rest of the site
- The tracker uses its own layout (`tracker-layout` on `<body>`), its own full-page styles, and its own client-side script — none of which bleed into site pages
- Design tokens and mixins from `_variables.scss` / `_mixins.scss` are used, but the tracker defines its own `$tracker-*` variables on top

## Architecture notes

- All state lives in `localStorage` under key `tracker_v1`, with URL `#data=` for cross-device sync via base64 export
- The app is centered in `src/pages/tracker.astro` with UI sub-components in `src/components/tracker/`
- `Task.astro` owns task-card markup, task-card scoped styles, and card-local interactions (drag visuals, inline title edit, and semantic custom events)
- `CompletedTask.astro` owns completed-card markup, completed-card scoped styles, and card-local interactions (semantic delete custom event)
- `tracker.astro` owns app state mutations/persistence and listens to card events (`tracker-task-complete`, `tracker-task-delete`, `tracker-task-titlechange`, `tracker-completed-task-delete`) for orchestration
- There is no server-side data — purely client-side
- Gamification (XP, levels, streaks, achievements) and task decay (stink particles, visual rot) are intentional features, not bugs

## When making changes

- Treat this like maintaining a standalone SPA embedded in an Astro page
- Follow the same SASS/BEM conventions as the rest of the site, but within the tracker's own namespace
- The `<script>` block is TypeScript and runs entirely client-side — keep it self-contained

**Keep this file updated:**  
If you make architectural changes to the tracker (new features, state structure changes, component additions, storage format updates, etc.), **update this instructions file** to reflect the current reality. This ensures future agents understand the tracker correctly.
