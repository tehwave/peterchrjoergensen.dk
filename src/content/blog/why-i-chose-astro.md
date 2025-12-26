---
title: "Why I Chose Astro for My Portfolio"
description: "The technical and philosophical reasons behind choosing Astro as the foundation for my personal website."
pubDate: 2024-12-10
author: "Peter Chr. Jørgensen"
tags: ["astro", "web development", "performance", "meta"]
draft: false
heroImage: ../../assets/blog/sample-hero.svg
heroImageAlt: "Blog hero image"
---

After years of building websites with various frameworks, I decided to rebuild my portfolio with Astro. Here's why.

## The Zero-JavaScript Default

Most modern frameworks ship JavaScript by default — even for static content that doesn't need it. Astro flips this:

- **Zero JS by default** — Only ship what's necessary
- **Islands architecture** — Hydrate individual components on demand
- **Progressive enhancement** — Start with HTML, add interactivity where needed

For a portfolio site, this means blazing-fast load times without sacrificing modern development patterns.

## Performance Without Compromise

Core Web Vitals matter. Google uses them for ranking, but more importantly, users feel the difference:

- **LCP < 50ms** — Content appears instantly
- **CLS = 0** — No layout shifts or jank
- **TTI < 100ms** — Interactive immediately

Astro makes these numbers easy to hit because it doesn't fight you with heavy runtime overhead.

## Modern DX, Classic Output

I love modern tooling — TypeScript, component composition, hot module replacement. But I don't want to sacrifice performance for it.

Astro gives you:

- **TypeScript everywhere** — Full type safety
- **Component-based** — Reusable `.astro` components
- **Instant HMR** — Changes reflect immediately
- **Static output** — Plain HTML, no runtime

## Built for Content

With Content Collections, managing blog posts is type-safe and performant:

```typescript
const posts = await getCollection("blog");
```

Zod validation ensures all posts have required fields. Astro optimizes images automatically. Markdown just works.

## Edge-Ready

Deploying to Cloudflare Pages was effortless:

1. Push to GitHub
2. Connect repository
3. Done

No server config. No adapters. No build-time environment variables to debug. Just static HTML deployed globally.

## The Bottom Line

Astro lets me focus on the craft — the design, the content, the experience — without fighting framework overhead.

Fast by default. Simple when you want it. Powerful when you need it.

That's why I chose Astro.
