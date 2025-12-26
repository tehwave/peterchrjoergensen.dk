---
# Blog Post Frontmatter
# Standard Markdown posts work too - no need for MDX unless you want to import components
title: "Building Performance-First Websites with Astro"
description: "Learn how to build blazingly fast websites using Astro's island architecture and modern performance optimization techniques."
pubDate: 2024-12-20
author: "Peter Chr. Jørgensen"
tags: ["astro", "performance", "web development", "optimization"]
draft: false
---

# Building Performance-First Websites

Performance isn't just a nice-to-have feature—it's essential for user experience, SEO, and conversions. Here's how I approach building fast websites with Astro.

## The Performance Budget

I always start with clear performance goals:

- **Lighthouse Score**: 95+ in all categories
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## Astro's Secret Sauce

Astro achieves incredible performance through several key innovations:

### 1. Zero JavaScript by Default

Unlike traditional frameworks, Astro ships zero JavaScript to the browser by default. This means:

- Faster initial page loads
- Better SEO (search engines can easily crawl static HTML)
- Reduced bundle sizes

### 2. Islands Architecture

Astro's islands architecture lets you add interactivity only where needed:

\`\`\`astro
---
import InteractiveWidget from '../components/InteractiveWidget.jsx';
---

<div>
  <h1>Mostly Static Page</h1>
  <InteractiveWidget client:visible />
</div>
\`\`\`

The `client:visible` directive means the component only hydrates when it enters the viewport.

### 3. Image Optimization

Astro's built-in image optimization is fantastic:

\`\`\`astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.jpg';
---

<Image 
  src={hero} 
  alt="Hero image"
  width={1200}
  height={630}
  loading="lazy"
  decoding="async"
/>
\`\`\`

This automatically:
- Generates optimized formats (WebP, AVIF)
- Creates responsive images
- Lazy loads images below the fold

## Real-World Results

After migrating my portfolio to Astro, I saw:

- **90% reduction** in JavaScript bundle size
- **Lighthouse scores** all above 95
- **LCP improved** from 4.2s to 1.1s

## Best Practices

Here are my top tips for performance:

1. **Minimize JavaScript**: Only hydrate what needs to be interactive
2. **Optimize Images**: Use Astro's `<Image>` component everywhere
3. **Defer Non-Critical Resources**: Load analytics and other scripts after the page loads
4. **Use Static Generation**: Pre-render pages at build time whenever possible
5. **Monitor Performance**: Use tools like Lighthouse and Web Vitals

## Conclusion

Astro makes it easy to build fast websites without sacrificing developer experience. The island architecture and zero-JS default approach are game-changers for content-driven sites.

If you haven't tried Astro yet, I highly recommend giving it a shot. Your users (and your Lighthouse scores) will thank you!
