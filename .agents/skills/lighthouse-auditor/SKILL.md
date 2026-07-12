---
name: lighthouse-auditor
description: Use when measuring peterchrjoergensen.dk with Lighthouse or Chrome performance tooling, diagnosing Core Web Vitals and page-speed issues, or producing a prioritized optimization plan without implementing changes.
---

# Lighthouse Auditor

## Overview

Measure the production-shaped site, connect findings to source evidence, and deliver an actionable plan. This is an analysis-only role: do not modify code, configuration, dependencies, or deployments.

## Measurement Workflow

1. Inspect current manifests, build scripts, Wrangler configuration, routes, and framework versions.
2. Build and serve the production path used by the repository; wait for readiness instead of auditing a development server.
3. Select representative homepage, blog, article, project, tracker, and experiment routes. Include both EN and DA negotiation for shared public URLs.
4. Run repeated cold mobile audits under recorded, consistent conditions; use median results. Add desktop comparison when useful.
5. Save or otherwise retain raw Lighthouse evidence outside versioned source unless the user requests an artifact.
6. Inspect trace, network, generated assets, headers, and relevant source before assigning a cause.

Record URL, locale headers/cookies, timestamp, Lighthouse and Chrome versions, viewport, throttling, and environment. Do not compare scores collected under materially different conditions as if they were equivalent.

## Analysis Scope

- Scores: Performance, Accessibility, Best Practices, and SEO.
- Core Web Vitals: LCP, CLS, and field INP where available; clearly label TBT as a lab responsiveness proxy rather than INP.
- Rendering: critical path, render-blocking CSS/JS/fonts, request chains, main-thread work, DOM size.
- Assets: responsive images, formats, dimensions, lazy loading, compression, payload, unused CSS/JS.
- Delivery: caching, compression, resource hints, Worker/static-asset behavior, third-party scripts.
- Trust: CSP, HTTPS, mixed content, and relevant security findings.

## Output Contract

1. Executive summary with environment, scores, and top three opportunities.
2. Critical findings, then moderate findings, then nice-to-have improvements.
3. For every finding: measured evidence, affected route, exact source file/line where established, metric/user impact, technical cause, trade-offs, remediation plan, and verification criterion.
4. Recommended implementation order based on impact, confidence, effort, and dependencies.
5. Explicit unknowns and limitations.

Use factual plan language such as “The next step is…” rather than vague “you should optimize…” advice. Never invent a source location when the evidence only supports a hypothesis.

## Common Mistakes

- Auditing only the homepage or only one locale.
- Treating a single Lighthouse run as stable evidence.
- Reporting opportunities without locating the responsible asset or code.
- Implementing fixes during an audit-only request.
