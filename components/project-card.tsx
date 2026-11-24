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
        className="tilt-card relative flex h-full flex-col rounded-2xl border border-[var(--line)] bg-ink-raised/60 transition-[border-color,box-shadow,background-color] duration-300 hover:border-[var(--line-strong)] hover:bg-ink-raised/80 hover:shadow-md"
      >
        <div className="tilt-face flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-sans text-[0.7rem] tracking-label text-paper-faint">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="text-[0.72rem] text-paper-faint">
              {project.role} · {project.period}
            </p>
          </div>

          <h3 className="mt-2.5 font-sans text-[1.25rem] font-medium leading-tight sm:text-[1.35rem]">
            <Link
              href={`/projects/${project.slug}`}
              className="text-paper after:absolute after:inset-0 after:content-[''] hover:text-volt-soft"
            >
              {project.name}
            </Link>
          </h3>

          <p className="mt-2 max-w-[52ch] text-[0.9rem] leading-relaxed text-paper-muted">
            {project.tagline}
          </p>

          {Diagram && (
            <div
              className="skip-offscreen relative -mx-5 mt-5 hidden overflow-hidden border-y border-[var(--line)] bg-ink-card/50 px-5 py-4 sm:-mx-6 sm:block"
            >
              <div className="origin-top">
                <Diagram />
              </div>
              <p className="eyebrow pt-2 text-[0.65rem]">System Architecture</p>
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
            <p className="mt-4 rounded-lg border border-[var(--line)] bg-ink/40 px-3 py-2 text-[0.76rem] leading-relaxed text-paper-faint">
              {project.scopeNote}
            </p>
          )}

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((s) => (
              <li
                key={s}
                className="rounded-md border border-[var(--line)] bg-ink-card/40 px-2 py-0.5 text-[0.7rem] text-paper-muted"
              >
                {s}
              </li>
            ))}
            {project.stack.length > 6 && (
              <li className="rounded-md px-1 py-0.5 text-[0.7rem] text-paper-faint">
                +{project.stack.length - 6} more
              </li>
            )}
          </ul>

          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            <p className="text-[0.72rem] text-paper-faint">
              {project.status}
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
