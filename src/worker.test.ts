import { describe, expect, it } from "vitest";
import worker, { contentLanguageForPath, mapPublicContentPath } from "./worker";

type RecordedAsset = { request: Request };
type WorkerRequest = Parameters<NonNullable<ExportedHandler<Env>["fetch"]>>[0];

function fetchWorker(request: Request, env: Env): Promise<Response> {
  return worker.fetch(request as WorkerRequest, env);
}

function assetEnvironment(responseForPath?: (pathname: string) => Response) {
  const recorded: RecordedAsset[] = [];
  const env = {
    ASSETS: {
      async fetch(request: Request): Promise<Response> {
        recorded.push({ request });
        if (request.body) await request.text();
        return responseForPath?.(new URL(request.url).pathname) ?? new Response("asset", { headers: { "Content-Type": "text/plain" } });
      },
    },
  } as Env;

  return { env, recorded };
}

describe("mapPublicContentPath", () => {
  it.each([
    ["/", "da", "/__i18n/da/"],
    ["/blog", "en", "/__i18n/en/blog/"],
    ["/blog/", "da", "/__i18n/da/blog/"],
    ["/blog/hello", "en", "/__i18n/en/blog/hello/"],
    ["/projects/hello/", "da", "/__i18n/da/projects/hello/"],
  ] as const)("maps %s to an internal %s asset", (path, locale, expected) => {
    expect(mapPublicContentPath(path, locale)).toBe(expected);
  });

  it.each(["/_astro/app.js", "/images/photo.jpg", "/tracker/", "/experiments/groovy-waves/", "/sitemap-index.xml", "/blog/one/two/"])("does not intercept %s", (path) => {
    expect(mapPublicContentPath(path, "en")).toBeNull();
  });
});

describe("contentLanguageForPath", () => {
  it("marks known Danish content as Danish and a future English-only fallback as English", () => {
    expect(contentLanguageForPath("/blog/welcome/", "da")).toBe("da");
    expect(contentLanguageForPath("/blog/future-english-only/", "da")).toBe("en");
    expect(contentLanguageForPath("/blog/welcome/", "en")).toBe("en");
  });
});

