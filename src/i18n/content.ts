import type { Locale } from "./locale";

export type LocalizedEntry = {
  data: {
    locale: Locale;
    translationKey: string;
  };
};

export type TranslationGroup<T extends LocalizedEntry> = {
  translationKey: string;
  en: T;
  da?: T;
};

export function groupTranslations<T extends LocalizedEntry>(entries: T[]): Map<string, TranslationGroup<T>> {
  const partialGroups = new Map<string, { translationKey: string; en?: T; da?: T }>();

  for (const entry of entries) {
    const { locale, translationKey } = entry.data;
    const group = partialGroups.get(translationKey) ?? { translationKey };
    if (group[locale]) throw new Error(`Duplicate ${locale} entry for translation key "${translationKey}"`);

    group[locale] = entry;
    partialGroups.set(translationKey, group);
  }

  const groups = new Map<string, TranslationGroup<T>>();
  for (const [translationKey, group] of partialGroups) {
    if (!group.en) throw new Error(`English source is required for translation key "${translationKey}"`);
    groups.set(translationKey, { translationKey, en: group.en, ...(group.da ? { da: group.da } : {}) });
  }

  return groups;
}

export function selectTranslation<T extends LocalizedEntry>(group: TranslationGroup<T>, locale: Locale): { entry: T; contentLocale: Locale; isFallback: boolean } {
  if (locale === "da" && group.da) return { entry: group.da, contentLocale: "da", isFallback: false };
  return { entry: group.en, contentLocale: "en", isFallback: locale !== "en" };
}
