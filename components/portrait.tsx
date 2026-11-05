import Image from "next/image";

import { profile } from "@/lib/data";

/**
 * PortraitPlate — the one photograph on the site, presented as an instrument
 * plate rather than a stock headshot: reticle brackets at the corners, a slow
 * scan band crossing the frame, and a caption set in the same voice as the nav.
 *
 * Layout follows the hero: below `lg` the plate is a horizontal identity row
 * (photo left, name and title beside it) so the photograph never floats alone
 * above the headline; at `lg` it becomes the vertical plate in the second
 * column, caption underneath.
 *
 * The source is a 400x400 photo, so it is displayed at 80-96px on small
 * screens and 240px at most — never upscaled past roughly 1.2x, which is where
 * a portrait starts to look soft.
 */
export function PortraitPlate({ className = "" }: { className?: string }) {
  return (
    <figure className={`portrait-plate flex items-center gap-4 lg:block lg:gap-0 ${className}`}>
      <div className="portrait-frame relative w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--line-strong)] bg-ink-card sm:w-24 lg:w-full">
        <Image
          src="/portrait.png"
          alt={`Portrait of ${profile.name}`}
          width={400}
          height={400}
          priority
          sizes="(min-width: 1024px) 240px, 96px"
          className="block h-auto w-full"
        />
        {/* Vignette: the studio backdrop is light grey, so the frame darkens
            toward its own edges to sit inside the page instead of on it. */}
        <span aria-hidden="true" className="portrait-vignette" />
        <span aria-hidden="true" className="portrait-scan" />
        <span aria-hidden="true" className="portrait-ticks">
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>

      <figcaption className="min-w-0 lg:mt-3">
        <p className="font-sans text-[0.95rem] font-medium leading-tight text-paper">{profile.name}</p>
        <p className="mt-1 text-[0.78rem] leading-snug text-paper-muted">{profile.title}</p>
        <p className="mt-2 hidden items-center gap-2 text-[0.7rem] text-paper-faint lg:flex">
          <span className="h-px w-4 shrink-0 bg-[var(--line-strong)]" aria-hidden="true" />
          {profile.location}
        </p>
      </figcaption>
    </figure>
  );
}
