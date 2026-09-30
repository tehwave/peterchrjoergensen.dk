import { existsSync, readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { PUBLIC_CONTENT_PATHS } from "../src/i18n/public-routes";

const readPage = (locale: string, path: string) => readFileSync(new URL(`../dist/__i18n/${locale}${path}index.html`, import.meta.url), "utf8");

it("renders manually selected links to existing localized pages without self-links or duplicates", () => {
  for (const path of PUBLIC_CONTENT_PATHS.filter((path) => (path.startsWith("/blog/") && path !== "/blog/") || path.startsWith("/projects/"))) {
    const destinations: string[][] = [];
    for (const locale of ["en", "da"]) {
      const html = readPage(locale, path);
      const section = html.match(/<section\b[^>]*class="?related-content\b[^>]*>([\s\S]*?)<\/section>/)?.[1];
      if (path === "/blog/godot-cli-on-macos-zsh/") {
        expect(section).toBeUndefined();
        continue;
      }
      if (["/blog/rebuilt-my-site-with-astro/", "/projects/quickpay-cli/"].includes(path)) {
        expect(section, `${locale}${path}`).toBeDefined();
        expect(html).toMatch(/<p\b[^>]*class="?related-post\b/);
      }
      if (!section) continue;
      expect(section).toContain(locale === "da" ? "Læs videre" : "Read next");
      expect(section).toMatch(/<ul\b/);
      const links = [...section.matchAll(/<a\b[^>]*href=["']?([^\s"'>]+)[^>]*>([^<]+)<\/a>/g)];
      expect(links.length).toBeGreaterThan(0);
      expect(links.length).toBeLessThanOrEqual(3);
      const hrefs = links.map((link) => link[1]);
      expect(new Set(hrefs).size).toBe(hrefs.length);
      expect(hrefs).not.toContain(path);
      for (const [, href, label] of links) {
        expect(href).toMatch(/^\/(blog|projects)\/[a-z0-9-]+\/$/);
        expect(label.trim().length).toBeGreaterThan(0);
        expect(existsSync(new URL(`../dist/__i18n/${locale}${href}index.html`, import.meta.url)), href).toBe(true);
      }
      destinations.push(hrefs);
    }
    if (destinations.length) expect(destinations[0]).toEqual(destinations[1]);
  }
});
