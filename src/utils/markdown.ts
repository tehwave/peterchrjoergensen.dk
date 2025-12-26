/**
 * Convert basic inline Markdown syntax to HTML
 *
 * This function provides minimal Markdown parsing for simple formatting
 * in frontmatter fields (e.g., image captions) without requiring external
 * dependencies. Runs at build time and outputs safe HTML for use with `set:html`.
 *
 * **Security:** Safe for trusted content (your own frontmatter). Do NOT use
 * with untrusted user input as it doesn't escape HTML entities.
 *
 * Supported syntax:
 * - Links: `[text](url)` → `<a href="url">text</a>`
 * - Bold: `**text**` or `__text__` → `<strong>text</strong>`
 * - Italic: `*text*` or `_text_` → `<em>text</em>`
 * - Inline code: `` `code` `` → `<code>code</code>`
 *
 * Limitations:
 * - Does not support nested formatting (e.g., bold inside italic)
 * - Does not escape HTML entities in the input
 * - Only processes inline elements, not block elements like headings or lists
 *
 * For complex Markdown rendering, consider using a dedicated library like
 * marked or markdown-it.
 *
 * @param text - The Markdown string to parse
 * @returns HTML string with Markdown syntax converted to HTML tags
 *
 * @example
 * ```ts
 * parseInlineMarkdown('Photo by [John Doe](https://example.com)')
 * // Returns: 'Photo by <a href="https://example.com">John Doe</a>'
 * ```
 */
export function parseInlineMarkdown(text: string): string {
  return (
    text
      // Links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Bold: **text** or __text__
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      // Italic: *text* or _text_
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/_([^_]+)_/g, "<em>$1</em>")
      // Inline code: `code`
      .replace(/`([^`]+)`/g, "<code>$1</code>")
  );
}
