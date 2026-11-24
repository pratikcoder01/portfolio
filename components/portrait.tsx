import Image from "next/image";

import { profile } from "@/lib/data";

/**
 * PortraitPlate — clean, human developer portrait.
 * Displayed cleanly with a subtle rounded frame, high-craft typography, and no gimmicky scan bands.
 */
export function PortraitPlate({ className = "" }: { className?: string }) {
  return (
    <figure className={`portrait-plate flex items-center gap-4 lg:block lg:gap-0 ${className}`}>
      <div className="portrait-frame relative w-20 shrink-0 overflow-hidden rounded-sm border border-[var(--line-strong)] bg-ink-card shadow-sm sm:w-24 lg:w-full">
        <Image
          src="/portrait.png"
          alt={`Portrait of ${profile.name}`}
          width={400}
          height={400}
          priority
          sizes="(min-width: 1024px) 240px, 96px"
          className="block h-auto w-full object-cover"
        />
      </div>

      <figcaption className="min-w-0 lg:mt-3">
        <p className="font-sans text-[0.95rem] font-semibold leading-tight text-paper">{profile.name}</p>
        <p className="mt-1 font-mono text-[0.74rem] leading-snug text-paper-muted">{profile.title}</p>
        <p className="mt-2 hidden items-center gap-2 font-mono text-[0.68rem] uppercase tracking-wider text-paper-faint lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-volt" aria-hidden="true" />
          {profile.location}
        </p>
      </figcaption>
    </figure>
  );
}
