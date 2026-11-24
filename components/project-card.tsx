import { ArrowUpRight, GitBranch } from "lucide-react";
import Link from "next/link";

import { diagrams } from "@/components/architecture-diagrams";
import { TiltSurface } from "@/components/tilt-surface";
import type { Project } from "@/lib/data";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Diagram = project.diagram ? diagrams[project.diagram] : null;

  return (
    <TiltSurface>
      <article
        className="tilt-card relative flex h-full flex-col rounded-sm border border-[var(--line-strong)] bg-ink-raised/60 transition-[border-color,box-shadow,background-color] duration-200 hover:border-volt/50 hover:bg-ink-raised/90"
      >
        <div className="tilt-face flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[0.72rem] font-semibold tracking-wider text-volt">
              [{String(index + 1).padStart(2, "0")}]
            </p>
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-paper-faint">
              {project.role} · {project.period}
            </p>
          </div>

          <h3 className="mt-2.5 font-sans text-[1.25rem] font-semibold leading-tight sm:text-[1.35rem]">
            <Link
              href={`/projects/${project.slug}`}
              className="text-paper after:absolute after:inset-0 after:content-[''] hover:text-volt"
            >
              {project.name}
            </Link>
          </h3>

          <p className="mt-2 max-w-[52ch] text-[0.9rem] leading-relaxed text-paper-muted">
            {project.tagline}
          </p>

          {Diagram && (
            <div
              className="skip-offscreen relative -mx-5 mt-5 hidden overflow-hidden border-y border-[var(--line-strong)] bg-ink-card/60 px-5 py-4 sm:-mx-6 sm:block"
            >
              <div className="origin-top">
                <Diagram />
              </div>
              <p className="eyebrow pt-2 font-mono text-[0.64rem] uppercase tracking-widest text-volt">
                System Schematic Blueprint
              </p>
            </div>
          )}

          <ul className="mt-4 space-y-1.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-[0.82rem] leading-relaxed text-paper-muted">
                <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-volt" aria-hidden="true" />
                <span className="max-w-[58ch]">{h}</span>
              </li>
            ))}
          </ul>

          {project.scopeNote && (
            <p className="mt-4 rounded-sm border border-[var(--line)] bg-ink/40 px-3 py-2 font-mono text-[0.72rem] leading-relaxed text-paper-faint">
              {project.scopeNote}
            </p>
          )}

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((s) => (
              <li
                key={s}
                className="rounded-sm border border-[var(--line)] bg-ink-card/60 px-2 py-0.5 font-mono text-[0.68rem] text-paper-muted"
              >
                {s}
              </li>
            ))}
            {project.stack.length > 6 && (
              <li className="rounded-sm px-1 py-0.5 font-mono text-[0.68rem] text-paper-faint">
                +{project.stack.length - 6} more
              </li>
            )}
          </ul>

          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-paper-faint">
              {project.status}
            </p>
            <span className="flex items-center gap-3">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="relative z-10 inline-flex items-center gap-1 rounded-sm border border-[var(--line-strong)] bg-ink px-2.5 py-1 font-mono text-[0.7rem] text-paper-muted transition-colors hover:border-volt/60 hover:text-paper"
                >
                  <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                  Repo
                  <span className="sr-only">{` for ${project.name} on GitHub`}</span>
                </a>
              )}
              <ArrowUpRight
                className="h-5 w-5 text-volt transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </article>
    </TiltSurface>
  );
}
