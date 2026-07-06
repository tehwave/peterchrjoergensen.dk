import { fileURLToPath } from "node:url";
import type { AstroConfig, AstroIntegration } from "astro";
import type { Plugin } from "vite";
import { VitePWA, type VitePluginPWAAPI, type VitePWAOptions } from "vite-plugin-pwa";
import type { ManifestEntry, ManifestTransform } from "workbox-build";

type PwaOptions = Partial<VitePWAOptions> & {
  experimental?: {
    directoryAndTrailingSlashHandler?: boolean;
  };
};

type SizedManifestEntry = ManifestEntry & { size: number };

type PwaContext = {
  api?: VitePluginPWAAPI;
  doBuild: boolean;
  previewOrSync: boolean;
  scope: string;
  trailingSlash: AstroConfig["trailingSlash"];
  useDirectoryFormat: boolean;
};

type VitePwaPlugin = Plugin & {
  api?: VitePluginPWAAPI;
};

function isNamedPlugin(plugin: unknown): plugin is Plugin {
  return typeof plugin === "object" && plugin !== null && "name" in plugin && typeof (plugin as Plugin).name === "string";
}

function flattenPlugins(plugins: unknown): Plugin[] {
  const flattened: Plugin[] = [];
  const queue = Array.isArray(plugins) ? [...plugins] : [plugins];

  for (const plugin of queue) {
    if (Array.isArray(plugin)) {
      queue.push(...plugin);
    } else if (isNamedPlugin(plugin)) {
      flattened.push(plugin);
    }
  }

  return flattened;
}

