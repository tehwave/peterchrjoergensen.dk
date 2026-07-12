import { describe, expect, it } from "vitest";
import { getProjects } from "../data/projects";
import { getMessages, messages } from "./messages";

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") return [prefix];
  if (!value || typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key));
}

function valueAtPath(value: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, value);
}

describe("messages", () => {
  it("keeps English and Danish dictionaries structurally identical and non-empty", () => {
    const englishPaths = leafPaths(messages.en).sort();
    const danishPaths = leafPaths(messages.da).sort();

    expect(danishPaths).toEqual(englishPaths);
    for (const path of englishPaths) {
      expect(valueAtPath(messages.en, path), `English ${path}`).toEqual(expect.stringMatching(/\S/));
      expect(valueAtPath(messages.da, path), `Danish ${path}`).toEqual(expect.stringMatching(/\S/));
    }
  });

  it("covers shared chrome, page metadata, listings, content fallback, and accessibility labels", () => {
    const copy = getMessages("da");

    expect(copy.navigation.mainLabel).toBe("Primær navigation");
    expect(copy.localeSwitch.selectDanish).toContain("dansk");
    expect(copy.blog.englishOnly).toContain("engelsk");
    expect(copy.article.translationNotice).toContain("engelsk");
    expect(copy.metadata.homeDescription).toContain("webudvikler");
    expect(copy.footer.contact.emailLabel).toBe("mail");
    expect(copy.currentWork.heading).toBe("Hvad jeg arbejder på lige nu");
  });
});

describe("localized projects", () => {
  it("provides translated descriptions and alt text without changing project identity or links", () => {
    const english = getProjects("en");
    const danish = getProjects("da");

    expect(danish).toHaveLength(english.length);
    expect(danish.length).toBeGreaterThan(20);

    english.forEach((project, index) => {
      const translated = danish[index];
      expect(translated.link).toBe(project.link);
      expect(translated.image).toBe(project.image);
      expect(translated.category).toBe(project.category);
      expect(translated.description).toEqual(expect.stringMatching(/\S/));
      expect(translated.alt).toEqual(expect.stringMatching(/\S/));
      expect(translated.description).not.toBe(project.description);
      expect(translated.alt).not.toBe(project.alt);
    });
  });
});
