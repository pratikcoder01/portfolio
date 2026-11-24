"use client";

import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

import { Reveal } from "@/components/reveal";
import { experience, type ExperienceEntry } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

function Entry({ item, isFirst }: { item: ExperienceEntry; isFirst: boolean }) {
  const [open, setOpen] = useState(isFirst);
  const panelId = `exp-panel-${item.id}`;
  const buttonId = `exp-button-${item.id}`;

  return (
    <li className="relative pl-6 sm:pl-10">
      <span
        className="absolute left-0 top-[1.25rem] h-2 w-2 -translate-x-1/2 rotate-45 border border-volt bg-ink"
        aria-hidden="true"
      />
      <div className="rounded-sm border border-[var(--line-strong)] bg-ink-raised/70 transition-colors hover:border-volt/50">
        <h3 className="m-0">
          <button
            type="button"
            id={buttonId}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5"
          >
            <span className="min-w-0">
              <span className="block font-sans text-[0.98rem] font-semibold text-paper sm:text-[1.05rem]">
                {item.org}
              </span>
              <span className="mt-1 block font-mono text-[0.82rem] font-medium text-volt">{item.role}</span>
              <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.72rem] uppercase tracking-wider text-paper-faint">
                <span>
                  {item.from} &rarr; {item.to}
                </span>
                <span aria-hidden="true">&middot;</span>
                <span>{item.location}</span>
              </span>
            </span>
            <span className="mt-1 shrink-0 text-paper-faint">
              <m.span
                className="block"
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </m.span>
            </span>
          </button>
        </h3>

        {open && (
          <m.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.24 }}
            className="border-t border-[var(--line-strong)] px-4 pb-5 pt-4 sm:px-5"
          >
            {item.summary && (
              <p className="mb-3 max-w-[70ch] text-[0.88rem] leading-relaxed text-paper-muted">
                {item.summary}
              </p>
            )}
            {item.bullets.length > 0 && (
              <ul className="space-y-2.5">
                {item.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[0.85rem] leading-relaxed text-paper-muted">
                    <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-volt" aria-hidden="true" />
                    <span className="max-w-[72ch]">{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {item.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-sm border border-[var(--line)] bg-ink-card/60 px-2.5 py-0.5 font-mono text-[0.68rem] text-paper-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </m.div>
        )}
      </div>
    </li>
  );
}

export function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 60%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" aria-labelledby="exp-heading" className="shell py-20 sm:py-24">
      <div className="ticks mb-6 w-40 opacity-70" aria-hidden="true" />
      <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="exp-heading" className="font-sans text-[1.6rem] font-medium sm:text-[2rem]">
            Experience &amp; Roles
          </h2>
          <p className="mt-3 max-w-[56ch] text-[0.92rem] leading-relaxed text-paper-muted">
            Internships, open-source engineering, and student organization leadership.
          </p>
        </div>
        <p className="eyebrow shrink-0">{experience.length} milestones</p>
      </Reveal>

      <div ref={containerRef} className="relative mt-12">
        {/* Track */}
        <div
          className="absolute bottom-4 left-0 top-4 w-px bg-[var(--line)]"
          aria-hidden="true"
        />

        {/* Scroll-driven spine indicator */}
        {!reduce && (
          <m.div
            data-spine
            style={{ scaleY }}
            className="absolute bottom-4 left-0 top-4 w-px origin-top bg-volt"
            aria-hidden="true"
          />
        )}

        <ol className="space-y-6">
          {experience.map((item, index) => (
            <Entry key={item.id} item={item} isFirst={index === 0} />
          ))}
        </ol>
      </div>
    </section>
  );
}
