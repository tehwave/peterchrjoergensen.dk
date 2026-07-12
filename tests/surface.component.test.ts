import { readFile } from "node:fs/promises";

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, test } from "vitest";

import Surface from "../src/components/Surface.astro";

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create();
});

async function renderSurface(props: Record<string, unknown>, slot = "Surface content") {
  return container.renderToString(Surface, {
    props,
    slots: { default: slot },
  });
}

describe("Surface", () => {
  test("renders the stable defaults", async () => {
    const html = await renderSurface({ tone: "dark" });

    expect(html).toMatch(/^<div\b/);
    expect(html).toContain("surface--dark");
    expect(html).toContain("surface--width-full");
    expect(html).toContain("surface--height-auto");
    expect(html).toContain("surface--depth-none");
    expect(html).toContain('data-surface="dark"');
    expect(html).toContain('data-surface-depth="none"');
    expect(html).toContain("Surface content");
  });

  test("maps semantic and accessible props onto the root", async () => {
    const html = await renderSurface(
      {
        tone: "light",
        as: "article",
        width: "contained",
        height: "viewport",
        depth: "end",
        id: "paper-card",
        labelledby: "paper-card-title",
        class: "featured-surface",
      },
      '<h2 id="paper-card-title">Paper card</h2>',
    );

    expect(html).toMatch(/^<article\b/);
    expect(html).toContain("surface--light");
    expect(html).toContain("surface--width-contained");
    expect(html).toContain("surface--height-viewport");
    expect(html).toContain("surface--depth-end");
    expect(html).toContain("featured-surface");
    expect(html).toContain('id="paper-card"');
    expect(html).toContain('aria-labelledby="paper-card-title"');
    expect(html).toContain('<h2 id="paper-card-title">Paper card</h2>');
  });

  test("provides the former light-blue hero material as a third tone", async () => {
    const html = await renderSurface({ tone: "blue" });
    const source = await readFile(new URL("../src/components/Surface.astro", import.meta.url), "utf8");

    expect(html).toContain("surface--blue");
    expect(html).toContain('data-surface="blue"');
    expect(source).toContain("&--blue");
    expect(source).toContain("--surface-background: #0a49b1;");
  });

  test.each(["section", "aside", "main", "footer"])("supports a semantic %s element", async (element) => {
    const html = await renderSurface({ tone: "light", as: element });

    expect(html).toMatch(new RegExp(`^<${element}\\b`));
  });

  test("keeps the decorative depth layer below child content", async () => {
    const html = await renderSurface({ tone: "dark", depth: "start" }, "<p data-test-content>Layered content</p>");

    const depthIndex = html.indexOf('class="surface__depth"');
    const contentIndex = html.indexOf('class="surface__content"');
    const slotIndex = html.indexOf("data-test-content");

    expect(depthIndex).toBeGreaterThan(-1);
    expect(contentIndex).toBeGreaterThan(depthIndex);
    expect(slotIndex).toBeGreaterThan(contentIndex);
    expect(html).toContain('aria-hidden="true"');
  });

  test("exposes the shared material variables without taking over consumer spacing", async () => {
    const source = await readFile(new URL("../src/components/Surface.astro", import.meta.url), "utf8");

    for (const variable of ["--surface-background", "--surface-heading", "--surface-text", "--surface-muted", "--surface-border", "--surface-link", "--surface-accent"]) {
      expect(source).toContain(variable);
    }

    expect(source).not.toMatch(/\bpadding(?:-block|-inline)?\s*:/);
    expect(source).not.toMatch(/\bborder-radius\s*:/);
  });
});
