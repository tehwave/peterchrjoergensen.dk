import { siAlpinedotjs, siBootstrap, siLaravel, siLivewire, siMysql, siPhp, siRedis, type SimpleIcon } from "simple-icons";

const skillIcons = new Map<string, SimpleIcon>([
  ["alpinejs", siAlpinedotjs],
  ["bootstrap", siBootstrap],
  ["laravel", siLaravel],
  ["livewire", siLivewire],
  ["mysql", siMysql],
  ["php", siPhp],
  ["redis", siRedis],
]);

function normalizeSkillLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function getSkillIcon(label: string): SimpleIcon | undefined {
  return skillIcons.get(normalizeSkillLabel(label));
}
