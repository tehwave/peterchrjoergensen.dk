import { defineConfig, fontProviders, svgoOptimizer } from "astro/config";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import compress from "@playform/compress";
import inline from "@playform/inline";
import mdx from "@astrojs/mdx";
import { serializeSitemap } from "./src/utils/sitemap";

// https://astro.build/config
export default defineConfig({
  // Cache directory for image optimization across builds
  cacheDir: "./cache",

  // Production URL for sitemap and canonical URLs
  site: "https://peterchrjoergensen.dk",

  // Ensure consistent trailing slash behavior with directory-based URLs
  trailingSlash: "always",

  // Integrations for SEO and functionality
  integrations: [
    sitemap({
      // Customize sitemap entries with frontmatter data
      serialize: (item) => serializeSitemap(item, ChangeFreqEnum),
    }),
    inline({
      // Inline critical CSS for faster FCP
      Beasties: {
        pruneSource: true,
      },
    }),
    compress({
      CSS: true,
      HTML: {
        "html-minifier-terser": {
          // JSON-LD article bodies can contain raw Markdown/MDX snippets.
          processScripts: [],
        },
      },
      Image: false,
      JavaScript: true,
      SVG: true,
    }),
    mdx(),
  ],

  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.fontsource(),
      weights: [400, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
    },
    {
      name: "Caveat",
      cssVariable: "--font-caveat",
      provider: fontProviders.fontsource(),
      weights: [700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["cursive"],
    },
  ],

  // Prefetch links for faster navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  // Automatic responsive image styles
  image: {
    // Allow optimized remote images used in MDX content
    domains: ["images.unsplash.com"],
    responsiveStyles: true,
  },

  build: {
    // Generate clean URLs without .html extension
    format: "directory",
    // Inline all stylesheets for faster initial render
    inlineStylesheets: "always",
  },

  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