function findPwaApi(plugins: readonly Plugin[]): VitePluginPWAAPI | undefined {
  return flattenPlugins(plugins).find((plugin): plugin is VitePwaPlugin => plugin.name === "vite-plugin-pwa" && "api" in plugin)?.api;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createManifestTransform(getContext: () => PwaContext): ManifestTransform {
  return async (entries) => {
    const { doBuild, trailingSlash, scope, useDirectoryFormat } = getContext();

    if (!doBuild) {
      return { manifest: entries, warnings: [] };
    }

    for (const entry of entries) {
      if (!entry?.url.endsWith(".html")) continue;

      const url = entry.url.startsWith("/") ? entry.url.slice(1) : entry.url;

      if (url === "index.html") {
        entry.url = scope;
        continue;
      }

      const parts = url.split("/");
      parts[parts.length - 1] = parts[parts.length - 1].replace(/\.html$/, "");
      entry.url = useDirectoryFormat ? (parts.length > 1 ? parts.slice(0, -1).join("/") : parts[0]) : parts.join("/");

      if (trailingSlash === "always") {
        entry.url += "/";
      }
    }

    return { manifest: entries, warnings: [] };
  };
}

function createExperimentalManifestTransform(getContext: () => PwaContext): ManifestTransform {
  return async (entries) => {
    const { doBuild, trailingSlash, scope, useDirectoryFormat } = getContext();

    if (!doBuild) {
      return { manifest: entries, warnings: [] };
    }

    const additionalEntries: SizedManifestEntry[] = [];

    for (const entry of entries) {
      if (!entry?.url.endsWith(".html")) continue;

      const url = entry.url.startsWith("/") ? entry.url.slice(1) : entry.url;

      if (url === "index.html") {
        additionalEntries.push({
          revision: entry.revision,
          url: scope,
          size: entry.size,
        });
      } else if (url === "404.html") {
        entry.url = `404${trailingSlash === "always" ? "/" : ""}`;
      } else {
        const parts = url.split("/");
        parts[parts.length - 1] = parts[parts.length - 1].replace(/\.html$/, "");
        let newUrl = useDirectoryFormat ? (parts.length > 1 ? parts.slice(0, -1).join("/") : parts[0]) : parts.join("/");

        if (trailingSlash === "always") {
          newUrl += "/";
        }

        additionalEntries.push({
          revision: entry.revision,
          url: newUrl,
          size: entry.size,
        });
      }
    }

    entries.push(...additionalEntries);

    return { manifest: entries, warnings: [] };
  };
}

function getViteConfiguration(config: AstroConfig, options: PwaOptions, getContext: () => PwaContext): Plugin[] {
  const existingPwaPlugin = flattenPlugins(config.vite?.plugins).find((plugin) => plugin.name === "vite-plugin-pwa");

  if (existingPwaPlugin) {
    throw new Error("Configure vite-plugin-pwa through the local Astro PWA integration, not config.vite.plugins.");
  }

  const pwaOptions: PwaOptions = {
    ...options,
    includeManifestIcons: false,
  };

  const serverOutput = config.output === "server";
  const outDir = serverOutput ? fileURLToPath(config.build.client) : undefined;

  if (outDir) {
    pwaOptions.outDir = outDir;
  }

  if (pwaOptions.pwaAssets && typeof pwaOptions.pwaAssets === "object") {
    pwaOptions.pwaAssets.integration = {
      baseUrl: config.base ?? config.vite.base ?? "/",
      publicDir: fileURLToPath(config.publicDir),
      outDir: outDir ?? fileURLToPath(config.outDir),
    };
  }

  const { experimental, strategies = "generateSW", registerType = "prompt", injectRegister, workbox = {}, injectManifest = {}, ...rest } = pwaOptions;

  const manifestTransform = experimental?.directoryAndTrailingSlashHandler === true ? createExperimentalManifestTransform(getContext) : createManifestTransform(getContext);

  let assets = config.build.assets ?? "_astro/";
  if (assets.startsWith("/")) {
    assets = assets.slice(1);
  }
  if (!assets.endsWith("/")) {
    assets += "/";
  }

  if (strategies === "generateSW") {
    const nextWorkbox = { ...workbox };

    if (outDir) {
      nextWorkbox.globDirectory = outDir;
    }
    nextWorkbox.navigateFallback ??= config.base ?? config.vite.base ?? "/";
    if (config.build.format === "directory") {
      nextWorkbox.directoryIndex = "index.html";
    }
    nextWorkbox.dontCacheBustURLsMatching ??= new RegExp(escapeRegExp(assets));
    nextWorkbox.manifestTransforms ??= [];
    nextWorkbox.manifestTransforms.push(manifestTransform);

    return VitePWA({
      ...rest,
      strategies,
      registerType,
      injectRegister,
      workbox: nextWorkbox,
    });
  }

  const nextInjectManifest = { ...injectManifest };
  if (outDir) {
    nextInjectManifest.globDirectory = outDir;
  }
  nextInjectManifest.dontCacheBustURLsMatching ??= new RegExp(escapeRegExp(assets));
  nextInjectManifest.manifestTransforms ??= [];
  nextInjectManifest.manifestTransforms.push(manifestTransform);

  return VitePWA({
    ...rest,
    strategies,
    registerType,
    injectRegister,
    injectManifest: nextInjectManifest,
  });
}

export default function pwa(options: PwaOptions = {}): AstroIntegration {
  const context: PwaContext = {
    doBuild: false,
    previewOrSync: false,
    scope: "/",
    trailingSlash: "ignore",
    useDirectoryFormat: true,
  };

  const getContext = () => context;

  return {
    name: "local-vite-pwa",
    hooks: {
      "astro:config:setup": ({ command, config, updateConfig }) => {
        if (command === "preview" || command === "sync") {
          context.previewOrSync = true;
          return;
        }

        context.scope = config.base ?? config.vite.base ?? "/";
        context.trailingSlash = config.trailingSlash;
        context.useDirectoryFormat = config.build.format === "directory";

        const plugins = getViteConfiguration(config, options, getContext)
          .filter((plugin) => plugin.name !== "vite-plugin-pwa:build")
          .filter((plugin) => command !== "build" || plugin.name !== "vite-plugin-pwa:dev-sw");

        if (command === "build") {
          plugins.push({
            name: "local-vite-pwa:build",
            applyToEnvironment(environment) {
              return environment.name === "client";
            },
            configResolved(resolvedConfig) {
              if (!resolvedConfig.build.ssr) {
                context.api = findPwaApi(resolvedConfig.plugins);
              }
            },
            async generateBundle(_, bundle) {
              const api = context.api;
              if (!api) return;

              const pwaAssetsGenerator = await api.pwaAssetsGenerator();
              pwaAssetsGenerator?.injectManifestIcons();
              api.generateBundle(bundle, this);
            },
            closeBundle: {
              sequential: true,
              order: "post",
              async handler() {
                const pwaAssetsGenerator = await context.api?.pwaAssetsGenerator();
                await pwaAssetsGenerator?.generate();
              },
            },
          });
        }

        updateConfig({
          vite: {
            plugins,
          },
        });
      },
      "astro:build:done": async () => {
        if (context.previewOrSync) return;

        context.doBuild = true;

        if (context.api && !context.api.disabled) {
          await context.api.generateSW();
        }
      },
    },
  };
}
