import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BLOG_TRANSLATION_KEYS, DANISH_BLOG_TRANSLATION_KEYS, DANISH_PROJECT_TRANSLATION_KEYS, PROJECT_TRANSLATION_KEYS } from "../src/i18n/public-routes";

function entries(collection: "blog" | "projects") {
  const directory = new URL(`../src/content/${collection}/`, import.meta.url);
  return readdirSync(directory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => ({ filename, source: readFileSync(new URL(filename, directory), "utf8") }));
}

function assertTranslations(collection: "blog" | "projects", translationKeys: readonly string[], danishTranslationKeys: readonly string[]) {
  const sources = entries(collection);

  for (const translationKey of translationKeys) {
    const english = sources.filter(({ source }) => source.includes("locale: en\n") && source.includes(`translationKey: ${translationKey}\n`));
    const danish = sources.filter(({ source }) => source.includes("locale: da\n") && source.includes(`translationKey: ${translationKey}\n`));

    expect(english, `${translationKey} en`).toHaveLength(1);
    expect(english[0]!.filename).toBe(`${translationKey}.en.mdx`);
    expect(danish.length, `${translationKey} has at most one Danish peer`).toBeLessThanOrEqual(1);
    expect(danishTranslationKeys.includes(translationKey), `${translationKey} availability registry`).toBe(danish.length === 1);
    if (danish.length === 1) expect(danish[0]!.filename).toBe(`${translationKey}.da.mdx`);
  }

  expect(sources).toHaveLength(translationKeys.length + danishTranslationKeys.length);
}

describe("localized content sources", () => {
  it("has exactly one English source and validates optional Danish blog peers", () => {
    assertTranslations("blog", BLOG_TRANSLATION_KEYS, DANISH_BLOG_TRANSLATION_KEYS);
  });

  it("has exactly one English source and validates optional Danish case-study peers", () => {
    assertTranslations("projects", PROJECT_TRANSLATION_KEYS, DANISH_PROJECT_TRANSLATION_KEYS);
  });
});
