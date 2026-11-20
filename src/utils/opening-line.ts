/**
 * Opening line of a post
 *
 * Blog cards for posts without a hero image show the post's first sentence in
 * the image's place. These helpers read it from the MDX body and render it as
 * safe inline HTML for `set:html`.
 */

/** Blocks that are not prose: MDX imports/exports, components, headings, lists, quotes, tables, images, code fences. */
const NON_PROSE_BLOCK = /^(import\s|export\s|<|\{|#|[-*+]\s|\d+\.\s|>|\||!\[|```|~~~)/;

/**
 * Return the first sentence of the first prose paragraph in an MDX body.
 *
 * Inline code is kept whole, so a full stop inside backticks never ends the
 * sentence. A paragraph with no sentence ending is returned whole.
 *
 * @param body - The raw MDX body of a content entry (without frontmatter)
 * @returns The sentence as Markdown, or undefined when the body has no paragraph
 */
export function getOpeningLine(body: string): string | undefined {
  let inFence = false;
  const paragraphs: string[] = [];
  let current: string[] = [];

  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence;
      current = [];
      continue;
    }
    if (inFence) continue;
    if (trimmed === "") {
      if (current.length) paragraphs.push(current.join(" "));
      current = [];
      continue;
    }
    current.push(trimmed);
  }
  if (current.length) paragraphs.push(current.join(" "));

  const paragraph = paragraphs.find((text) => !NON_PROSE_BLOCK.test(text));
  if (!paragraph) return undefined;

  let inCode = false;
  for (let index = 0; index < paragraph.length; index += 1) {
    const char = paragraph[index];
    if (char === "`") inCode = !inCode;
    if (!inCode && /[.!?]/.test(char) && (index === paragraph.length - 1 || /\s/.test(paragraph[index + 1]))) {
      return paragraph.slice(0, index + 1);
    }
  }
  return paragraph;
}

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Render an opening line as inline HTML: escaped text, `code` as <code>,
 * and only the text of links, bold and italics (the line sits inside a link).
 *
 * @param line - A sentence from {@link getOpeningLine}
 * @returns HTML safe for `set:html`
 */
export function renderOpeningLine(line: string): string {
  return escapeHtml(line)
    .split(/(`[^`]+`)/)
    .map((part) =>
      part.startsWith("`") && part.endsWith("`") && part.length > 1
        ? `<code>${part.slice(1, -1)}</code>`
        : part
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, "$1$2")
            .replace(/\*([^*]+)\*|\b_([^_]+)_\b/g, "$1$2"),
    )
    .join("");
}
