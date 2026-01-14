# Astro Project — Copilot Instructions

<project>
<overview>
Personal website built with Astro 5.x — a modern static site generator that delivers zero-JavaScript by default with optional hydration for interactive components.
</overview>

<astroDocumentation>
When you need to look up Astro APIs, patterns, or best practices, use the `search_astro_docs` tool to search the official Astro documentation. This is especially helpful for:

- Component syntax and directives
- Image optimization APIs (`<Image>`, `<Picture>`)
- Content collections and data fetching
- View transitions and routing
- Integration configurations
- Any Astro-specific features or APIs
</astroDocumentation>
</project>

<techStack>
- **Framework:** Astro 5.16+
- **Language:** TypeScript (strict mode)
- **Formatting:** Prettier with `prettier-plugin-astro`
- **Build Output:** Static HTML (SSG)
</techStack>

<development>
<commands>
```bash
# Install dependencies
npm install

# Start development server (user is always running this - never start it)
npm run dev

# Build for production
npm run build

# Preview production build (only use when specifically testing with Chrome DevTools)
npm run preview

# Format code
npx prettier --write .
```
</commands>

<criticalRules>
- NEVER run `npm run dev` - the user is always running it
- NEVER run `npm run preview` or `killall node` unless specifically testing production builds with Chrome DevTools
</criticalRules>
</development>

<architecture>
<directoryStructure>
```
src/
├── assets/          # Static assets (images, SVGs) — processed by Astro
├── components/      # Reusable .astro components
├── layouts/         # Page layouts with <slot /> for content
├── pages/           # File-based routing (each file = a route) — REQUIRED
public/              # Static files served as-is (favicon, robots.txt)
├── _headers         # Cloudflare Pages headers (CSP, security)
├── _redirects       # Cloudflare Pages redirects
```

**Critical:** `src/pages/` is the **only required directory** in Astro. Without it, your site has no routes.
</directoryStructure>

<security>
<contentSecurityPolicy>
This site uses a strict CSP configured in `public/_headers`:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' data: https://cdn.usefathom.com https://static.cloudflareinsights.com https://analytics.ahrefs.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://cdn.usefathom.com https://cloudflareinsights.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self'
```

**When adding third-party scripts:**

1. Add the script domain to `script-src` in `public/_headers`
2. If the script makes network requests, add domains to `connect-src`
3. Test CSP violations in browser DevTools Console
4. Redeploy to Cloudflare Pages for changes to take effect
</contentSecurityPolicy>
</security>
</architecture>

<conventions>
<componentAnatomy>
Every `.astro` file has two parts:

```astro
---
// Component Script (runs at build time on server)
import Component from "../components/Component.astro";
const data = await fetch("...").then((r) => r.json());
---

<!-- Component Template (HTML output) -->
<div class="component">
  <h1>{data.title}</h1>
</div>

<style lang="scss">
  @use "../styles/variables" as *;
  @use "../styles/mixins" as *;

  .component {
    color: $color-text-primary;
  }
</style>
```
</componentAnatomy>

<components>
- Use `.astro` extension for Astro components
- Place reusable components in `src/components/`
- Place page layouts in `src/layouts/`
- Use `<slot />` in layouts to render child content
- Use named slots for complex layouts: `<slot name="header" />`
- Import assets from `src/assets/` — Astro optimizes them automatically
</components>

<routing>
<fileBasedRouting>
- Every file in `src/pages/` becomes a route
- `index.astro` → `/`
- `about.astro` → `/about`
- `blog/[slug].astro` → dynamic route `/blog/:slug`
- `projects/[...slug].astro` → dynamic route `/projects/:slug` for MDX project pages
</fileBasedRouting>

<linkConventions>
- Always include trailing slashes on internal links: `href="/about/"`, `href="/"`
- Fragment identifiers don't need trailing slash before `#`: `href="/#projects"`, `href="/about/#contact"`
- This ensures consistency with Astro's default trailing slash behavior
</linkConventions>
</routing>

<projectsSystem>
This site uses a **hybrid projects system** that merges two data sources:

**Two Types:**
1. **Simple projects** (`src/data/projects.ts`) — External links only, no dedicated pages
2. **MDX projects** (`src/content/projects/`) — Full case studies with dedicated pages at `/projects/[slug]`

**Display Logic:**
- MDX projects → card with arrow → links to `/projects/[slug]`
- Simple projects → card with external link icon → opens external URL
- Both use the same `ProjectCard` component

**Adding Projects:**
- External link only? → Add to `src/data/projects.ts`
- Full case study page? → Create MDX in `src/content/projects/`
- Never create both for the same project
</projectsSystem>

