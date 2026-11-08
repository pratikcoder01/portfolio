/**
 * Canonical site URL and draft-visibility flag.
 *
 * URL resolution order:
 *   1. NEXT_PUBLIC_SITE_URL (explicit override — always set this in production)
 *   2. https://${VERCEL_PROJECT_PRODUCTION_URL} (Vercel auto-sets this)
 *   3. http://localhost:3000 (local fallback)
 *
 * No trailing slash.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return `https://${vercelProd}`;

  return "http://localhost:3000";
}

export const siteUrl: string = resolveSiteUrl();

/**
 * When false (production), author-facing draft content is suppressed:
 *   - todo sections in case studies
 *   - "To be completed" badges
 *   - "Still to add" boxes
 *   - "awaiting your input" text in project cards
 *
 * Override in a preview deploy with NEXT_PUBLIC_SHOW_DRAFTS=true.
 */
export const showDrafts: boolean =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_SHOW_DRAFTS === "true";

/**
 * True when public/resume.pdf was detected at build time (configured in next.config.ts).
 * When false, the resume download link is hidden to avoid a broken link.
 * NEEDS INPUT: add your resume as public/resume.pdf.
 */
export const resumeExists: boolean = process.env.NEXT_PUBLIC_HAS_RESUME === "true";
