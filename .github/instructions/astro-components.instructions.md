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
import { Picture } from "astro:assets";

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
  <h1 class="container__title">{title}</h1>
</div>

<!-- 6. Scoped SASS styles — always use lang="scss" -->
<style lang="scss">
  @use "../styles/variables" as *;
  @use "../styles/mixins" as *;

  .container {
    padding: $space-lg;
  }

  .container__title {
    font-size: $font-size-xl;
  }
</style>
```

## Props Best Practices

- Always define `interface Props` when component accepts props
- Use `Astro.props` to access props — never function parameters
- Provide default values during destructuring: `const { value = "default" } = Astro.props`
- For no props: `type Props = Record<string, never>`
- For required children: `type Props = { children: any }`
- Props interface is auto-detected by Astro VS Code extension for IntelliSense

## Styling — Always Scoped SASS

**Every component must use scoped SASS.** Never use plain CSS.

### Required Pattern

```astro
<style lang="scss">
  @use "../styles/variables" as *;
  @use "../styles/mixins" as *;

  .component-name {
    color: $color-text-primary;
    @include transition(opacity, 0.3s);
  }
</style>
```

### SASS Rules

- **Always add `lang="scss"`** to the `<style>` tag
- **Always use `@use`** to import `variables` and `mixins` at the top of styles
- Use SASS partials path: `@use "../styles/variables" as *;`
- Import both even if only using one — keeps consistency
- Use `@use` (modern) not `@import` (deprecated)

### Scoping & Naming

- Styles are **automatically scoped** — they only affect this component
- Use **BEM naming convention**: `.component`, `.component__element`, `.component--modifier`
- Low-specificity selectors like `h1 {}` are safe — scoping prevents leaks
- Never use `<style is:global>` — global styles belong in `src/styles/global.scss`

### Styling Child Components

Use `:global()` to pierce scoped styles when styling child component markup:

```astro
<style lang="scss">
  article :global(h1) {
    color: blue; /* Only affects h1 inside this component's article */
  }
</style>
```

### Variables & Mixins Usage

**Always use design tokens from `_variables.scss`:**

- Colors: `$color-text-primary`, `$color-blue`, `$color-accent`
- Spacing: `$space-sm`, `$space-md`, `$space-lg`, `$space-xl`
- Typography: `$font-sans`, `$font-size-lg`, `$font-weight-semibold`
- Breakpoints: Use mixins, not raw values

**Use mixins from `_mixins.scss` for common patterns:**

- `@include respond-to(md)` — Media queries
- `@include container` — Max-width centered container
- `@include transition(property, duration)` — Smooth transitions
- `@include section-label` — Uppercase accent labels
- `@include section-heading` — Large section titles

### BEM Nesting Pattern

**Always nest BEM elements under the block using the `&` parent selector:**

```scss
// ✅ GOOD — All elements nested under the block
.project-page {
  padding-top: $header-height;

  &__header {
    max-width: $max-width;
  }

  &__title {
    font-size: $font-size-3xl;
  }

  &__meta {
    display: flex;
    gap: $space-md;
  }
}

// ❌ BAD — Separate top-level selectors
.project-page {
  padding-top: $header-height;
}

.project-page__header {
  max-width: $max-width;
}
```

**Benefits:**

- Single point of control for the component
- Easy to scan and maintain
- Clear visual hierarchy
- Prevents selector duplication

### Clean CSS Patterns

- **Keep specificity low** — single class selectors when possible
- **Nest all BEM elements under the block** — use `&__element` pattern
- **Avoid nesting beyond 3 levels** — flatter is better
- **Use logical property names**: `margin-inline`, `padding-block`
- **Group related properties**: layout → box model → typography → visual
- **One selector per line** for multi-selectors
- Use `class:list` for conditional classes:
  ```astro
  <div class:list={["base", { active: isActive, error }]}></div>
  ```

### Example Component Styles

```astro
<style lang="scss">
  @use "../styles/variables" as *;
  @use "../styles/mixins" as *;

  .hero {
    background: $color-bg;
    padding: $space-xl 0;

    @include respond-to(md) {
      padding: $space-lg 0;
    }
  }

  .hero__container {
    @include container;
    display: grid;
    gap: $space-lg;
  }

  .hero__title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    @include transition(color, 0.2s);
  }

  .hero__image {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
</style>
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
// ❌ Blocks entire page const data = await fetch("...").then(r => r.json()); //
✅ Enables streaming — header import DataComponent from "./DataComponent.astro"; <header
>
  Title
</header>
<DataComponent />
```

Or use Promises directly in templates (renders in parallel):

```astro
---
const dataPromise = fetch("...").then((r) => r.json());
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
