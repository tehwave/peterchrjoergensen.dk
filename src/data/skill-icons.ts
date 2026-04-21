import { siAlpinedotjs, siBootstrap, siLaravel, siLivewire, siMysql, siPhp, siRedis, type SimpleIcon } from "simple-icons";

const skillIcons: Record<string, SimpleIcon> = {
  "alpine.js": siAlpinedotjs,
  alpinejs: siAlpinedotjs,
  bootstrap: siBootstrap,
  laravel: siLaravel,
  livewire: siLivewire,
  mysql: siMysql,
  php: siPhp,
  redis: siRedis,
};

export function getSkillIcon(label: string): SimpleIcon | undefined {
  return skillIcons[label.trim().toLowerCase()];
}
