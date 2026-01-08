# Astro Project — Copilot Instructions

## Project Overview

Personal website built with Astro 5.x — a modern static site generator that delivers zero-JavaScript by default with optional hydration for interactive components.

## Astro Documentation

When you need to look up Astro APIs, patterns, or best practices, use the `search_astro_docs` tool to search the official Astro documentation. This is especially helpful for:

- Component syntax and directives
- Image optimization APIs (`<Image>`, `<Picture>`)
- Content collections and data fetching
- View transitions and routing
- Integration configurations
- Any Astro-specific features or APIs

## Tech Stack

- **Framework:** Astro 5.16+
- **Language:** TypeScript (strict mode)
- **Formatting:** Prettier with `prettier-plugin-astro`
- **Build Output:** Static HTML (SSG)

## Build & Development

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

**Important:** NEVER run `npm run dev` - the user is always running it. NEVER run `npm run preview` or `killall node` commands unless specifically testing production builds with Chrome DevTools.

## Project Structure

```
src/
├── assets/          # Static assets (images, SVGs) — processed by Astro
├── components/      # Reusable .astro components
├── layouts/         # Page layouts with <slot /> for content
├── pages/           # File-based routing (each file = a route)
public/              # Static files served as-is (favicon, robots.txt)
├── _headers         # Cloudflare Pages headers (CSP, security)
├── _redirects       # Cloudflare Pages redirects
```

**Important:** `src/pages/` is the **only required directory** in Astro. Without it, your site has no routes.

## Security & Headers

### Content Security Policy (CSP)

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

## Astro Component Anatomy

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

## Coding Conventions

### Components

- Use `.astro` extension for Astro components
- Place reusable components in `src/components/`
- Place page layouts in `src/layouts/`
- Use `<slot />` in layouts to render child content
- Use named slots for complex layouts: `<slot name="header" />`
- Import assets from `src/assets/` — Astro optimizes them automatically

### Pages & Routing

- Every file in `src/pages/` becomes a route
- `index.astro` → `/`
- `about.astro` → `/about`
- `blog/[slug].astro` → dynamic route `/blog/:slug`
- `projects/[...slug].astro` → dynamic route `/projects/:slug` for MDX project pages

**Internal link conventions:**

- Always include trailing slashes on internal links: `href="/about/"`, `href="/"`
- Fragment identifiers don't need trailing slash before `#`: `href="/#projects"`, `href="/about/#contact"`
- This ensures consistency with Astro's default trailing slash behavior

### Projects System

This site uses a **hybrid projects system** that merges two data sources:

1. **Simple projects** (`src/data/projects.ts`) — Array of project objects with frontmatter
   - Display as cards on homepage
   - External links only (no dedicated pages)
   - Quick to add for portfolio items

2. **MDX projects** (`src/content/projects/`) — Full MDX case studies
   - Each MDX file gets a dedicated page at `/projects/[slug]`
   - Display as cards with an arrow icon indicating a page exists
   - Full SEO optimization (Open Graph, Twitter Cards, JSON-LD)
   - Hero images, rich content, and MDX component support

**Projects display logic:**

- MDX projects with content → card with arrow → links to `/projects/[slug]`
- Simple projects → card with external link icon → opens external URL
- Both types use the same `ProjectCard` component for consistency

**To add a project:**

- **Simple project**: Add to `src/data/projects.ts` array
- **Featured project**: Create MDX file in `src/content/projects/`

### Styling Best Practices

- **Always use scoped SASS** — Every component must have `<style lang="scss">`
- **Import design tokens**: Always `@use "../styles/variables" as *;` and `@use "../styles/mixins" as *;`
- **BEM naming**: `.component`, `.component__element`, `.component--modifier`
- **Nest BEM elements efficiently**: Use `&__element` under the block for better organization:
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
- **Automatic scoping** — Styles only affect the current component, never leak
- **Use design tokens** from `_variables.scss` — never hardcode colors, spacing, or breakpoints
- **Use mixins** from `_mixins.scss` — `@include respond-to(md)`, `@include container`, etc.
- Low-specificity selectors like `h1 {}` are safe — they get scoped automatically
- Use `<style is:global>` **never** — global styles belong in `src/styles/global.scss`
- Use `:global()` selector to style child components: `article :global(h1) { }`
- Use `class:list` for conditional classes: `<div class:list={["base", { active: isActive }]}>`

### Images & Assets

- **Always use `<Picture />` from `astro:assets`** for all image assets — it provides optimal responsive images with modern formats:

  ```astro
  ---
  import { Picture } from "astro:assets";
  import photo from "../assets/photo.png";
  ---

  <Picture src={photo} formats={["avif", "webp"]} alt="Photo description" />
  ```

