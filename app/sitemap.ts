import type { MetadataRoute } from "next";

import { projects } from "@/lib/data";
import { siteUrl } from "@/lib/site";

/**
 * Fixed date — bump this when you publish new content.
 * Using new Date() made every crawl report every URL as freshly modified.
 */
const LAST_MODIFIED = new Date("2025-11-08");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
