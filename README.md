# peterchrjoergensen.dk

My personal website, built with performance and simplicity in mind.

**Live site:** [peterchrjoergensen.dk](https://peterchrjoergensen.dk)

## About Me

I've been building for the web for a long time—started as a kid, turned it into a career. Most of my professional experience comes from running a dev team at a marketing agency, where I shipped everything from small local sites to projects for multi-million dollar businesses. PHP, Laravel, WordPress—whatever the job needed. I've worked in codebases that were ancient and ones that were brand new, with teams big and small, in-house and remote.

I care about performance, reliability, and keeping things pragmatic. I've mentored devs, made hiring decisions, and been the one on call when things caught fire.

## Tech Stack

- **Framework:** [Astro 5](https://astro.build) — Zero-JS by default, islands architecture
- **Styling:** Sass with scoped component styles
- **Typography:** Inter & Caveat via Fontsource (self-hosted, no external requests)
- **Deployment:** Cloudflare Pages (edge-deployed, global CDN)

## Performance Optimizations

This site is built with Core Web Vitals in mind:

- **Critical CSS inlining** — Faster First Contentful Paint
- **Asset compression** — HTML, CSS, JS, and SVG minification
- **PWA support** — Offline-capable with service worker caching
- **Automatic sitemap generation** — SEO-friendly out of the box
- **Image optimization** — Astro's built-in processing for modern formats
- **Clean URLs** — Directory-based routing without `.html` extensions

## Project Structure

```
src/
├── assets/          # Images processed by Astro's optimizer
│   └── blog/        # Blog post images (hero images, inline images)
├── components/      # Reusable .astro components
├── content/         # Content collections (blog posts)
│   ├── config.ts    # Collection schemas with type validation
│   └── blog/        # Blog posts (.md and .mdx files)
├── data/            # Structured data (projects, etc.)
├── layouts/         # Page layouts with SEO meta tags
├── pages/           # File-based routing
│   └── blog/        # Blog routes (index and dynamic [slug])
├── styles/          # Global Sass (variables, mixins, base)
└── types/           # TypeScript type definitions
```

## Key Components

| Component               | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `Layout.astro`          | Base wrapper handling SEO, Open Graph, and structured data     |
| `Hero.astro`            | Landing section with animated role rotation                    |
| `Header.astro`          | Scroll-aware sticky navigation                                 |
| `About.astro`           | Philosophy-first bio with skill tags                           |
| `Projects.astro`        | Portfolio with filtering; shuffled on build for equal exposure |
| `Blog.astro`            | Latest blog posts section with cards (3 most recent)           |
| `AI.astro`              | Transparency section on AI usage                               |
| `AnimateOnScroll.astro` | Intersection Observer wrapper for scroll animations            |

## Blog System

The site includes a full-featured blog powered by Astro's Content Collections:

### Features

- **Content Collections API** — Type-safe content management with Zod validation
- **MDX Support** — Write posts in Markdown or MDX with component support
- **Image Optimization** — Automatic image processing with multiple formats (WebP, AVIF)
- **SEO Optimized** — Complete Open Graph, Twitter Cards, and JSON-LD structured data
- **Draft Mode** — Keep posts in git but hide from production
- **Tags & Categories** — Organize posts with filterable tags
- **Table of Contents** — Auto-generated from headings
- **Performance First** — Static generation with sub-50ms LCP

### Adding a New Blog Post

1. Create a new `.md` or `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Your Post Title"
description: "Brief description for SEO and previews"
pubDate: 2024-12-26
author: "Peter Chr. Jørgensen"
tags: ["astro", "performance"]
draft: false
heroImage: ../../assets/blog/hero.jpg  # Optional
heroImageAlt: "Description of hero image"  # Optional
---

Your content here...
```

2. Add images to `src/assets/blog/` — they'll be automatically optimized
3. Run `npm run dev` to preview locally
4. Build with `npm run build` — drafts are automatically filtered out

### Blog Architecture

- **Content Schema**: `src/content/config.ts` — Defines post structure and validation
- **Blog Section**: `src/components/Blog.astro` — Shows 3 latest posts on home page
- **Post Template**: `src/pages/blog/[...slug].astro` — Renders individual posts
- **Sitemap**: Blog posts automatically included in sitemap via `@astrojs/sitemap`
- **Performance**: LCP < 50ms, CLS = 0.00, fully static generation

## Development

```bash
# Install dependencies
npm install

# Start dev server at localhost:4321
npm run dev

# Type-check the project
npm run check

# Build for production
npm run build

# Preview production build
npm run preview

# Format code with Prettier
npm run format

# Deploy to Cloudflare Pages
npm run deploy
```

## License

The code in this repository is open source for learning purposes. Feel free to use it as reference for your own Astro projects.
