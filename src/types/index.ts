import type { ImageMetadata } from "astro";

/**
 * Project category for filtering
 */
export type ProjectCategory = "web" | "games" | "creative";

/**
 * Represents a project displayed in the portfolio.
 */
export interface Project {
  /** The project title */
  title: string;
  /** A brief description of the project and my role */
  description: string;
  /** Accessible alt text for the project image */
  alt: string;
  /** Technology or skill tags associated with the project */
  tags?: string[];
  /** Optimized image metadata from Astro asset import */
  image?: ImageMetadata;
  /** External link to live project or demo */
  link?: string;
  /** Category for filtering projects */
  category: ProjectCategory;
}
