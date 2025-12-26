/**
 * Calculate estimated reading time for text content
 *
 * Uses industry-standard 200 words per minute as the default reading speed.
 * Always returns a minimum of 1 minute to avoid showing "0 min read".
 *
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes (minimum 1)
 */
export function getReadingTime(
	text: string,
	wordsPerMinute: number = 200,
): number {
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Count words in text content
 *
 * Splits text by whitespace and filters out empty strings.
 * Useful for word count statistics in blog posts.
 *
 * @param text - The text content to analyze
 * @returns Total word count
 */
export function getWordCount(text: string): number {
	return text.split(/\s+/).filter(Boolean).length;
}
