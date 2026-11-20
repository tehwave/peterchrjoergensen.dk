import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readBlogIndex = (locale: string) => readFileSync(new URL(`../dist/__i18n/${locale}/blog/index.html`, import.meta.url), "utf8");

const yearSections = (html: string) =>
  [...html.matchAll(/<section\b[^>]*aria-labelledby="?year-(\d{4})"?[^>]*>([\s\S]*?)<\/section>/g)].map(([, year, body]) => ({
    year: Number(year),
    body,
  }));

describe.each([
  { locale: "en", wow: "I kept missing bites when fishing in World of Warcraft.", godot: "I wanted to type <code>godot</code> in my terminal and get on with it." },
  { locale: "da", wow: "Jeg blev ved med at misse bid, når jeg fiskede i World of Warcraft.", godot: "Jeg ville bare skrive <code>godot</code> i min terminal og komme videre." },
])("blog index ($locale)", ({ locale, wow, godot }) => {
  const html = readBlogIndex(locale);
  const sections = yearSections(html);

  it("groups posts under year headings, newest year first", () => {
    const years = sections.map((section) => section.year);

    expect(years.length).toBeGreaterThan(1);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    for (const { year, body } of sections) {
      expect(body).toMatch(new RegExp(`<h2\\b[^>]*id="?year-${year}"?[^>]*>${year}</h2>`));
      const dates = [...body.matchAll(/<time\b[^>]*datetime="?(\d{4})-/g)].map((match) => Number(match[1]));
      expect(dates.length).toBeGreaterThan(0);
      expect(dates.every((date) => date === year)).toBe(true);
    }
  });

  it("lists every post once, as a card, with no separate featured post", () => {
    const cards = html.match(/<article\b[^>]*class="?blog-post-card\b/g) ?? [];
    const inSections = sections.reduce((count, { body }) => count + (body.match(/<article\b[^>]*class="?blog-post-card\b/g) ?? []).length, 0);

    expect(cards.length).toBeGreaterThan(0);
    expect(inSections).toBe(cards.length);
    expect(html).not.toContain("journal__featured");
  });

  it("shows the opening line of a post without a hero image in place of the image", () => {
    const covers = [...html.matchAll(/<p\b[^>]*class="?blog-post-card__cover-line\b[^>]*>([\s\S]*?)<\/p>/g)].map((match) => match[1].trim());

    expect(covers).toContain(wow);
    expect(covers).toContain(godot);
  });
});
