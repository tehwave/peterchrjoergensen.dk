export type ToastType = "success" | "xp" | "level" | "info";

export interface ToastOptions {
  type: ToastType;
  icon: string;
  title: string;
  text?: string;
  duration?: number;
}

const CONTAINER_ID = "toast-container";
const HIDE_ANIMATION_MS = 300;
const hideTimerMap = new WeakMap<HTMLElement, number>();
const removeTimerMap = new WeakMap<HTMLElement, number>();
const SVG_NS = "http://www.w3.org/2000/svg";

type ToastIconVariant = "check" | "spark" | "level" | "info" | "alert" | "achievement";

function resolveIconVariant(options: ToastOptions): ToastIconVariant {
  if (options.icon === "!") return "alert";
  if (options.icon === "A") return "achievement";
  if (options.type === "success") return "check";
  if (options.type === "xp") return "spark";
  if (options.type === "level") return "level";
  return "info";
}

function createSvgIcon(variant: ToastIconVariant): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.75");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");

  const path = (d: string): void => {
    const el = document.createElementNS(SVG_NS, "path");
    el.setAttribute("d", d);
    svg.appendChild(el);
  };

  const circle = (cx: string, cy: string, r: string): void => {
    const el = document.createElementNS(SVG_NS, "circle");
    el.setAttribute("cx", cx);
    el.setAttribute("cy", cy);
    el.setAttribute("r", r);
    svg.appendChild(el);
  };

  switch (variant) {
    case "check":
      circle("12", "12", "9");
      path("m8.5 12.5 2.3 2.3 4.8-5.1");
      break;
    case "spark":
      path("M12 3v4");
      path("M12 17v4");
      path("m4.9 6.1 2.8 2.8");
      path("m16.3 17.5 2.8 2.8");
      path("M3 12h4");
      path("M17 12h4");
      path("m4.9 17.9 2.8-2.8");
      path("m16.3 8.5 2.8-2.8");
      circle("12", "12", "3.5");
      break;
    case "level":
      path("M12 20V8");
      path("m7.5 12.5 4.5-4.5 4.5 4.5");
      path("M5 21h14");
      break;
    case "alert":
      path("M12 3 2.8 19.5h18.4L12 3Z");
      path("M12 9v5");
      circle("12", "17", "0.9");
      break;
    case "achievement":
      path("m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.3 6.7 19l1-5.8-4.2-4.1 5.9-.9L12 3Z");
      break;
    case "info":
    default:
      circle("12", "12", "9");
      path("M12 10v6");
      circle("12", "7", "0.9");
      break;
  }

  return svg;
}

function applyAstroScope(container: HTMLElement, root: HTMLElement): void {
  const astroScopeAttributeName = container.getAttributeNames().find((name) => name.startsWith("data-astro-cid-"));
  if (!astroScopeAttributeName) return;

  root.setAttribute(astroScopeAttributeName, "");
  root.querySelectorAll("*").forEach((node) => {
    node.setAttribute(astroScopeAttributeName, "");
  });
}

function createToastElement(options: ToastOptions): HTMLElement {
  const toast = document.createElement("div");
  toast.className = `toast toast--${options.type}`;

  const icon = document.createElement("span");
  icon.className = "toast__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.appendChild(createSvgIcon(resolveIconVariant(options)));

  const body = document.createElement("div");
  body.className = "toast__body";

  const title = document.createElement("p");
  title.className = "toast__title";
  title.textContent = options.title;
  body.appendChild(title);

  if (options.text) {
    const text = document.createElement("p");
    text.className = "toast__text";
    text.textContent = options.text;
    body.appendChild(text);
  }

  toast.append(icon, body);
  return toast;
}

function getContainer(): HTMLElement | null {
  const container = document.getElementById(CONTAINER_ID);
  if (!(container instanceof HTMLElement)) return null;
  return container;
}

export function showToast(options: ToastOptions): void {
  const container = getContainer();
  if (!container) return;

  const toast = createToastElement(options);
  applyAstroScope(container, toast);
  container.appendChild(toast);

  const duration = Math.max(600, options.duration ?? 3500);

  const hideTimer = window.setTimeout(() => {
    toast.classList.add("toast--hiding");

    const removeTimer = window.setTimeout(() => {
      toast.remove();
      hideTimerMap.delete(toast);
      removeTimerMap.delete(toast);
    }, HIDE_ANIMATION_MS);

    removeTimerMap.set(toast, removeTimer);
  }, duration);

  hideTimerMap.set(toast, hideTimer);
}

export function clearToasts(): void {
  const container = getContainer();
  if (!container) return;

  const activeToasts = container.querySelectorAll<HTMLElement>(".toast");
  activeToasts.forEach((toast) => {
    const hideTimer = hideTimerMap.get(toast);
    if (hideTimer !== undefined) {
      window.clearTimeout(hideTimer);
      hideTimerMap.delete(toast);
    }

    const removeTimer = removeTimerMap.get(toast);
    if (removeTimer !== undefined) {
      window.clearTimeout(removeTimer);
      removeTimerMap.delete(toast);
    }

    toast.remove();
  });
}
