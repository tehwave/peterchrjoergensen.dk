export const LOCALES = ["en", "da"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const localeMetadata: Record<Locale, { htmlLang: Locale; openGraphLocale: "en_US" | "da_DK"; inLanguage: "en-US" | "da-DK" }> = {
  en: { htmlLang: "en", openGraphLocale: "en_US", inLanguage: "en-US" },
  da: { htmlLang: "da", openGraphLocale: "da_DK", inLanguage: "da-DK" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && LOCALES.some((locale) => locale === value);
}

export function parseLocaleCookie(cookieHeader: string | null): Locale | null {
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");
    if (separator === -1) continue;

    const name = cookie.slice(0, separator).trim();
    const value = cookie.slice(separator + 1).trim();
    if (name === "pcj_locale" && isLocale(value)) return value;
  }

  return null;
}

type LanguagePreference = {
  locale: Locale | "*";
  quality: number;
  position: number;
};

function parseQuality(parameters: string[]): number | null {
  if (parameters.length === 0) return 1;

  const qualityParameter = parameters.find((parameter) => /^q\s*=/i.test(parameter));
  if (!qualityParameter) return 1;

  const value = qualityParameter.slice(qualityParameter.indexOf("=") + 1).trim();
  if (!/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(value)) return null;

  return Number(value);
}

function matchSupportedLocale(languageRange: string): Locale | "*" | null {
  if (languageRange === "*") return "*";
  if (!/^[a-z]{1,8}(?:-[a-z0-9]{1,8})*$/i.test(languageRange)) return null;

  const primaryLanguage = languageRange.split("-", 1)[0]?.toLowerCase();
  return isLocale(primaryLanguage) ? primaryLanguage : null;
}

export function parseAcceptLanguage(header: string | null): Locale | null {
  if (!header?.trim()) return null;

  const preferences: LanguagePreference[] = [];
  const explicitlyRejected = new Set<Locale>();

  header.split(",").forEach((rawRange, position) => {
    const [languageRange = "", ...parameters] = rawRange.split(";").map((part) => part.trim());
    const locale = matchSupportedLocale(languageRange);
    const quality = parseQuality(parameters);
    if (!locale || quality === null) return;

    if (locale !== "*" && quality === 0) explicitlyRejected.add(locale);
    if (quality > 0) preferences.push({ locale, quality, position });
  });

  preferences.sort((left, right) => right.quality - left.quality || left.position - right.position);

  for (const preference of preferences) {
    if (preference.locale !== "*") return preference.locale;

    const wildcardLocale = LOCALES.find((locale) => !explicitlyRejected.has(locale));
    if (wildcardLocale) return wildcardLocale;
  }

  return null;
}

export function resolveLocale(request: Request): Locale {
  return parseLocaleCookie(request.headers.get("Cookie")) ?? parseAcceptLanguage(request.headers.get("Accept-Language")) ?? DEFAULT_LOCALE;
}

export function serializeLocaleCookie(locale: Locale, options: { secure?: boolean } = {}): string {
  const secure = options.secure ?? true;
  return `pcj_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export function formatShortMonth(date: Date, locale: Locale): string {
  return date.toLocaleString(localeMetadata[locale].inLanguage, { month: "short", timeZone: "UTC" });
}