- `<Picture />` automatically generates multiple formats (AVIF, WebP, fallback) and optimizes images at build time
- Import images from `src/assets/` for automatic optimization
- Always specify `formats={["avif", "webp"]}` for best performance
- The `alt` attribute is **mandatory** — builds will fail without it
- Use `<Image />` only when you don't need multiple formats or responsive srcsets
- Place unprocessed files (favicon, robots.txt) in `public/`

### TypeScript

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

## Performance Best Practices

### Streaming & Data Fetching

- **Move async data fetching into separate components** to enable HTML streaming
- Components with `await` block the page — isolate them for parallel loading
- Return Promises directly in templates for non-blocking rendering:

  ```astro
  ---
  const dataPromise = fetch("...").then((r) => r.json());
  ---

  <p>{dataPromise}</p>
  ```

### Zero JavaScript by Default

Astro ships zero client-side JavaScript unless you explicitly add interactive components with client directives.

### Client Directives (for interactivity)

When using framework components (React, Vue, Svelte), hydrate with:

- `client:load` — Hydrate immediately on page load
- `client:idle` — Hydrate when browser is idle
- `client:visible` — Hydrate when component is visible
- `client:only="react"` — Skip server render, client-only

## Key Features

### Named Slots

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

### View Transitions

For SPA-like navigation with animations:

```astro
---
import { ViewTransitions } from "astro:transitions";
---

<head>
  <ViewTransitions />
</head>
```

### Content Collections

For blog posts, docs, or structured content, use content collections in `src/content/`.

## Common Patterns

### Layout with Props

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

### Using the Layout

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Home" description="Welcome to my site">
  <h1>Welcome</h1>
</Layout>
```

## Content & Tone of Voice

This is a **personal website**, so all written content should reflect a consistent voice:

### Background Context (About Me)

- I’m a **senior web developer** with **8 years** of professional experience (I’ve been programming since I was **14**; I’m **32** now)
- For **6 of those 8 years**, I led a department ( **8 developers** + **2 project leads** ) in a digital marketing agency
- I’ve shipped in **PHP**, **Laravel**, and **WordPress** across everything from local business websites to **multi‑million** businesses
- I’m comfortable in both **legacy** and **greenfield** codebases, and on teams ranging from solo to ~6+ developers (including external collaborators)
- I know **performance**, **DevOps/server ops**, and what it takes to run projects when things break (incident handling, trade-offs, and pragmatism)
- I’ve trained developers, hired and fired, and worked as developer, project lead, and designer

### Communication Level & Working Style

**Treat me as a senior peer:**

- Skip basics and "what is X" explanations — assume familiarity with modern web tooling, architectural patterns, and production realities
- Focus on sharp edges, trade-offs, constraints, and decision-making heuristics
- Prefer concrete specifics over generic best-practice lists
- When suggesting approaches, explain the "why" (constraints, performance impact, maintainability trade-offs) not just the "what"
- Default to practitioner-level specificity: real metrics, before/after comparisons, edge cases that actually happen

### Perspective

- Always use **first-person singular**: "I am", "I think", "I built", "My experience"
- Never use third-person ("Peter is a developer...") or impersonal language

### Tone

- **Calm and friendly** — Approachable, not salesy or aggressive
- **Confident but humble** — Demonstrate competence without arrogance
- **Specific and concrete** — Use real examples, avoid vague claims
- **Knowledgeable** — Show depth of understanding, explain the "why" not just the "what"

Additional tone guardrails:

- Avoid “junior framing” and generic advice; default to practitioner-level specificity and real trade-offs
- Don’t describe me with empty superlatives (“highly skilled”); let specifics (scope, constraints, outcomes) carry the credibility

### Writing Style

- Prefer short, clear sentences over complex ones
- Be direct — get to the point without unnecessary preamble
- Use technical terms appropriately, but don't over-complicate
- Sound like a real person having a conversation, not a corporate brochure

### Examples

❌ "Peter is a highly skilled developer with extensive experience..."  
✅ "I'm a developer who loves building fast, accessible websites."

❌ "Services include web development and consulting."  
✅ "I build websites and help teams improve their frontend architecture."

❌ "Passionate about creating synergistic digital solutions."  
✅ "I enjoy solving tricky CSS problems and making sites feel snappy."

## Validation

Before committing, always:

1. Run `npm run check` to validate TypeScript and catch errors
2. Run `npx prettier --check .` for formatting
3. For normal testing, use the running `npm run dev` server (no need to run `npm run preview`)
