import type { Locale } from "./i18n/locale";
import { resolveLocale } from "./i18n/locale";
import { DANISH_CONTENT_PATHS } from "./i18n/public-routes";

const INTERNAL_PREFIX = "/__i18n/";

function decodeUnreservedPathCharacters(pathname: string): string {
  return pathname.replace(/%[0-9a-f]{2}/gi, (encoded) => {
    const character = String.fromCharCode(Number.parseInt(encoded.slice(1), 16));
    return /^[a-z0-9._~-]$/i.test(character) ? character : encoded;
  });
}

export function canonicalContentPath(pathname: string): string {
  const decoded = decodeUnreservedPathCharacters(pathname);
  const collapsed = decoded.replace(/\/{2,}/g, "/");
  return collapsed === "/" ? collapsed : `${collapsed.replace(/\/+$/, "")}/`;
}

export function mapPublicContentPath(pathname: string, locale: Locale): string | null {
  const normalized = canonicalContentPath(pathname);
  if (normalized === "/") return `${INTERNAL_PREFIX}${locale}/`;
  if (normalized === "/blog/") return `${INTERNAL_PREFIX}${locale}/blog/`;
  if (/^\/blog\/[^/]+\/$/.test(normalized)) return `${INTERNAL_PREFIX}${locale}${normalized}`;
  if (/^\/projects\/[^/]+\/$/.test(normalized)) return `${INTERNAL_PREFIX}${locale}${normalized}`;
  return null;
}

export function contentLanguageForPath(pathname: string, requestedLocale: Locale): Locale {
  if (requestedLocale === "en") return "en";
  return DANISH_CONTENT_PATHS.has(canonicalContentPath(pathname)) ? "da" : "en";
}

function internalRequest(request: Request, pathname: string): Request {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, {
    method: request.method,
    headers: request.headers,
  });
}

function localizedNotFoundRequest(request: Request, pathname: string): Request {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, {
    method: request.method === "HEAD" ? "HEAD" : "GET",
    headers: request.headers,
  });
}

function canonicalPathRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const canonicalPathname = canonicalContentPath(url.pathname);
  if (url.pathname === canonicalPathname || !mapPublicContentPath(canonicalPathname, "en")) return null;

  url.pathname = canonicalPathname;
  return Response.redirect(url, 308);
}

function apexRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname !== "www.peterchrjoergensen.dk") return null;

  url.protocol = "https:";
  url.hostname = "peterchrjoergensen.dk";
  return Response.redirect(url, 301);
}

function withHtmlHeaders(response: Response, locale: Locale, status = response.status): Response {
  const headers = new Headers(response.headers);
  headers.set("Content-Language", locale);
  headers.set("Vary", "Accept-Language, Cookie");
  headers.set("Cache-Control", "private, no-cache");

  return new Response(response.body, {
    status,
    statusText: status === response.status ? response.statusText : "Not Found",
    headers,
  });
}

async function localizedNotFound(request: Request, env: Env, locale: Locale): Promise<Response> {
  const response = await env.ASSETS.fetch(localizedNotFoundRequest(request, `${INTERNAL_PREFIX}${locale}/404/`));
  return withHtmlHeaders(response, locale, 404);
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const locale = resolveLocale(request);

    const hostRedirect = apexRedirect(request);
    if (hostRedirect) return hostRedirect;

    const pathRedirect = canonicalPathRedirect(request);
    if (pathRedirect) return pathRedirect;

    if (url.pathname.startsWith(INTERNAL_PREFIX)) return localizedNotFound(request, env, locale);

    const internalPath = mapPublicContentPath(url.pathname, locale);
    if (internalPath) {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
      }
      const response = await env.ASSETS.fetch(internalRequest(request, internalPath));
      if (response.status === 404) return localizedNotFound(request, env, locale);
      return withHtmlHeaders(response, contentLanguageForPath(url.pathname, locale));
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status === 404) return localizedNotFound(request, env, locale);
    return response;
  },
} satisfies ExportedHandler<Env>;
