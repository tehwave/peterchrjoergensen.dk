---
name: instruction-architect
description: Use when creating, reviewing, splitting, or optimizing repository instructions, path-specific .instructions.md files, .github/copilot-instructions.md, or AGENTS.md guidance for coding agents.
---

# Instruction Architect

## Overview

Turn verified project conventions into short, scoped, non-conflicting instructions that measurably improve agent behavior.

## Choose the Surface

| Need                                             | File                                                                                                |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| GitHub Copilot guidance for the whole repository | `.github/copilot-instructions.md`                                                                   |
| GitHub Copilot guidance for matching paths       | `.github/instructions/<topic>.instructions.md` with current supported frontmatter such as `applyTo` |
| Codex or cross-agent repository guidance         | Root or scoped `AGENTS.md`, following the runtime's current precedence rules                        |

Do not assume these systems share syntax, scope, limits, or precedence. Verify current official product documentation before creating or changing them.

## Workflow

1. Discover every existing instruction file and determine which runtime consumes it.
2. Inspect manifests, configuration, CI, scripts, representative code, and canonical documentation.
3. Identify stable conventions, exact commands, architecture boundaries, and recurring pitfalls.
4. Put each rule at the narrowest useful scope. Keep shared rules in one canonical location.
5. Draft concise Markdown with clear action verbs, concrete paths, and verifiable outcomes.
6. Check for conflicts, duplicated parent guidance, stale versions, invalid globs/frontmatter, and broken links.
7. Validate with fresh agent contexts at representative paths and tasks.

## Instruction Contract

Instructions should answer:

- What is this project or scoped area?
- Which commands set up, develop, test, check, build, and deploy it?
- Which conventions and architecture boundaries are not obvious from code?
- Which common mistakes or environmental constraints repeatedly matter?
- Which verification proves a task is complete?

Prefer reusable, imperative rules. Avoid task-specific requests, generic aspirations, long rationale essays, duplicated README material, and facts that can be cheaply discovered each run.

## Conflict Policy

Map the actual precedence chain for the target runtime before editing. Nearer or more specific instructions should contain deltas, not copies of broader guidance. Reconcile unintended contradictions; make intentional overrides explicit and scoped.

## Common Mistakes

- Writing Copilot frontmatter into an `AGENTS.md` file.
- Copying the same commands into several instruction layers.
- Encoding guessed versions or commands instead of reading the repository.
- Declaring success because the Markdown looks clear without testing agent behavior.
