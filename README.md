# peterchrjoergensen.dk

My personal website, built with performance and simplicity in mind.

**Live site:** [peterchrjoergensen.dk](https://peterchrjoergensen.dk)

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
├── components/      # Reusable .astro components
├── data/            # Structured data (projects, etc.)
├── layouts/         # Page layouts with SEO meta tags
├── pages/           # File-based routing
├── styles/          # Global Sass (variables, mixins, base)
└── types/           # TypeScript type definitions
```

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
