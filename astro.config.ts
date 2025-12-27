import { defineConfig, fontProviders } from "astro/config";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import compress from "@playform/compress";
import inline from "@playform/inline";
import vitePwa from "@vite-pwa/astro";
import mdx from "@astrojs/mdx";
import { serializeSitemap } from "./src/utils/sitemap";

// https://astro.build/config
export default defineConfig({
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
      Beasties: {
        pruneSource: true,
      }
    }), // Inline critical CSS for faster FCP
    compress({
      CSS: true,
      HTML: true,
      Image: {
        sharp: {
          webp: { quality: 50 },
          avif: { quality: 25 },
        },
      },
      JavaScript: true,
      SVG: true,
    }),
    vitePwa({
      registerType: "autoUpdate",
      includeAssets: ["robots.txt"],
      manifest: {
        name: "Peter Chr. Jørgensen",
        short_name: "PCJ",
        description: "Personal website built with Astro",
        theme_color: "#0066cc",
        background_color: "#fafafa",
        display: "minimal-ui",
        start_url: "/",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    mdx(),
  ],

  // Prefetch links for faster navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  // Automatic responsive image styles
  image: {
    responsiveStyles: true,
  },

  build: {
    // Generate clean URLs without .html extension
    format: "directory",
    // Inline small stylesheets for faster initial render
    inlineStylesheets: "auto",
  },

  // Compress HTML output
  compressHTML: true,

  // Experimental optimizations
  experimental: {
    // Optimize SVG components with SVGO
    svgo: true,

    // Font optimization with automatic preload links and fallbacks
    // Eliminates CSS → Font request chain for better LCP
    fonts: [
      {
        name: "Inter",
        cssVariable: "--font-inter",
        provider: fontProviders.fontsource(),
        weights: [400, 500, 600, 700],
        styles: ["normal"],
        subsets: ["latin"],
        fallbacks: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
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
  },
});
