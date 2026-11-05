import { ArrowUpRight, GitBranch } from "lucide-react";
import Link from "next/link";

import { diagrams } from "@/components/architecture-diagrams";
import { TiltSurface } from "@/components/tilt-surface";
import type { Project } from "@/lib/data";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Diagram = project.diagram ? diagrams[project.diagram] : null;
  const todoCount = project.caseSections.filter((s) => s.status === "todo").length;

  return (
    <TiltSurface>
      {/* No overflow-hidden here: clipping flattens the 3D context the tilt
          layers need. The pointer light, edge ring and gloss are all painted
          inside their own rounded boxes, so nothing needs clipping anyway. */}
      <article
        className="tilt-card group relative flex h-full flex-col rounded-2xl border border-[var(--line)] bg-ink-raised/60 transition-[border-color,box-shadow] duration-500 ease-editorial hover:border-[var(--line-strong)] hover:shadow-[0_18px_60px_-30px_rgb(var(--volt-rgb)/0.45)]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-6 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-volt/70 to-transparent transition-transform duration-700 ease-editorial group-hover:scale-x-100"
        />

        <div className="tilt-face flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-sans text-[0.7rem] tracking-label text-paper-faint">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="text-[0.72rem] text-paper-faint">
              {project.role} - {project.period}
            </p>
          </div>

          <h3 data-depth="1" className="mt-2 font-sans text-[1.25rem] font-medium leading-tight sm:text-[1.35rem]">
            <Link
              href={`/projects/${project.slug}`}
              className="text-paper after:absolute after:inset-0 after:content-[''] hover:text-volt-soft"
            >
              {project.name}
            </Link>
          </h3>

          <p data-depth="1" className="mt-2 max-w-[52ch] text-[0.9rem] leading-relaxed text-paper-muted">
            {project.tagline}
          </p>

          {Diagram && (
            <div
              data-depth="3"
              className="skip-offscreen relative -mx-5 mt-5 hidden overflow-hidden border-y border-[var(--line)] bg-ink-card/50 px-5 py-5 sm:-mx-6 sm:block"
            >
              <div className="origin-top scale-[0.9] transition-transform duration-[900ms] ease-editorial group-hover:scale-100">
                <Diagram />
              </div>
              <p className="eyebrow pt-3">Documented architecture - hover to enlarge</p>
            </div>
          )}

          <ul className="mt-4 space-y-1.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-[0.82rem] leading-relaxed text-paper-muted">
                <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-volt/70" aria-hidden="true" />
                <span className="max-w-[58ch]">{h}</span>
              </li>
            ))}
          </ul>

          {project.scopeNote && (
            <p className="mt-4 rounded-lg border border-dashed border-[var(--line-strong)] px-3 py-2 text-[0.76rem] leading-relaxed text-paper-faint">
              {project.scopeNote}
            </p>
          )}

          <ul data-depth="2" className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((s) => (
              <li
                key={s}
                className="rounded-md border border-[var(--line)] px-2 py-1 text-[0.7rem] text-paper-muted"
              >
                {s}
              </li>
            ))}
            {project.stack.length > 6 && (
              <li className="rounded-md px-1 py-1 text-[0.7rem] text-paper-faint">
                +{project.stack.length - 6} more
              </li>
            )}
          </ul>

          <div data-depth="2" className="mt-auto flex items-end justify-between gap-4 pt-6">
            <p className="text-[0.72rem] text-paper-faint">
              {project.status}
              {todoCount > 0 && (
                <>
                  {" - "}
                  <span className="text-volt">
                    {todoCount} section{todoCount > 1 ? "s" : ""} awaiting your input
                  </span>
                </>
              )}
            </p>
            <span className="flex items-center gap-3">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="relative z-10 inline-flex items-center gap-1 rounded-full border border-[var(--line-strong)] px-2.5 py-1 text-[0.72rem] text-paper-muted transition-colors hover:border-volt/60 hover:text-paper"
                >
                  <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                  Repo
                  <span className="sr-only">{` for ${project.name} on GitHub`}</span>
                </a>
              )}
              <ArrowUpRight
                className="h-5 w-5 text-volt transition-transform duration-500 ease-editorial group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </article>
    </TiltSurface>
  );
}
