import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DANISH_CONTENT_PATHS, PUBLIC_CONTENT_PATHS } from "../src/i18n/public-routes";

const readOutput = (path: string) => readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8");

describe("localized build output", () => {
  it.each([
    "experiments/browser-multiplayer/index.html",
    "experiments/groovy-waves/index.html",
    "experiments/idle-game/index.html",
    "experiments/surfaces/index.html",
  ])("marks %s as noindex", (outputPath) => {
    const output = readOutput(outputPath);

    expect(output).toMatch(/<meta\b(?=[^>]*\bname=robots)(?=[^>]*\bcontent="noindex, nofollow")[^>]*>/);
  });

  it("excludes experiment routes from the sitemap", () => {
    const sitemap = readOutput("sitemap-0.xml");
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

    expect(locations.some((location) => new URL(location).pathname.startsWith("/experiments/"))).toBe(false);
  });

  it("emits only canonical public content paths in the sitemap", () => {
    const sitemap = readOutput("sitemap-0.xml");
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

    expect(sitemap).not.toContain("__i18n");
    expect(locations).not.toContain("https://peterchrjoergensen.dk/tracker/");
    for (const publicPath of PUBLIC_CONTENT_PATHS) {
      const canonical = `https://peterchrjoergensen.dk${publicPath}`;
      expect(locations.filter((location) => location === canonical)).toHaveLength(1);
    }
  });

  it.each(PUBLIC_CONTENT_PATHS)("builds both locale variants and canonical metadata for %s", (publicPath) => {
    const outputPath = publicPath === "/" ? "index.html" : `${publicPath.slice(1)}index.html`;

    for (const locale of ["en", "da"] as const) {
      const contentLocale = locale === "da" && DANISH_CONTENT_PATHS.has(publicPath) ? "da" : "en";
      const openGraphLocale = contentLocale === "da" ? "da_DK" : "en_US";
      const output = readOutput(`__i18n/${locale}/${outputPath}`);
      expect(output).toMatch(new RegExp(`<html\\b[^>]*\\blang=${locale}(?:\\s|>)`));
      expect(output).toContain(`content=${openGraphLocale} property=og:locale`);
      expect(output).toContain(`href=https://peterchrjoergensen.dk${publicPath} rel=canonical`);

      if (locale === "da" && contentLocale === "en") {
        expect(output).toMatch(/<article\b[^>]*\blang=en(?:\s|>)/);
        expect(output).toContain("Denne artikel er i øjeblikket kun tilgængelig på engelsk.");
      }
    }
  });

  it("builds English and Danish homepages with localized document metadata and controls", () => {
    const english = readOutput("__i18n/en/index.html");
    const danish = readOutput("__i18n/da/index.html");

    expect(english).toMatch(/<html\b[^>]*\blang=en(?:\s|>)/);
    expect(english).toContain("content=en_US property=og:locale");
    expect(english).toMatch(/<button(?=[^>]*data-locale=en)(?=[^>]*aria-pressed=true)[^>]*>/);
    expect(english).toContain("Show this page in English");

    expect(danish).toMatch(/<html\b[^>]*\blang=da(?:\s|>)/);
    expect(danish).toContain("content=da_DK property=og:locale");
    expect(danish).toContain("Senior webudvikler");
    expect(danish).toMatch(/<button(?=[^>]*data-locale=da)(?=[^>]*aria-pressed=true)[^>]*>/);
    expect(danish).toContain("Vis denne side på dansk");

    expect(english).toContain("Feel free to reach out via");
    expect(english).toContain("Built with");
    expect(danish).toContain("Du er velkommen til at skrive en");
    expect(danish).toContain("Bygget med");
    expect(danish).toMatch(/Jeg hedder <strong[^>]*>Peter<\/strong> <span[^>]*>—(?:&nbsp;|\u00a0)<\/span>/);
    expect(danish).toMatch(/<\/span><\/strong> fra <strong[^>]*>Danmark\.<\/strong>/);
    expect(danish).toContain("Hvad jeg arbejder på lige nu");
    expect(danish).toMatch(/Lavet med\s*<span[^>]*>♥<\/span>\s*og AI i Danmark/);
  });

  it("builds localized internal 404 documents", () => {
    const english = readOutput("__i18n/en/404/index.html");
    const danish = readOutput("__i18n/da/404/index.html");

    expect(english).toMatch(/<html\b[^>]*\blang=en(?:\s|>)/);
    expect(english).toContain("Page not found");
    expect(danish).toMatch(/<html\b[^>]*\blang=da(?:\s|>)/);
    expect(danish).toContain("Siden blev ikke fundet");
  });

  it("renders native Danish articles and case studies at the same public slugs", () => {
    const translated = readOutput("__i18n/da/blog/welcome/index.html");
    const project = readOutput("__i18n/da/projects/browser-multiplayer/index.html");
    const listing = readOutput("__i18n/da/index.html");

    expect(translated).toMatch(/<html\b[^>]*\blang=da(?:\s|>)/);
    expect(translated).toContain("Her begynder bloggen");
    expect(translated).toContain('alt="Foto af Peter Chr. Jørgensen"');
    expect(project).toMatch(/<html\b[^>]*\blang=da(?:\s|>)/);
    expect(project).toContain("Jeg byggede et multiplayer-spil i browseren uden en server");
    expect(listing).not.toContain("Kun tilgængelig på engelsk");
    expect(listing).toContain("href=/projects/browser-multiplayer/");
  });
});
