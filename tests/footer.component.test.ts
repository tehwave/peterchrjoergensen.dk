import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

describe("Footer wave treatment", () => {
  test("keeps the top mask and bottom animated wave layers", async () => {
    const source = await readFile(new URL("../src/components/Footer.astro", import.meta.url), "utf8");

    expect(source).toContain('class="footer__wave footer__wave--top"');
    expect(source).toContain('class="footer__wave footer__wave--bottom"');
    expect(source).toContain('data-footer-wave="bottom"');
    expect(source).toContain("createStackedWaveScene");
    expect(source).toContain('canvasSelector: "[data-footer-wave]"');
  });
});
