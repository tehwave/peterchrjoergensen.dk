import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Blog collection schema
 *
 * Defines the structure and validation rules for blog posts.
 * Uses Astro's Content Layer API with the glob loader for automatic file discovery.
 *
 * @see https://docs.astro.build/en/guides/content-collections/
 */
const blog = defineCollection({
	// Load all markdown and MDX files from src/content/blog/
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),

	// Schema validation using Zod
	// Provides type safety and runtime validation for all blog posts
	schema: ({ image }) =>
		z.object({
			// Required fields
			title: z.string(),
			description: z.string(), // Used for meta description and post previews
			pubDate: z.coerce.date(), // Automatically coerced from string to Date object

			// Optional fields
			updatedDate: z.coerce.date().optional(), // Show "Updated" date if post is revised
			author: z.string().default("Peter Chr. Jørgensen"),
			tags: z.array(z.string()).optional(), // For categorization and filtering
			draft: z.boolean().default(false), // Draft posts are filtered out in production

			// Image handling with Astro's built-in optimization
			heroImage: image().optional(), // Optimized automatically (WebP, AVIF, responsive)
			heroImageAlt: z.string().optional(), // Alt text for accessibility
		}),
});

/**
 * Export all content collections
 *
 * Each collection must be exported here to be recognized by Astro.
 * Add new collections (e.g., "projects", "notes") as needed.
 */
export const collections = { blog };
