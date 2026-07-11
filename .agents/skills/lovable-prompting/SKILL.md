---
name: lovable-prompting
description: Use when turning product, feature, layout, redesign, debugging, or iteration requests into effective copy-paste prompts for Lovable.dev, including premium visual direction and rescue prompts for template-like output.
---

# Lovable Prompting

## Overview

Give Lovable clear product intent, real content, and bounded creative freedom. Be precise about composition and constraints before resorting to pixel values.

## Discover First

Establish what is being built, who uses it, why they use it, and the single key action. Ask for current screenshots or URL, required content, brand assets, preserved behavior, technical constraints, and concrete references for subjective terms such as “premium.” Mark unresolved facts instead of inventing them.

## Specificity Dial

1. **Art direction:** vibe, composition, hierarchy, and explicit do/don't rules. Default here.
2. **Guardrails:** add three to six measurable layout, type, responsive, or interaction constraints when the first result needs control.
3. **Rescue:** add sparse CSS-like ranges only after repeated dated, boxy, or template-like output.

Prompt one component or coherent section at a time. If an existing full page needs a systemic redesign, one scoped “keep content and sections, rebuild the visual system” prompt is better than stacking many contradictory tweaks.

## Prompt Contract

Return a copy-paste-ready prompt containing:

```text
GOAL
[Product, audience, and desired action]

KEEP
[Existing content, behavior, brand, and working components]

CHANGE
[One bounded feature, section, or visual-system goal]

LAYOUT AND COMPONENTS
[Hierarchy, composition, atomic UI pieces, responsive behavior]

STYLE GUARDRAILS
[Typography, spacing, depth, motion, aesthetic terms]

DO NOT
[Explicit regressions, fabricated content, and visual clichés]

ACCEPTANCE
[Observable desktop, mobile, accessibility, and behavior checks]
```

Use real copy and data. Never fabricate testimonials, metrics, features, or compliance claims. Name atomic UI elements such as cards, dialogs, tabs, fields, badges, and toasts precisely.

For “premium/editorial” work, favor strong type hierarchy, asymmetry or featured compositions, restrained depth, subtle motion, and fewer visible boxes. Explicitly reject glossy effects, heavy gradients, uniform card grids, thick borders, and centered-everything layouts when those are unwanted.

## Mode and Iteration

Use Chat/planning mode when requirements, debugging strategy, data model, or design direction remain unresolved. Use Agent/implementation mode for a well-scoped change.

For safe edits, say what must remain unchanged. After implementation, inspect desktop and mobile. Iterate with named mismatches and small corrections. When output stays dated, issue a rescue prompt that preserves content/functionality while strengthening composition and type scale; do not blindly rebuild everything.

## Response Shape

Provide the ready-to-use prompt first, followed by a brief rationale, recommended mode, and an optional rescue prompt when visual drift is likely.
