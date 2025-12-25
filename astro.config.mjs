// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";
import inline from "@playform/inline";

import vitePwa from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  // Production URL for sitemap and canonical URLs
  site: "https://peterchrjoergensen.dk",

  // Integrations for SEO and functionality
  integrations: [
    sitemap(),
    inline(), // Inline critical CSS for faster FCP
    compress({
      CSS: true,
      HTML: true,
      Image: false, // Already handled by Astro's built-in image optimization
      JavaScript: true,
      SVG: true,
    }),
    vitePwa({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
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
  ],

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
  },
});
