---
name: project-portfolio-writer
description: Use when researching, adding, translating, or refining project cards and case studies for peterchrjoergensen.dk, including project MDX, projects.ts, descriptions, tags, images, alt text, and external project URLs.
---

# Project Portfolio Writer

## Overview

Showcase Peter's real work with concise, specific writing and verified technical depth. Research precedes prose.

## Research Contract

Before writing any entry, inspect the existing portfolio sources, content schema, locale registry, and related assets. When given an external URL, fetch the live site and relevant first-party About, Features, documentation, case-study, or repository pages. Establish what the product does, who it serves, notable capabilities, and credible stack clues.

External sources do not establish Peter's role, contribution, private metrics, or technologies he personally used. Confirm those with repository evidence or Peter. Never invent scope, impact, dates, users, awards, or outcomes.

## Choose One Source

| Desired result            | Source                                                              |
| ------------------------- | ------------------------------------------------------------------- |
| External-link card only   | Current simple-project data source, normally `src/data/projects.ts` |
| Dedicated case-study page | Current project content collection under `src/content/projects/`    |

Never add the same project to both sources. Search by title, domain, URL, translation key, and concept before creating anything.

Inspect `src/content.config.ts`, `src/i18n/public-routes.ts`, `src/data/projects.ts`, and nearby entries because schema and localization evolve. The current featured-project convention uses a required English `<translation-key>.en.mdx` and optional Danish `<translation-key>.da.mdx` with the same `translationKey`; verify current fallback and registry behavior before editing.

## Peter's Voice

- First person, active voice, short sentences.
- Direct, thoughtful, honest, and concrete.
- State what he built, how he built it, and one memorable constraint or outcome.
- Avoid corporate language, vague praise, padding, buzzwords, and em dashes.
- Simple descriptions stay within two or three tight sentences unless the current component clearly uses less.

## Entry Requirements

- Choose the accurate category from the current schema.
- Pick two to five accurate, recognizable, differentiating tags.
- Use a local, licensed image under the current project asset structure.
- Describe visible content in alt text, for example: `Screenshot of [project] showing [main visual]`.
- Follow the current schema's exact image/frontmatter syntax; do not copy obsolete examples.
- Preserve bilingual meaning while allowing natural Danish and English phrasing.

## Verification

Check the schema, translation-key uniqueness, locale/fallback behavior, links, image imports, alt text, tags, and duplicate prevention. Run the repository's current formatting, tests, checks, and build, then inspect cards and case-study pages in both locales.

## Common Mistakes

- Treating marketing copy from an external site as proof of Peter's contribution.
- Adding both an MDX case study and a simple card.
- Using generic tags such as `Web` or inflated labels such as `Next-Gen`.
- Writing a polished description before verifying the underlying facts.
