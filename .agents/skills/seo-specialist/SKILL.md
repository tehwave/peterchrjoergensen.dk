---
name: seo-specialist
description: Use when auditing or improving technical SEO, metadata, structured data, crawling, indexation, internal links, content discoverability, or search performance for peterchrjoergensen.dk.
---

# SEO Specialist

## Overview

Improve discoverability without weakening accuracy, performance, accessibility, or Peter's human voice. Separate confirmed defects from opportunities.

## Repository Context

This Astro site uses a Cloudflare Worker to serve English and Danish content at the same public URLs. A locale cookie or `Accept-Language` selects server-rendered HTML. The sitemap contains public URLs only, and the same-URL requirement intentionally does not emit `hreflang`.

Verify this behavior in the current repository before relying on it. Do not promise independent indexing of both languages while they share canonical URLs. A change to separate locale URLs is a product and migration decision, not a routine SEO fix.

## Audit Scope

- Head: unique title, description, canonical, Open Graph, social cards, language, viewport, icons.
- Content: one clear H1, logical headings, search intent, descriptive links, useful image alt text, natural internal linking.
- Crawl/index: public sitemap, robots directives, `noindex`, status codes, soft 404s, redirect chains, trailing slashes, preview/internal namespace exposure.
- Structured data: accurate `Person`, `WebSite`, `ProfilePage`, `Article`, `BreadcrumbList`, and relevant project/creative-work entities with stable absolute `@id` references.
- Performance: LCP, INP, CLS, images, fonts, third-party scripts, payload, cache behavior, and language-switch layout stability.
- Trust: HTTPS, mixed content, security headers, author attribution, and claims that match visible content.

Inspect rendered responses in both locale states, not only source templates. Ensure `<html lang>`, metadata, canonical URLs, structured-data language, and content agree. English fallback inside Danish chrome must describe its actual content language accurately.

## Validation

Use current official Google, Schema.org, and web-platform guidance for unstable requirements and thresholds. Validate with repository tests/build, rendered HTML and headers, sitemap/robots crawling, Schema Markup Validator or Rich Results Test where applicable, and Lighthouse or field data for performance. Automated scores are evidence, not proof of content quality or ranking.

## Finding Contract

Order findings as Critical, High, Medium, then Low. Each finding contains:

- affected URL and source location;
- concrete evidence;
- why it matters to search engines and users;
- a scoped fix;
- expected impact and verification method;
- whether it is confirmed, inferred, or an opportunity.

For content suggestions, write first-person, calm, specific copy. Never keyword-stuff, invent achievements, or turn the portfolio into generic agency language.

## Authority Boundary

An audit is read-only. An improvement request permits scoped repository edits and relevant verification, but not deployment, Search Console changes, analytics mutations, domain/URL strategy changes, or fabricated content claims without explicit authorization.

## Common Mistakes

- Adding `hreflang` when both languages use the same URL.
- Validating JSON-LD syntax without checking that claims match visible content.
- Treating Lighthouse SEO score as a complete audit.
