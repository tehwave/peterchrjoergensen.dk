---
name: peterchrjoergensen-dk
description: Use when working anywhere in the peterchrjoergensen.dk repository or when a request mixes portfolio strategy, writing, SEO, performance, documentation, instructions, browser experiments, tracker work, or Cloudflare deployment concerns.
---

# peterchrjoergensen.dk

## Overview

Peter Chr. Jørgensen's bilingual Astro portfolio. Work from current evidence, preserve its human voice, and verify rendered behavior as well as source.

## Project Baseline

Inspect the checkout before acting. Expected architecture:

- Astro with strict TypeScript and Sass-based components;
- EN/DA content generated under an internal namespace;
- unchanged public URLs selected by a Worker using cookie and `Accept-Language` precedence;
- Workers Static Assets, with experiments and tracker isolated;
- localized content collections plus a simple-project data source.

Repository code, manifests, schemas, README rollout notes, and scoped instructions override this summary when they differ.

## Specialist Routing

Load the smallest set of project-local skills that covers the task:

| Task                                                             | Skill                            |
| ---------------------------------------------------------------- | -------------------------------- |
| Portfolio positioning, audience, sections, messaging             | `portfolio-advisor`              |
| Blog MDX, translations, technical articles, article images       | `blog-post-writer`               |
| Project cards, case studies, project research, tags and alt text | `project-portfolio-writer`       |
| SEO, metadata, structured data, crawl/index behavior             | `seo-specialist`                 |
| Lighthouse and performance analysis without implementation       | `lighthouse-auditor`             |
| Workers, Pages, DNS, domains, caching, security, deployment      | `cloudflare-deployment`          |
| Browser multiplayer, WebRTC, PixiJS, game feel, mobile testing   | `browser-multiplayer-experiment` |
| Private tracker state, components, imports, toasts, gamification | `tracker-app`                    |
| README, API docs, comments, JSDoc/TSDoc                          | `documenting-project`            |
| Copilot instructions, path instructions, `AGENTS.md`             | `instruction-architect`          |

For mixed tasks: establish strategy and facts, edit content, apply SEO, inspect rendered output, measure, then prepare deployment. Respect each skill's boundary.

## Shared Rules

- Preserve existing user changes and avoid unrelated edits.
- Verify facts, claims, versions, and platform behavior; never invent them.
- Peter's public voice is first-person, direct, specific, calm, and free of corporate or obvious AI phrasing.
- Inspect current content schemas and locale registries before adding or renaming content.
- Preserve same-URL language behavior unless the user explicitly requests a URL-strategy migration.
- Do not expose internal locale paths or reroute experiments, tracker, or assets.
- Treat a passing build as necessary, not sufficient, for content, SEO, accessibility, or visual work.
- External mutations such as deployment, DNS, custom domains, dashboards, or analytics require explicit authority.

## Verification Baseline

Choose checks proportional to risk using current repository commands:

1. Focused tests for changed behavior.
2. Formatting and Astro/TypeScript checks.
3. Production build and Worker type/dry-run checks when routing or deployment is involved.
4. Rendered EN/DA review: fallbacks, metadata, links, responsive states.
5. Preview verification before any production cutover.

Report exact checks, results, unknowns, and whether external state was inspected or changed.
