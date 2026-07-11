---
name: blog-post-writer
description: Use when drafting, editing, translating, reviewing, or publishing blog posts for peterchrjoergensen.dk, including MDX frontmatter, Peter's voice, technical claims, article images, and bilingual entries.
---

# Blog Post Writer

## Overview

Write direct, thoughtful, emotionally honest technical posts in Peter's voice. Every sentence must be useful and defensible.

## Voice Contract

- First person. Short paragraphs. One idea at a time.
- Conversational but technically precise, like explaining something to a clever friend.
- Explain why decisions matter, including trade-offs and what failed.
- Use italics sparingly for emotional weight and bold only for key concepts.
- Avoid corporate language, hype, padding, invented feelings, and unsupported absolutes.
- Remove AI tells: em dashes, excessive semicolons or colons, repetitive three-part lists, canned transitions, and phrases such as "delve," "game-changer," "seamless," "at its core," or "in conclusion."

Read the draft aloud. If it sounds generated, rewrite it.

## Factual Integrity

Research the repository and primary documentation before drafting technical claims. Never invent numbers, experiences, reactions, project scope, or outcomes. If Peter has not supplied a personal fact, ask or omit it. Test code examples against the relevant versions.

When feedback exposes a problem, search the title, description, opening, and whole article for the same problem. Fix the pattern, not only the quoted sentence.

## Content Model

Inspect `src/content.config.ts`, `src/i18n/public-routes.ts`, and nearby posts before creating a file because the schema can change. The current bilingual convention uses:

- `src/content/blog/<translation-key>.en.mdx`
- `src/content/blog/<translation-key>.da.mdx`
- matching `locale` and `translationKey` frontmatter

Use the current schema for required metadata. Titles are specific; descriptions are accurate and compelling; tags are lowercase and relevant; dates use ISO format. Do not publish a new translation key until the repository's locale registry and required counterpart behavior are satisfied.

## Article Shape

1. Hook with a real problem, observation, or result.
2. Establish why it matters.
3. Explain the implementation or insight under clear `##`/`###` headings.
4. Include verified experience, limitations, and trade-offs.
5. End with useful takeaways or a forward-looking thought, without recap filler.

Match length to substance: roughly 400–800 words for a quick tip, 800–1500 for a standard post, and 1500–2500 for a genuine deep dive.

## Images

Keep all images local under `src/assets/blog/<translation-key>/`. Never embed remote image URLs. Hero metadata must include meaningful alt text; credit licensed photography accurately.

For content images, import the asset and `src/components/Figure.astro` in MDX. Pass imported image metadata to `<Figure>`; do not use raw `<img>`, Markdown image syntax, or string asset paths. Verify image licensing and attribution before use.

## Revision and Verification

Run separate passes for facts, voice, audience interpretation, structure, code accuracy, links, accessibility, image credits, and English/Danish meaning. Then run the repository's current formatting, test, check, and build commands and inspect rendered output in both locales.

## Common Mistakes

- Polishing invented experience instead of removing it.
- Translating wording mechanically while changing the meaning.
- Updating one sentence when the same problem exists in metadata and headings.
- Treating the first draft as finished.
