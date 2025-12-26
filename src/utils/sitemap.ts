import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { SitemapItem } from "@astrojs/sitemap";

// Re-export the enum type for use in other files
export type { ChangeFreqEnum } from "@astrojs/sitemap";

/**
 * Extract publication date from a blog post's frontmatter
 *
 * Reads the MDX file directly and parses the YAML frontmatter to extract
 * the pubDate or updatedDate. This is used in the sitemap configuration
 * where Astro's virtual modules are not available.
 *
 * @param slug - The blog post slug (filename without extension)
 * @returns The publication date, or null if not found
 */
export async function lastModifiedBlogPost(slug: string): Promise<Date | null> {
  try {
    const filePath = join(process.cwd(), "src/content/blog", `${slug}.mdx`);
    const content = await readFile(filePath, "utf-8");

    // Extract pubDate and updatedDate from frontmatter using regex
    // Prefer updatedDate if available, otherwise use pubDate
    const updatedDateMatch = content.match(/^updatedDate:\s*(\d{4}-\d{2}-\d{2})/m);
    const pubDateMatch = content.match(/^pubDate:\s*(\d{4}-\d{2}-\d{2})/m);

    if (updatedDateMatch) {
      return new Date(updatedDateMatch[1]);
    } else if (pubDateMatch) {
      return new Date(pubDateMatch[1]);
    }
  } catch (error) {
    console.warn(`Could not read blog post: ${slug}`, error);
  }

  return null;
}

/**
 * Sitemap serializer function
 *
 * Customizes sitemap entries with frontmatter data and SEO metadata.
 * Adds lastmod, changefreq, and priority based on page type.
 *
 * @param item - The sitemap item to customize
 * @param changeFreqEnum - Enum for valid changefreq values
 * @returns The customized sitemap item
 */
export async function serializeSitemap(
  item: SitemapItem,
  changeFreqEnum: any,
): Promise<SitemapItem> {
  // Extract slug from URL (remove domain and trailing slash)
  const urlPath = item.url.replace("https://peterchrjoergensen.dk/", "");

  // Check if this is a blog post URL
  if (urlPath.startsWith("blog/") && urlPath !== "blog/") {
    // Extract the slug (e.g., "blog/welcome/" -> "welcome")
    const slug = urlPath.replace("blog/", "").replace(/\/$/, "");

    const lastModified = await lastModifiedBlogPost(slug);

    if (lastModified) {
      // Blog posts are high priority and change occasionally
      item.lastmod = lastModified.toISOString();
      item.changefreq = changeFreqEnum.MONTHLY;
      item.priority = 0.8;
    }
  } else if (urlPath === "") {
    // Homepage - high priority, changes occasionally
    item.changefreq = changeFreqEnum.MONTHLY;
    item.priority = 1.0;
  } else if (urlPath === "blog/") {
    // Blog index - high priority, changes when new posts are added
    item.changefreq = changeFreqEnum.WEEKLY;
    item.priority = 0.9;
  }

  return item;
}
