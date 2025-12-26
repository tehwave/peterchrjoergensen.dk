---
# Each field explained:
# title: Post title shown in cards, page header, and SEO
# description: Brief summary for cards, meta tags, and social shares
# pubDate: Publication date (YYYY-MM-DD format)
# author: Author name (optional)
# tags: Array of tags for categorization (optional)
# draft: Set to true to hide from production (optional, default: false)
# heroImage: Path to hero image (optional)
# heroImageAlt: Alt text for hero image (optional, but required if heroImage is set)
title: "Getting Started with Astro Content Collections"
description: "A practical guide to using Astro's Content Collections API for type-safe content management in your static sites."
pubDate: 2024-12-15
author: "Peter Chr. Jørgensen"
tags: ["astro", "content", "typescript", "tutorial"]
draft: false
heroImage: ../../assets/blog/sample-hero.svg
heroImageAlt: "Blog hero image"
---

Content Collections are one of Astro's most powerful features, providing type-safe content management for your static site.

## Why Content Collections?

When building content-heavy sites like blogs or documentation, you need:

- **Type safety** — Catch errors at build time, not runtime
- **Schema validation** — Ensure all content has required fields
- **Performance** — Optimized queries and automatic bundling
- **Developer experience** — IntelliSense and autocomplete

## Setting Up Collections

First, create your collection schema in `src/content/config.ts`:

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

## Querying Content

Use `getCollection()` to fetch all posts:

```typescript
import { getCollection } from "astro:content";

const posts = await getCollection("blog");
const published = posts.filter(post => !post.data.draft);
```

## Rendering Content

Use the `render()` function to get the compiled content:

```typescript
import { render } from "astro:content";

const post = await getCollection("blog", { id: "my-post" });
const { Content } = await render(post);
```

Then render it in your template:

```astro
<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## Benefits

Content Collections give you the best of both worlds:

- Git-based content management
- Type-safe data access
- Automatic optimization
- Flexible rendering

Perfect for blogs, documentation, or any content-driven site.
