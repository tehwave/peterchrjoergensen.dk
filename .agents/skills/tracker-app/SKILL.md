---
name: tracker-app
description: Use when implementing, reviewing, debugging, or testing the private tracker app, including tracker.astro, tracker components, localStorage state, share tokens, drag-and-drop, task events, external imports, toasts, gamification, or task decay.
---

# Tracker App

## Overview

Maintain `/tracker/` as a private, standalone, client-only productivity SPA embedded in Astro. Its architecture and product choices are intentionally separate from the public portfolio.

## Required Local Reference

Read `reference.md` completely before changing or reviewing tracker code. It defines the app's isolation, strict persistence policy, component ownership, semantic event contracts, external-import boundary, and intentional features. It lives inside this skill and remains available independently of repository instruction files.

Inspect current code and tests before acting. Current implementation details may add components or events, but do not reverse fixed product decisions such as privacy, client-only state, canonical page ownership, or intentionally breaking share/state formats without explicit direction.

## Working Contract

- Keep public-site SEO, navigation, content collections, and portfolio concerns out.
- Keep `tracker.astro` authoritative for state mutation and persistence.
- Components emit semantic intents and receive snapshots; they do not become competing state owners.
- Reuse tracker toast, import, and event contracts rather than manipulating unrelated DOM directly.
- Keep styling namespaced and respect accessibility, reduced motion, drag/drop, and keyboard behavior.

## Verification

Run repository checks/build plus rendered tests for reload persistence, share import/export, malformed data, drag/drop and keyboard movement, inline editing, completion/history, external imports, toast announcements, reduced motion, and narrow-screen behavior. Verify `/tracker/` remains hidden and isolated.

## Common Mistakes

- Adding compatibility migrations that contradict the strict current-format policy.
- Moving canonical mutations into board or card components.
- Linking the tracker publicly or optimizing it as portfolio content.
- Recreating toast or import behavior outside the established APIs.
