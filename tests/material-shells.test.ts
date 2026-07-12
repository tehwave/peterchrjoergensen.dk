import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

describe("site material shells", () => {
  test("uses the blue surface base for the hero and sticky navbar", async () => {
    const [hero, header] = await Promise.all([
      readFile(new URL("../src/components/Hero.astro", import.meta.url), "utf8"),
      readFile(new URL("../src/components/Header.astro", import.meta.url), "utf8"),
    ]);

    expect(hero).toContain("background-color: $color-blue;");
    expect(header).toContain("background-color: rgba($color-blue, 0.96);");
  });
});