describe("worker", () => {
  it.each(["/blog", "/blog/welcome", "/projects/browser-multiplayer"])("redirects %s to its canonical trailing-slash URL", async (pathname) => {
    const { env, recorded } = assetEnvironment();
    const response = await fetchWorker(new Request(`https://example.com${pathname}?ref=test`), env);

    expect(response.status).toBe(308);
    expect(response.headers.get("Location")).toBe(`https://example.com${pathname}/?ref=test`);
    expect(recorded).toHaveLength(0);
  });

  it.each([
    ["/blog//", "/blog/"],
    ["/blog/welcome//", "/blog/welcome/"],
    ["/projects/browser-multiplayer//", "/projects/browser-multiplayer/"],
    ["/blog/%77elcome/", "/blog/welcome/"],
  ])("redirects noncanonical content path %s to %s", async (pathname, canonicalPathname) => {
    const { env, recorded } = assetEnvironment();
    const response = await fetchWorker(new Request(`https://example.com${pathname}?ref=test`), env);

    expect(response.status).toBe(308);
    expect(response.headers.get("Location")).toBe(`https://example.com${canonicalPathname}?ref=test`);
    expect(recorded).toHaveLength(0);
  });

  it("redirects the production www host to HTTPS on the apex domain", async () => {
    const { env, recorded } = assetEnvironment();
    const response = await fetchWorker(new Request("http://www.peterchrjoergensen.dk/blog/?ref=test"), env);

    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe("https://peterchrjoergensen.dk/blog/?ref=test");
    expect(recorded).toHaveLength(0);
  });

  it("negotiates Danish and preserves the public query on the internal asset fetch", async () => {
    const { env, recorded } = assetEnvironment(() => new Response("<html>da</html>", { headers: { "Content-Type": "text/html" } }));
    const request = new Request("https://example.com/blog/welcome/?ref=test", { headers: { "Accept-Language": "da-DK, en;q=0.5" } });

    const response = await fetchWorker(request, env);

    expect(recorded).toHaveLength(1);
    expect(recorded[0]!.request.url).toBe("https://example.com/__i18n/da/blog/welcome/?ref=test");
    expect(response.headers.get("Content-Language")).toBe("da");
    expect(response.headers.get("Vary")).toBe("Accept-Language, Cookie");
    expect(response.headers.get("Cache-Control")).toBe("private, no-cache");
  });

  it("defaults to English and lets a valid cookie override Danish negotiation", async () => {
    const first = assetEnvironment(() => new Response("<html>en</html>", { headers: { "Content-Type": "text/html" } }));
    await fetchWorker(new Request("https://example.com/"), first.env);
    expect(new URL(first.recorded[0]!.request.url).pathname).toBe("/__i18n/en/");

    const second = assetEnvironment(() => new Response("<html>en</html>", { headers: { "Content-Type": "text/html" } }));
    await fetchWorker(new Request("https://example.com/", { headers: { Cookie: "pcj_locale=en", "Accept-Language": "da" } }), second.env);
    expect(new URL(second.recorded[0]!.request.url).pathname).toBe("/__i18n/en/");
  });

  it("supports HEAD requests without changing the method", async () => {
    const { env, recorded } = assetEnvironment(() => new Response(null, { headers: { "Content-Type": "text/html" } }));
    await fetchWorker(new Request("https://example.com/blog/", { method: "HEAD" }), env);
    expect(recorded[0]!.request.method).toBe("HEAD");
  });

  it.each(["POST", "OPTIONS", "DELETE"])("rejects %s requests to localized content without serving article HTML", async (method) => {
    const { env, recorded } = assetEnvironment();
    const response = await fetchWorker(new Request("https://example.com/blog/welcome/", { method }), env);

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET, HEAD");
    expect(recorded).toHaveLength(0);
  });

  it("blocks direct internal paths with a localized 404 asset", async () => {
    const { env, recorded } = assetEnvironment(() => new Response("not found", { status: 200, headers: { "Content-Type": "text/html" } }));
    const response = await fetchWorker(new Request("https://example.com/__i18n/en/blog/secret/", { headers: { "Accept-Language": "da" } }), env);

    expect(new URL(recorded[0]!.request.url).pathname).toBe("/__i18n/da/404/");
    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Language")).toBe("da");
  });

  it("serves a localized 404 when a mapped content asset is missing", async () => {
    const { env, recorded } = assetEnvironment((pathname) =>
      pathname.endsWith("/missing/") ? new Response("missing", { status: 404 }) : new Response("localized 404", { headers: { "Content-Type": "text/html" } }),
    );
    const response = await fetchWorker(new Request("https://example.com/blog/missing/", { headers: { "Accept-Language": "da" } }), env);

    expect(recorded.map(({ request }) => new URL(request.url).pathname)).toEqual(["/__i18n/da/blog/missing/", "/__i18n/da/404/"]);
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("localized 404");
  });

  it.each(["POST", "OPTIONS"])("serves a fresh localized 404 after a missing %s asset request", async (method) => {
    const { env, recorded } = assetEnvironment((pathname) =>
      pathname === "/missing" ? new Response("missing", { status: 404 }) : new Response("localized 404", { headers: { "Content-Type": "text/html" } }),
    );
    const request = new Request("https://example.com/missing", {
      method,
      body: method === "POST" ? "submitted=data" : undefined,
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept-Language": "da" },
    });

    const response = await fetchWorker(request, env);

    expect(recorded.map(({ request: assetRequest }) => [new URL(assetRequest.url).pathname, assetRequest.method])).toEqual([
      ["/missing", method],
      ["/__i18n/da/404/", "GET"],
    ]);
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("localized 404");
  });

  it("passes non-content assets through unchanged", async () => {
    const original = new Response("image", { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" } });
    const { env, recorded } = assetEnvironment(() => original);
    const response = await fetchWorker(new Request("https://example.com/images/photo.png"), env);

    expect(new URL(recorded[0]!.request.url).pathname).toBe("/images/photo.png");
    expect(response).toBe(original);
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");
  });
});
