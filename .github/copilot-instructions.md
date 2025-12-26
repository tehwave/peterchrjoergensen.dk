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

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code
npx prettier --write .
```

## Project Structure

```
src/
├── assets/          # Static assets (images, SVGs) — processed by Astro
├── components/      # Reusable .astro components
├── layouts/         # Page layouts with <slot /> for content
├── pages/           # File-based routing (each file = a route)
public/              # Static files served as-is (favicon, robots.txt)
```

**Important:** `src/pages/` is the **only required directory** in Astro. Without it, your site has no routes.

## Astro Component Anatomy

Every `.astro` file has two parts:

```astro
---
// Component Script (runs at build time on server)
import Component from "../components/Component.astro";
const data = await fetch("...").then((r) => r.json());
---

<!-- Component Template (HTML output) -->
<div>{data.title}</div>

<style>
  /* Scoped styles (only affect this component) */
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

### Styling Best Practices

- **Scoped styles by default** — Astro automatically scopes `<style>` to the component
- Low-specificity selectors like `h1 {}` are safe — they get scoped automatically
- Use `<style is:global>` **sparingly** for truly global styles
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

### Perspective

- Always use **first-person singular**: "I am", "I think", "I built", "My experience"
- Never use third-person ("Peter is a developer...") or impersonal language

### Tone

- **Calm and friendly** — Approachable, not salesy or aggressive
- **Confident but humble** — Demonstrate competence without arrogance
- **Specific and concrete** — Use real examples, avoid vague claims
- **Knowledgeable** — Show depth of understanding, explain the "why" not just the "what"

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

1. Run `npm run build` to ensure no build errors
2. Run `npx prettier --check .` for formatting
3. Test with `npm run preview` for production behavior
