import { describe, expect, it } from "vitest";
import { PUBLIC_CONTENT_PATHS } from "../i18n/public-routes";
import { lastModifiedBlogPost } from "./sitemap";

describe("public sitemap routes", () => {
  it("contains each canonical localized-content URL exactly once without internal paths", () => {
    expect(new Set(PUBLIC_CONTENT_PATHS).size).toBe(PUBLIC_CONTENT_PATHS.length);
    expect(PUBLIC_CONTENT_PATHS).toContain("/");
    expect(PUBLIC_CONTENT_PATHS).toContain("/blog/");
    expect(PUBLIC_CONTENT_PATHS).toContain("/blog/welcome/");
    expect(PUBLIC_CONTENT_PATHS).toContain("/projects/browser-multiplayer/");
    expect(PUBLIC_CONTENT_PATHS.every((path) => !path.includes("__i18n"))).toBe(true);
  });

  it("reads last-modified metadata from the required English source", async () => {
    expect(await lastModifiedBlogPost("welcome")).toEqual(new Date("2025-12-24"));
  });
});
