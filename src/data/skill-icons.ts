import * as simpleIcons from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import { titleToSlug } from "simple-icons/sdk";

/**
 * Fallback aliases for labels that don't map cleanly via titleToSlug().
 * Keep this intentionally small and only add known formatting/misspelling issues.
 */
const skillSlugAliases = new Map<string, string>([
  ["chatgpt", "openaigym"],
  ["c#", "dotnet"],
  ["claude", "claude"],
  ["facebook pixel", "meta"],
  ["facebook pixel (meta)", "meta"],
  ["jwt", "jsonwebtokens"],
  ["maya", "autodeskmaya"],
  ["meta pixel", "meta"],
  ["scss", "sass"],
  ["vr", "oculus"],
]);

const customSkillIcons = new Map<string, SimpleIcon>([
  [
    "aws",
    {
      title: "AWS",
      slug: "aws",
      hex: "FF9900",
      source: "https://aws.amazon.com",
      path: "M7.25 18.5h9.5a4.25 4.25 0 0 0 .44-8.48A5.75 5.75 0 0 0 5.85 11.56 3.5 3.5 0 0 0 7.25 18.5Z",
      svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>AWS</title><path d="M7.25 18.5h9.5a4.25 4.25 0 0 0 .44-8.48A5.75 5.75 0 0 0 5.85 11.56 3.5 3.5 0 0 0 7.25 18.5Z"/></svg>',
    },
  ],
]);

function normalizeSkillLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function normalizeAliasKey(label: string): string {
  return label.trim().toLowerCase();
}

function slugToExportName(slug: string): string {
  if (slug.length === 0) {
    return "";
  }

  return `si${slug[0].toUpperCase()}${slug.slice(1)}`;
}

function getIconBySlug(slug: string): SimpleIcon | undefined {
  const exportName = slugToExportName(slug);
  if (!exportName) {
    return undefined;
  }

  return simpleIcons[exportName as keyof typeof simpleIcons] as SimpleIcon | undefined;
}

export function getSkillIcon(label: string): SimpleIcon | undefined {
  const aliasKey = normalizeAliasKey(label);
  const normalizedLabel = normalizeSkillLabel(label);

  const customIcon = customSkillIcons.get(aliasKey) ?? customSkillIcons.get(normalizedLabel);
  if (customIcon) {
    return customIcon;
  }

  const aliasSlug = skillSlugAliases.get(aliasKey) ?? skillSlugAliases.get(normalizedLabel);
  if (aliasSlug) {
    return getIconBySlug(aliasSlug);
  }

  return getIconBySlug(titleToSlug(label));
}
