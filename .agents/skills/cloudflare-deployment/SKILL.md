---
name: cloudflare-deployment
description: Use when reviewing, configuring, debugging, previewing, deploying, or cutting over peterchrjoergensen.dk on Cloudflare Workers, Pages, Static Assets, DNS, custom domains, redirects, caching, TLS, observability, or security rules.
---

# Cloudflare Deployment

## Overview

Handle this site's Cloudflare platform work from verified repository and account state. Separate safe diagnostics from external mutations.

## Current Architecture

Discover current details before acting. The expected shape is an Astro static build in `dist/`, a custom Worker in `src/worker.ts`, and Static Assets configured in `wrangler.jsonc`. The Worker selectively intercepts localized HTML while most static assets remain asset-first. The older Pages project may still own the production domain during migration.

Inspect `package.json`, `astro.config.mjs`, `wrangler.jsonc`, `src/worker.ts`, `public/_headers`, and the rollout notes in `README.md`. Repository state overrides this summary.

## Workflow

1. Establish the exact task: analysis, preview, production deployment, DNS, security, or migration.
2. Inspect current repository configuration and authenticated Cloudflare state.
3. Verify changing Cloudflare and Wrangler behavior in current official Cloudflare documentation.
4. Prefer the repository's declarative configuration when it can express the behavior cleanly.
5. Run the focused tests, type checks, production build, Wrangler type generation/check, and deployment dry run required by the change.
6. For routing changes, test representative HTML, assets, internal paths, redirects, headers, methods, 404s, and locale negotiation.
7. Report confirmed state, unknown external state, exact checks, risk, and rollback separately.

## Authority Boundaries

Read-only account inspection, local builds, local preview, and dry runs are diagnostics. Do not deploy, attach or remove custom domains, change Pages, DNS, redirect rules, certificates, WAF, secrets, or account settings unless the user explicitly authorizes that mutation.

Before a production cutover, require:

- a verified preview of the exact revision;
- ownership of the target account, zone, Worker, and rollback;
- a plan for existing Pages/custom-domain/DNS records;
- apex and `www` behavior that preserves path and query;
- live verification of routes, headers, analytics, and observability;
- a reversible path back to the previous deployment.

## Platform Guidance

- Use Full (Strict) TLS when origin configuration supports it.
- Keep secrets out of versioned variables and command output.
- Prefer Custom Domains when the Worker is the origin; use route patterns only when an origin remains behind the Worker.
- Treat `workers.dev` as preview or diagnostic routing, not the production-domain plan.
- Verify compatibility dates, bindings, asset routing, cache behavior, and security headers against current docs and runtime output.
- Explain trade-offs and cite official Cloudflare documentation for unstable platform claims.

## Common Mistakes

- Assuming `wrangler deploy` also moves a domain when no route is configured.
- Applying old Pages commands to the current Workers Static Assets setup.
- Calling a dry run a production verification.
- Changing DNS without first recording the current state and rollback owner.