<styling>
<rules>
- **Always use scoped SASS** — Every component must have `<style lang="scss">`
- **Import design tokens**: Always `@use "../styles/variables" as *;` and `@use "../styles/mixins" as *;`
- **BEM naming**: `.component`, `.component__element`, `.component--modifier`
- **Automatic scoping** — Styles only affect the current component, never leak
- **Use design tokens** from `_variables.scss` — never hardcode colors, spacing, or breakpoints
- **Use mixins** from `_mixins.scss` — `@include respond-to(md)`, `@include container`, etc.
</rules>

<patterns>
**Nesting BEM efficiently:**
```scss
.component {
  padding: $space-lg;

  &__title {
    font-size: $font-size-xl;
  }

  &__description {
    color: $color-text-secondary;
  }
}
```

**Safe practices:**
- Low-specificity selectors like `h1 {}` are safe — they get scoped automatically
- Use `:global()` selector to style child components: `article :global(h1) { }`
- Use `class:list` for conditional classes: `<div class:list={["base", { active: isActive }]}>`

**Forbidden:**
- NEVER use `<style is:global>` — global styles belong in `src/styles/global.scss`
</patterns>
</styling>

<images>
**Always use `<Picture />` from `astro:assets`** for all image assets:

```astro
---
import { Picture } from "astro:assets";
import photo from "../assets/photo.png";
---

<Picture src={photo} formats={["avif", "webp"]} alt="Photo description" />
```

**Rules:**
- `<Picture />` automatically generates multiple formats (AVIF, WebP, fallback) and optimizes at build time
- Import images from `src/assets/` for automatic optimization
- Always specify `formats={["avif", "webp"]}` for best performance
- The `alt` attribute is **mandatory** — builds will fail without it
- Use `<Image />` only when you don't need multiple formats or responsive srcsets
- Place unprocessed files (favicon, robots.txt) in `public/`
</images>

<typescript>
- Use strict TypeScript (configured via `astro/tsconfigs/strict`)
- Always define `interface Props` for components that accept props:
  ```astro
  ---
  interface Props {
    title: string;
    description?: string;
  }
  const { title, description = "Default" } = Astro.props;
  ---
  ```
- For components with no props: `type Props = Record<string, never>`
- For components requiring children: `type Props = { children: any }`
</typescript>
</conventions>

<performance>
<streaming>
- **Move async data fetching into separate components** to enable HTML streaming
- Components with `await` block the page — isolate them for parallel loading
- Return Promises directly in templates for non-blocking rendering:

  ```astro
  ---
  const dataPromise = fetch("...").then((r) => r.json());
  ---

  <p>{dataPromise}</p>
  ```
</streaming>

<javascript>
Astro ships zero client-side JavaScript by default. Only add JS when needed with client directives.
</javascript>

<clientDirectives>
When using framework components (React, Vue, Svelte), hydrate with:

- `client:load` — Hydrate immediately on page load
- `client:idle` — Hydrate when browser is idle
- `client:visible` — Hydrate when component is visible
- `client:only="react"` — Skip server render, client-only
</clientDirectives>
</performance>

<features>
<namedSlots>
Use named slots for complex component composition:

```astro
<!-- Component -->
<div>
  <header><slot name="header" /></header>
  <main><slot /></main>
  <footer><slot name="footer" /></footer>
</div>

<!-- Usage -->
<Component>
  <h1 slot="header">Title</h1>
  <p>Main content goes to default slot</p>
  <p slot="footer">Footer content</p>
</Component>
```

Use `<Fragment slot="name">` to pass multiple elements to a named slot without a wrapper.
</namedSlots>

<viewTransitions>
For SPA-like navigation with animations:

```astro
---
import { ViewTransitions } from "astro:transitions";
---

<head>
  <ViewTransitions />
</head>
```
</viewTransitions>

<contentCollections>
For blog posts, docs, or structured content, use content collections in `src/content/`.
</contentCollections>
</features>

<keyComponents>
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
</keyComponents>

<workflows>
<addingProjects>

**Two sources (mutually exclusive):**
- **Featured projects** (`src/content/projects/`) — Full MDX case studies with pages
- **Simple projects** (`src/data/projects.ts`) — External link cards only

**Decision tree:**
- Need dedicated page? → Create MDX in `src/content/projects/`
- External link only? → Add to `src/data/projects.ts`
- Never create both for the same project

<featuredProject>
**Steps:**
1. Save image to `src/assets/projects/project-name.png`
2. Create `src/content/projects/project-name.mdx`:

```mdx
---
title: "Project Name"
description: "Short description for project card"
category: "web" # or "games" or "creative"
tags: ["React", "TypeScript"]
externalUrl: "https://example.com" # Optional
heroImage: ../../assets/projects/project-name.png # UNQUOTED - critical!
heroImageAlt: "Hero image description"
ogDescription: "Custom social sharing description" # Optional
---

## Overview

Your full case study content here...
```

**Critical:** `heroImage` path must be UNQUOTED for Astro's `image()` schema.

