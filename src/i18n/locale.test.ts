import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, isLocale, localeMetadata, parseAcceptLanguage, parseLocaleCookie, resolveLocale, serializeLocaleCookie } from "./locale";
import * as localeModule from "./locale";

describe("isLocale", () => {
  it.each(["en", "da"])("accepts supported locale %s", (locale) => {
    expect(isLocale(locale)).toBe(true);
  });

  it.each(["", "EN", "dk", "de", undefined, null])("rejects unsupported locale %s", (locale) => {
    expect(isLocale(locale)).toBe(false);
  });
});

describe("parseLocaleCookie", () => {
  it("reads a valid locale among other cookies", () => {
    expect(parseLocaleCookie("session=abc; pcj_locale=da; theme=dark")).toBe("da");
  });

  it.each([null, "", "pcj_locale=", "pcj_locale=dk", "other=da"])("ignores invalid cookie input %s", (cookie) => {
    expect(parseLocaleCookie(cookie)).toBeNull();
  });
});

describe("parseAcceptLanguage", () => {
  it.each([
    ["da", "da"],
    ["da-DK", "da"],
    ["en-US", "en"],
    ["DA-dk", "da"],
  ] as const)("maps %s to %s", (header, expected) => {
    expect(parseAcceptLanguage(header)).toBe(expected);
  });

  it("uses the highest quality supported language", () => {
    expect(parseAcceptLanguage("en;q=0.4, da-DK;q=0.9")).toBe("da");
  });

  it("preserves header order when qualities tie", () => {
    expect(parseAcceptLanguage("da;q=0.8, en;q=0.8")).toBe("da");
    expect(parseAcceptLanguage("en;q=0.8, da;q=0.8")).toBe("en");
  });

  it("skips unsupported languages before considering supported ones", () => {
    expect(parseAcceptLanguage("de-DE, fr;q=0.9, da;q=0.2")).toBe("da");
  });

  it("excludes q=0 languages", () => {
    expect(parseAcceptLanguage("da;q=0, en;q=0.5")).toBe("en");
    expect(parseAcceptLanguage("da;q=0")).toBeNull();
  });

  it.each(["da;q=wat, en;q=0.4", "da;q=1.1, en;q=0.4", "da;q=-1, en;q=0.4", "da;q=0.1234, en;q=0.4"])("ignores malformed quality values in %s", (header) => {
    expect(parseAcceptLanguage(header)).toBe("en");
  });

  it("treats a positive wildcard as the English default", () => {
    expect(parseAcceptLanguage("de;q=0.9, *;q=0.8")).toBe("en");
  });

  it.each([null, "", "de, fr", "garbage;q=0"])("returns null without an acceptable supported preference for %s", (header) => {
    expect(parseAcceptLanguage(header)).toBeNull();
  });
});

describe("resolveLocale", () => {
  it("gives a valid cookie precedence over Accept-Language", () => {
    const request = new Request("https://example.com", {
      headers: { Cookie: "pcj_locale=en", "Accept-Language": "da" },
    });

    expect(resolveLocale(request)).toBe("en");
  });

  it("ignores an invalid cookie and uses Accept-Language", () => {
    const request = new Request("https://example.com", {
      headers: { Cookie: "pcj_locale=dk", "Accept-Language": "da-DK" },
    });

    expect(resolveLocale(request)).toBe("da");
  });

  it("falls back to English", () => {
    expect(resolveLocale(new Request("https://example.com"))).toBe(DEFAULT_LOCALE);
    expect(DEFAULT_LOCALE).toBe("en");
  });
});

describe("locale metadata and cookie output", () => {
  it("formats short contribution months in the selected locale", () => {
    const formatter = Reflect.get(localeModule, "formatShortMonth");

    expect(formatter).toBeTypeOf("function");
    expect(formatter(new Date("2026-01-15T12:00:00Z"), "en")).toBe("Jan");
    expect(formatter(new Date("2026-01-15T12:00:00Z"), "da")).toBe("jan.");
  });

  it("provides locale-aware HTML, Open Graph, and structured-data values", () => {
    expect(localeMetadata.en).toEqual({ htmlLang: "en", openGraphLocale: "en_US", inLanguage: "en-US" });
    expect(localeMetadata.da).toEqual({ htmlLang: "da", openGraphLocale: "da_DK", inLanguage: "da-DK" });
  });

  it("serializes the exact one-year secure locale cookie", () => {
    expect(serializeLocaleCookie("da")).toBe("pcj_locale=da; Path=/; Max-Age=31536000; SameSite=Lax; Secure");
  });
});
