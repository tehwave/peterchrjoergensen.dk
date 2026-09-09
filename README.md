# peterchrjoergensen.dk

My corner of the web. A place to share what I've built, what I've learned, and what I'm working on.

**Take a look:** [peterchrjoergensen.dk](https://peterchrjoergensen.dk)

## Why This Exists

I've been writing code since I was 14. Turned it into a career at 24. For most of that time, I ran a dev team at a marketing agency—shipping sites for local businesses, startups, and companies pulling in millions. PHP, Laravel, WordPress, whatever got the job done.

This site is where I showcase the work I'm proud of and write about what I've learned along the way. It's also an experiment in building something fast and simple with modern tools.

## What's Inside

Browse through [projects](https://peterchrjoergensen.dk/#projects) I've built—everything from web platforms to game jam entries. Read the [blog](https://peterchrjoergensen.dk/blog/) for thoughts on web development, performance, and occasionally game dev.

The site itself is built with [Astro](https://astro.build)—a framework that ships zero JavaScript by default and lets pages load in under a second.

Self-hosted fonts, edge deployment on Cloudflare, and images optimized at build time. _It's fast because it doesn't carry what it doesn't need._

## Built With

- **Astro 7** — Static site generation, zero JS by default
- **TypeScript** — Type safety without the overhead
- **Sass** — Scoped component styles, design tokens
- **Cloudflare Workers + Static Assets** — Same-URL language negotiation at the edge

## English and Danish at the Same URL

Astro prebuilds English and Danish variants beneath the private `__i18n/{locale}` asset namespace. A small Cloudflare Worker serves the chosen variant at the existing public URL, so `/blog/welcome/` stays `/blog/welcome/` in both languages.

Language selection follows this order:

1. A valid `pcj_locale=en|da` cookie set by the EN/DA header control
2. The highest-ranked supported value in `Accept-Language`
3. English

The cookie lasts one year. HTML responses are private/no-cache and vary on the cookie and language header, while `_astro`, images, experiments, tracker, sitemap files, and other static assets stay on Cloudflare's asset-first path. Direct `__i18n` requests return a localized 404.

## Related content in articles and cases

Both components are inserted manually in the EN and DA MDX files. Choose useful destinations and descriptive link text in each language. Use public URLs with trailing slashes.

Use [RelatedPost](src/components/RelatedPost.astro) within the text:

```mdx
import RelatedPost from "../../components/RelatedPost.astro";

<RelatedPost href="/projects/quickpay-cli/" prefix="Read" linkText="how I built Quickpay CLI" suffix="for the architecture and delivery rules." />
```

Use [RelatedContent](src/components/RelatedContent.astro) at the end of the MDX file:

```mdx
import RelatedContent from "../../components/RelatedContent.astro";

<RelatedContent heading="Read next" links={[{ href: "/projects/quickpay-cli/", title: "How I built Quickpay CLI" }]} />
```

Use `heading="Læs videre"` and Danish link titles in Danish files. Pick one to three relevant links, including cases or posts where useful. Omit the component when there is no useful next step. An empty `links` array also renders nothing. Existing inline links may appear again in the final list. When adding content, also consider a link to it from an existing article. There is no automatic matching or central relationship registry.

## Installation

If you want to poke around:

```bash
npm install
```

```bash
npm run dev
```

`npm run dev` builds the static assets and starts the complete Worker locally. Use `npm test`, `npm run check`, and `npm run build` for validation.

## License

Code's open source. Use it to learn, reference it for your own projects. That's what it's here for. Content's mine though.
