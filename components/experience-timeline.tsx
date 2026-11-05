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
        className="absolute left-0 top-[1.15rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-volt/70 bg-ink"
        aria-hidden="true"
      />
      <div className="rounded-xl border border-[var(--line)] bg-ink-raised/70 transition-colors hover:border-[var(--line-strong)]">
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
              <span className="block font-sans text-[0.98rem] font-medium text-paper sm:text-[1.05rem]">
                {item.org}
              </span>
              <span className="mt-1 block text-[0.86rem] text-volt-soft">{item.role}</span>
              <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-paper-faint">
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
            className="border-t border-[var(--line)] px-4 pb-5 pt-4 sm:px-5"
          >
            {item.summary && (
              <p className="mb-3 max-w-[70ch] text-[0.88rem] leading-relaxed text-paper-muted">
                {item.summary}
              </p>
            )}
            {item.bullets.length > 0 && (
              <ul className="space-y-2.5">
                {item.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[0.88rem] leading-relaxed text-paper-muted">
                    <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-volt" aria-hidden="true" />
                    <span className="max-w-[72ch]">{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {item.detailTodo && (
              <p className="mt-4 rounded-lg border border-dashed border-volt/35 bg-volt/[0.06] px-3 py-2 text-[0.78rem] text-paper-muted">
                <span className="font-sans text-[0.7rem] uppercase tracking-label text-volt">
                  To be completed
                </span>
                <span className="mt-1 block">{item.detailTodo}</span>
              </p>
            )}

            {item.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-[var(--line-strong)] px-2.5 py-1 text-[0.72rem] text-paper-muted"
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
  const reduce = usePrefersReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 82%", "end 45%"],
  });
  const eased = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const spring = useSpring(eased, { stiffness: 140, damping: 30, mass: 0.4 });

  return (
    <section id="experience" aria-labelledby="experience-heading" className="shell py-20 sm:py-24">
      <div className="ticks mb-6 w-40 opacity-70" aria-hidden="true" />
      <Reveal>
        <h2 id="experience-heading" className="font-sans text-[1.6rem] font-medium sm:text-[2rem]">
          Experience
        </h2>
        <p className="mt-3 max-w-[62ch] text-[0.92rem] leading-relaxed text-paper-muted">
          Select any role to expand it. The spine fills as you read down the record.
        </p>
      </Reveal>

      <div ref={railRef} className="relative mt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-[var(--line)] sm:block"
        >
          <m.div
            data-spine=""
            className="h-full w-px origin-top bg-gradient-to-b from-volt via-volt/50 to-volt/10"
            style={{ scaleY: reduce ? 1 : spring }}
          />
        </div>

        <ol className="relative space-y-4">
          {experience.map((item, i) => (
            <Entry key={item.id} item={item} isFirst={i === 0} />
          ))}
        </ol>
      </div>
    </section>
  );
}
