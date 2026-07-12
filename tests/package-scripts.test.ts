import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  scripts: Record<string, string>;
};

describe("development scripts", () => {
  it("watches Astro sources while Wrangler serves the complete Worker locally", () => {
    expect(packageJson.scripts.dev).toContain("concurrently");
    expect(packageJson.scripts.dev).toContain("dev:astro");
    expect(packageJson.scripts.dev).toContain("wrangler dev");
    expect(packageJson.scripts["dev:astro"]).toContain("chokidar");
    expect(packageJson.scripts["dev:astro"]).toContain("astro build");
  });
});