✅ `heroImage: ../../assets/projects/hero.png`  
❌ `heroImage: "../../assets/projects/hero.png"`

**Result:** Dedicated page at `/projects/[slug]`, full SEO, clickable card with arrow icon
</featuredProject>

<simpleProject>
Add to `src/data/projects.ts` — do NOT also create MDX file:

```typescript
{
  title: "Project Name",
  description: "Brief description of what you built.",
  alt: "Screenshot of Project Name showing main visual",
  tags: ["Laravel", "PHP"],
  image: projectImg, // Import at top
  link: "https://example.com",
  category: "web",
}
```
</simpleProject>
</addingProjects>

<blog>
<features>
- **Content Collections API** — Type-safe with Zod validation
- **MDX Support** — Markdown or MDX with component support
- **Image Optimization** — Multiple formats (WebP, AVIF) at build time
- **SEO Optimized** — Open Graph, Twitter Cards, JSON-LD structured data
- **Draft Mode** — Keep in git but hide from production
- **Tags & Categories** — Organize with filterable tags
- **Table of Contents** — Auto-generated from headings
- **Performance** — LCP < 50ms, CLS = 0.00, fully static
</features>

<addingPost>
**Steps:**
1. Create `.md` or `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Your Post Title"
description: "Brief description for SEO and previews"
pubDate: 2024-12-26
author: "Peter Chr. Jørgensen"
tags: ["astro", "performance"]
draft: false
heroImage: ../../assets/blog/hero.jpg # Optional
heroImageAlt: "Description of hero image" # Optional
---

Your content here...
```

2. Add images to `src/assets/blog/` — auto-optimized
3. Preview locally (dev server should be running)
4. Build — drafts filtered out automatically
</addingPost>

<blogArchitecture>
- **Schema**: `src/content/config.ts` — Post structure and validation
- **Homepage Section**: `src/components/Blog.astro` — 3 latest posts
- **Post Template**: `src/pages/blog/[...slug].astro` — Individual post rendering
- **Sitemap**: Auto-included via `@astrojs/sitemap`
</blogArchitecture>
</blog>
</workflows>

<patterns>
<layoutWithProps>
```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Usage:**
```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Home" description="Welcome to my site">
  <h1>Welcome</h1>
</Layout>
```
</layoutWithProps>
</patterns>

<voice>
<background>
This is a **personal website**. All written content should reflect a consistent, authentic voice.

**About the author:**
- Senior web developer with 8 years professional experience (programming since age 14, now 32)
- Led a department of 8 developers + 2 project leads for 6 years in a digital marketing agency
- Shipped in PHP, Laravel, WordPress — from local businesses to multi-million dollar companies
- Comfortable in legacy and greenfield codebases, teams from solo to 6+ developers
- Deep knowledge of performance, DevOps/server ops, incident handling, and production trade-offs
- Experience training developers, hiring/firing, working as developer, project lead, and designer
</background>

<communicationLevel>
**Treat the author as a senior peer:**
- Skip basics and "what is X" explanations
- Assume familiarity with modern web tooling, architectural patterns, production realities
- Focus on sharp edges, trade-offs, constraints, decision-making heuristics
- Prefer concrete specifics over generic best-practice lists
- Explain the "why" (constraints, performance impact, maintainability) not just the "what"
- Use practitioner-level specificity: real metrics, before/after comparisons, actual edge cases
</communicationLevel>

<perspective>
- Always use **first-person singular**: "I am", "I think", "I built"
- Never use third-person ("Peter is...") or impersonal language
</perspective>

<tone>
**Characteristics:**
- Calm and friendly — Approachable, not salesy or aggressive
- Confident but humble — Demonstrate competence without arrogance
- Specific and concrete — Real examples, avoid vague claims
- Knowledgeable — Show depth, explain the "why" not just the "what"

**Avoid:**
- "Junior framing" and generic advice
- Empty superlatives ("highly skilled", "extensive experience")
- Let specifics (scope, constraints, outcomes) carry the credibility
</tone>

<writingStyle>
- Short, clear sentences over complex ones
- Direct — get to the point without unnecessary preamble
- Technical terms used appropriately, never over-complicated
- Sound like a real person in conversation, not a corporate brochure
</writingStyle>

<examples>
❌ "Peter is a highly skilled developer with extensive experience..."  
✅ "I'm a developer who loves building fast, accessible websites."

❌ "Services include web development and consulting."  
✅ "I build websites and help teams improve their frontend architecture."

❌ "Passionate about creating synergistic digital solutions."  
✅ "I enjoy solving tricky CSS problems and making sites feel snappy."
</examples>
</voice>

<validation>
Before committing, always:

1. Run `npm run check` to validate TypeScript and catch errors
2. Run `npx prettier --check .` for formatting
3. For normal testing, use the running `npm run dev` server (no need to run `npm run preview`)
</validation>
