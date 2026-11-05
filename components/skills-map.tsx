"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import {
  projects,
  skillGroups,
  skills,
  sources,
  type Skill,
  type SourceId,
} from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface Line {
  key: string;
  d: string;
}

const projectSlugs = new Set(projects.map((p) => p.slug as string));

export function SkillsMap() {
  const reduce = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<Record<string, HTMLElement | null>>({});
  const sourceRefs = useRef<Record<string, HTMLElement | null>>({});

  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);

  const activeName = hovered ?? pinned;
  const active = useMemo<Skill | null>(
    () => skills.find((s) => s.name === activeName) ?? null,
    [activeName],
  );

  const sourceIds = useMemo(() => {
    const used = new Set<SourceId>();
    skills.forEach((s) => s.evidence.forEach((e) => used.add(e)));
    const all = Object.values(sources).filter((s) => used.has(s.id));
    return all.sort((a, b) => {
      const rank = (k: string) => (k === "project" ? 0 : k === "role" ? 1 : 2);
      return rank(a.kind) - rank(b.kind);
    });
  }, []);

  const loadBySource = useMemo(() => {
    const counts = new Map<SourceId, number>();
    skills.forEach((s) => s.evidence.forEach((e) => counts.set(e, (counts.get(e) ?? 0) + 1)));
    return counts;
  }, []);

  const draw = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || !active) {
      setLines([]);
      return;
    }
    const base = wrap.getBoundingClientRect();
    const from = skillRefs.current[active.name]?.getBoundingClientRect();
    if (!from) {
      setLines([]);
      return;
    }
    const next: Line[] = active.evidence.map((id) => {
      const to = sourceRefs.current[id]?.getBoundingClientRect();
      if (!to) return null;
      const x1 = from.right - base.left - 1;
      const y1 = from.top - base.top + from.height / 2;
      const x2 = to.left - base.left + 1;
      const y2 = to.top - base.top + to.height / 2;
      const bend = Math.max(28, (x2 - x1) * 0.45);
      return {
        key: `${active.name}-${id}`,
        d: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
      };
    }).filter((l): l is Line => l !== null);
    setLines(next);
  }, [active]);

  useLayoutEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => draw()).catch(() => undefined);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  const grouped = useMemo(
    () =>
      skillGroups
        .map((group) => ({ group, items: skills.filter((s) => s.group === group) }))
        .filter((g) => g.items.length > 0),
    [],
  );

  const isLinked = (id: SourceId) => Boolean(active?.evidence.includes(id));

  return (
    <section id="skills" aria-labelledby="skills-heading" className="shell py-20 sm:py-24">
      <div className="ticks mb-6 w-40 opacity-70" aria-hidden="true" />
      <Reveal>
        <h2 id="skills-heading" className="font-sans text-[1.6rem] font-medium sm:text-[2rem]">
          Skills, with receipts
        </h2>
        <p className="mt-3 max-w-[64ch] text-[0.92rem] leading-relaxed text-paper-muted">
          No percentage bars. A skill only appears here when a project, role or certification
          documents it - hover, focus or tap a skill to trace the line to the work that proves it.
        </p>
      </Reveal>

      <div ref={wrapRef} className="relative mt-12">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
        >
          {lines.map((l) => (
            <path
              key={l.key}
              d={l.d}
              fill="none"
              stroke="var(--volt)"
              strokeOpacity={0.65}
              strokeWidth={1.2}
              className={reduce ? undefined : "flow-edge"}
            />
          ))}
        </svg>

        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div className="relative z-10 space-y-7">
            {grouped.map(({ group, items }) => (
              <div key={group}>
                <h3 className="eyebrow mb-3">{group}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {items.map((s) => {
                    const isActive = active?.name === s.name;
                    const isPinned = pinned === s.name;
                    return (
                      <li key={s.name}>
                        <button
                          type="button"
                          ref={(el) => {
                            skillRefs.current[s.name] = el;
                          }}
                          aria-pressed={isPinned}
                          onMouseEnter={() => setHovered(s.name)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(s.name)}
                          onBlur={() => setHovered(null)}
                          onClick={() => setPinned((p) => (p === s.name ? null : s.name))}
                          className={`rounded-lg border px-2.5 py-1.5 text-left text-[0.8rem] transition-colors duration-200 ${
                            isActive
                              ? "border-volt/70 bg-volt/15 text-paper"
                              : "border-[var(--line)] bg-ink-raised/70 text-paper-muted hover:border-[var(--line-strong)] hover:text-paper"
                          }`}
                        >
                          {s.name}
                          <span className="ml-2 font-sans text-[0.68rem] text-paper-faint">
                            {s.evidence.length > 0 ? s.evidence.length : "cert"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="relative z-10">
            <h3 className="eyebrow mb-3">Evidence</h3>
            <ul className="space-y-2">
              {sourceIds.map((src) => {
                const linked = isLinked(src.id);
                const href = src.kind === "project" && projectSlugs.has(src.id) ? `/projects/${src.id}` : src.href;
                const load = loadBySource.get(src.id) ?? 0;
                const inner = (
                  <>
                    <span className="flex items-baseline justify-between gap-3">
                      <span
                        className={`font-sans text-[0.9rem] transition-colors ${
                          linked ? "text-paper" : "text-paper-muted"
                        }`}
                      >
                        {src.label}
                      </span>
                      <span className="text-[0.68rem] text-paper-faint">
                        {load === 1 ? "1 skill" : `${load} skills`}
                      </span>
                    </span>
                    <span className="mt-1 block text-[0.7rem] uppercase tracking-label text-paper-faint">
                      {src.kind}
                    </span>
                  </>
                );

                return (
                  <li key={src.id}>
                    <div
                      ref={(el) => {
                        sourceRefs.current[src.id] = el;
                      }}
                      className={`rounded-xl border px-4 py-3 transition-[opacity,border-color,background-color] duration-300 ${
                        linked
                          ? "border-volt/50 bg-volt/[0.08] opacity-100"
                          : active
                            ? "border-[var(--line)] opacity-40"
                            : "border-[var(--line)] opacity-100"
                      }`}
                    >
                      {href ? (
                        <Link href={href} className="block hover:text-volt-soft">
                          {inner}
                        </Link>
                      ) : (
                        inner
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {active
          ? active.evidence.length > 0
            ? `${active.name}: evidenced by ${active.evidence
                .map((id) => sources[id]?.label ?? id)
                .join(", ")}`
            : `${active.name}: ${active.note ?? "no project evidence yet"}`
          : ""}
      </div>

      <div className="mt-8 rounded-xl border border-[var(--line)] bg-ink-raised/70 px-5 py-4">
        <p className="font-sans text-[0.95rem] text-paper">
          {active ? active.name : "Trace a skill"}
        </p>
        <p className="mt-1 min-h-[1.4rem] max-w-[72ch] text-[0.82rem] leading-relaxed text-paper-muted">
          {active
            ? active.note ?? "The sources on the right document where this skill was used."
            : "Hover, focus or tap any skill to draw the line to the project or role that documents it."}
        </p>
        <ul className="mt-3 flex min-h-[2rem] flex-wrap gap-2">
          {active ? (
            active.evidence.length > 0 ? (
              active.evidence.map((id) => {
                const src = sources[id];
                const href =
                  src.kind === "project" && projectSlugs.has(src.id) ? `/projects/${src.id}` : null;
                return (
                  <li key={id}>
                    {href ? (
                      <Link
                        href={href}
                        className="rounded-full border border-volt/40 px-3 py-1 text-[0.76rem] text-volt-soft hover:bg-volt/10"
                      >
                        {src.label}
                      </Link>
                    ) : (
                      <span className="rounded-full border border-[var(--line-strong)] px-3 py-1 text-[0.76rem] text-paper-muted">
                        {src.label}
                      </span>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="rounded-full border border-dashed border-[var(--line-strong)] px-3 py-1 text-[0.76rem] text-paper-faint">
                No project evidence yet
              </li>
            )
          ) : (
            <li className="rounded-full border border-dashed border-[var(--line)] px-3 py-1 text-[0.76rem] text-paper-faint">
              Nothing selected
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
