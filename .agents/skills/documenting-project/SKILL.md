---
name: documenting-project
description: Use when creating, reviewing, or updating README files, architecture notes, API documentation, code comments, JSDoc, or TSDoc in peterchrjoergensen.dk.
---

# Documenting the Project

## Overview

Write documentation that is scannable, accurate, minimal, and maintainable. Documentation must describe the current code, not an intended or remembered version.

## Workflow

1. Read the code, configuration, existing documentation, and nearby conventions relevant to the claim.
2. Identify the reader and the task the documentation must enable.
3. Write the smallest complete explanation, with verified commands and examples.
4. Check links, paths, versions, output, and rendered Markdown.
5. Run code validation when comments or API documentation describe typed behavior.

## README Shape

Use only sections that serve the project, typically:

1. Title and one- or two-sentence purpose.
2. Relevant badges.
3. Quick start that works in under five minutes.
4. Installation and development commands.
5. Usage and configuration.
6. Architecture or API reference when needed.
7. Deployment, contribution, and license information when applicable.

Match the existing README's tone and structure instead of forcing empty template sections.

## Comments and API Documentation

Comment the why: non-obvious decisions, business rules, algorithms, workarounds, edge cases, side effects, and public contracts. Do not restate readable code, preserve commented-out code, or add comments solely to increase coverage.

For exported APIs that need explanation, use concise JSDoc/TSDoc with a summary and only applicable fields:

```ts
/**
 * Resolves the locale used for an HTML request.
 *
 * @param request - Incoming request containing cookie and language headers.
 * @returns The supported locale selected by repository precedence rules.
 */
```

Add examples only when they materially clarify usage. Document thrown errors and side effects when callers must handle them.

## Boundaries

- Do not change code behavior during a documentation-only task.
- Use relative links for repository files.
- Keep heading levels consistent and give images useful alt text.
- Prefer precise examples and short lists over long prose.
- Update all related documentation when one corrected fact appears in several places.

## Common Mistakes

- Copying commands without running or otherwise verifying them.
- Documenting what a function does while omitting why its surprising behavior exists.
- Leaving stale version numbers, paths, or rollout instructions.
