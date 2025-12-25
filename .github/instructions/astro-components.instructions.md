---
applyTo: "**/*.astro"
---

# Astro Component Guidelines

## Component Structure

Always structure `.astro` files with frontmatter first, then template, then styles:

```astro
---
// 1. Imports
import Component from "./Component.astro";
import { Image } from "astro:assets";

// 2. Props interface (if accepting props)
interface Props {
  title: string;
  count?: number;
}

// 3. Props destructuring with defaults
const { title, count = 0 } = Astro.props;

// 4. Data fetching / logic
const data = await fetchData();
---

<!-- 5. Template -->
<div class="container">
  <h1>{title}</h1>
</div>

<!-- 6. Scoped styles -->
<style>
  .container { }
</style>
```

## Props Best Practices

- Always define `interface Props` when component accepts props
- Use `Astro.props` to access props — never function parameters
- Provide default values during destructuring: `const { value = "default" } = Astro.props`
- For no props: `type Props = Record<string, never>`
- For required children: `type Props = { children: any }`
- Props interface is auto-detected by Astro VS Code extension for IntelliSense

## Scoped Styles

- Styles are **automatically scoped** — they only affect the current component
- Low-specificity selectors like `h1 {}` are safe to use
- Scoped styles **don't leak** to child components or the rest of the site
- To style child components, wrap them in a styleable element or use `:global()`:
  ```astro
  <style>
    /* Only affects h1 inside this component's article */
    article :global(h1) {
      color: blue;
    }
  </style>
  ```
- Use `<style is:global>` only when truly needed for site-wide styles
- Use `class:list` for conditional classes:
  ```astro
  <div class:list={["base", { active: isActive, "has-error": error }]}>
  ```

## Images & Assets

Import and use the `<Image>` component for automatic optimization:

```astro
---
import { Image } from "astro:assets";
import heroImage from "../assets/hero.jpg";
---
<Image src={heroImage} alt="Hero" />
```

For responsive images with multiple formats:

```astro
---
import { Picture } from "astro:assets";
import photo from "../assets/photo.png";
---
<Picture src={photo} formats={["avif", "webp"]} alt="Photo" />
```

**Critical:** `alt` is **mandatory** on `<Image>` and `<Picture>` components.

## Slots

### Default Slot

```astro
<!-- Component -->
<div class="wrapper">
  <slot />
</div>
```

### Named Slots

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
  <p>Default slot content</p>
  <span slot="footer">Footer</span>
</Component>
```

### Multiple Elements in Named Slot

Use `<Fragment>` to pass multiple elements without a wrapper:

```astro
<Component>
  <Fragment slot="header">
    <h1>Title</h1>
    <p>Subtitle</p>
  </Fragment>
</Component>
```

**Note:** Named slots must be immediate children — they cannot be passed through nested elements.

## Layouts

- Layouts **must** include `<slot />` to render child content
- Pass data via props, not global state
- Include essential `<head>` elements:
  - `<meta charset="UTF-8" />`
  - `<meta name="viewport" content="width=device-width" />`
  - `<title>{title}</title>`

## Performance: Streaming

Move `await` calls into separate components to enable streaming:

```astro
// ❌ Blocks entire page
---
const data = await fetch("...").then(r => r.json());
---

// ✅ Enables streaming — header renders while data loads
---
import DataComponent from "./DataComponent.astro";
---
<header>Title</header>
<DataComponent />
```

Or use Promises directly in templates (renders in parallel):

```astro
---
const dataPromise = fetch("...").then(r => r.json());
---
<p>{dataPromise}</p>
```

## Template Expressions

- `{expression}` — Dynamic values
- `{list.map(item => <li>{item}</li>)}` — Render lists
- `{condition && <Element />}` — Conditional rendering
- `{condition ? <A /> : <B />}` — Either/or rendering
- `{...spreadProps}` — Spread attributes onto elements

## Accessibility

- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`)
- Always include `alt` text on images
- Use proper heading hierarchy (`<h1>` → `<h2>` → `<h3>`)
- Ensure interactive elements are keyboard accessible
