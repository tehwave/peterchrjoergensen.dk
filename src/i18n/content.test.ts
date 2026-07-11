import { describe, expect, it } from "vitest";
import { groupTranslations, selectTranslation } from "./content";

type Entry = {
  id: string;
  data: {
    locale: "en" | "da";
    translationKey: string;
  };
};

const entry = (id: string, locale: "en" | "da", translationKey = "hello"): Entry => ({
  id,
  data: { locale, translationKey },
});

describe("groupTranslations", () => {
  it("groups one English source with an optional Danish counterpart", () => {
    const groups = groupTranslations([entry("hello.en", "en"), entry("hello.da", "da")]);

    expect(groups.get("hello")).toEqual({
      translationKey: "hello",
      en: expect.objectContaining({ id: "hello.en" }),
      da: expect.objectContaining({ id: "hello.da" }),
    });
  });

  it("keeps a valid group when Danish is missing", () => {
    const groups = groupTranslations([entry("hello.en", "en")]);

    expect(groups.get("hello")?.da).toBeUndefined();
  });

  it("rejects duplicate locale entries for a translation key", () => {
    expect(() => groupTranslations([entry("one.en", "en"), entry("two.en", "en")])).toThrow(/duplicate en.*hello/i);
  });

  it("rejects groups without exactly one English source", () => {
    expect(() => groupTranslations([entry("hello.da", "da")])).toThrow(/English source.*hello/i);
  });
});

describe("selectTranslation", () => {
  it("selects the requested translation when available", () => {
    const group = groupTranslations([entry("hello.en", "en"), entry("hello.da", "da")]).get("hello")!;

    expect(selectTranslation(group, "da")).toEqual({ entry: expect.objectContaining({ id: "hello.da" }), contentLocale: "da", isFallback: false });
  });

  it("falls back to English content for a missing Danish translation", () => {
    const group = groupTranslations([entry("hello.en", "en")]).get("hello")!;

    expect(selectTranslation(group, "da")).toEqual({ entry: expect.objectContaining({ id: "hello.en" }), contentLocale: "en", isFallback: true });
  });
});
