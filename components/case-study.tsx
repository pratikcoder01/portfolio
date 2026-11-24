import { ArrowLeft, ArrowRight, GitBranch } from "lucide-react";
import Link from "next/link";

import { diagrams } from "@/components/architecture-diagrams";
import { projects, type CaseSection, type Project } from "@/lib/data";

function SectionBlock({ project, section }: { project: Project; section: CaseSection }) {
  const Diagram =
    section.id === "architecture" && project.diagram ? diagrams[project.diagram] : null;

  return (
    <div
      id={section.id}
      className="scroll-mt-28 border-t border-[var(--line)] py-10 first:border-t-0"
      aria-labelledby={`${section.id}-heading`}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[0.72rem] font-semibold tracking-wider text-volt" aria-hidden="true">
          [{String(section.id).slice(0, 3).toUpperCase()}]
        </span>
        <h2 id={`${section.id}-heading`} className="font-sans text-[1.25rem] font-semibold sm:text-[1.45rem]">
          {section.title}
        </h2>
      </div>

      <div className="mt-4 space-y-4">
        {section.paragraphs?.map((p) => (
          <p key={p} className="max-w-[70ch] text-[0.92rem] leading-relaxed text-paper-muted">
            {p}
          </p>
        ))}

        {Diagram && (
          <figure className="my-6 rounded-sm border border-[var(--line-strong)] bg-ink-card/60 px-4 py-5 sm:px-6">
            <div className="skip-offscreen overflow-x-auto">
              <div className="min-w-[30rem]">
                <Diagram />
              </div>
            </div>
            <figcaption className="mt-3 font-mono text-[0.72rem] uppercase tracking-wider text-paper-faint">
              System architecture schematic and data flow
            </figcaption>
          </figure>
        )}

        {section.bullets && (
          <ul className="space-y-2">
            {section.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[0.88rem] leading-relaxed text-paper-muted">
                <span
                  className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-volt"
                  aria-hidden="true"
                />
                <span className="max-w-[70ch]">{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function CaseStudy({ project }: { project: Project }) {
  const visibleSections = project.caseSections;

  return (
    <div className="shell py-14 sm:py-20">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.74rem] uppercase tracking-wider text-paper-faint">
          <li>
            <Link href="/" className="link-quiet">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#work" className="link-quiet">
              Selected Work
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-volt" aria-current="page">
            {project.name}
          </li>
        </ol>
      </nav>

      <header className="border-b border-[var(--line)] pb-8">
        <p className="eyebrow font-mono text-[0.72rem] uppercase tracking-wider text-paper-faint">Technical Case Study</p>
        <h1 className="mt-3 font-sans text-[1.9rem] font-semibold leading-tight sm:text-[2.6rem]">
          {project.name}
        </h1>
        <p className="mt-4 max-w-[68ch] text-[1rem] leading-relaxed text-paper-muted">
          {project.tagline}
        </p>

        <dl className="mt-7 grid gap-px overflow-hidden rounded-sm border border-[var(--line-strong)] bg-[var(--line-strong)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { term: "Role", detail: project.role },
            { term: "Period", detail: project.period },
            { term: "Status", detail: project.status },
            { term: "Focus", detail: "Architecture & Implementation" },
          ].map((cell) => (
            <div key={cell.term} className="bg-ink-raised px-4 py-3">
              <dt className="font-mono text-[0.68rem] uppercase tracking-wider text-paper-faint">{cell.term}</dt>
              <dd className="mt-1 font-mono text-[0.82rem] leading-snug text-paper-muted">{cell.detail}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-sm bg-volt px-4 py-2 font-mono text-[0.78rem] font-semibold uppercase tracking-wider text-[var(--on-accent)] transition-all hover:brightness-110"
            >
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              Open repository
              <span className="sr-only">{` (external, opens in a new tab)`}</span>
            </a>
          )}
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-sm border border-[var(--line-strong)] bg-ink-raised/60 px-4 py-2 font-mono text-[0.78rem] uppercase tracking-wider text-paper transition-colors hover:border-volt/60 hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All projects
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.74rem] uppercase tracking-wider">
          {visibleSections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="link-quiet">
                [{s.title}]
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="min-w-0">
          {visibleSections.map((section) => (
            <SectionBlock key={section.id} project={project} section={section} />
          ))}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-sm border border-[var(--line-strong)] bg-ink-raised/60 p-5">
            <p className="eyebrow font-mono text-[0.72rem] uppercase tracking-wider text-paper-faint">Tech Stack</p>
            <ul className="mt-3 space-y-1.5 font-mono text-[0.76rem] text-paper-muted">
              {project.stack.map((s) => (
                <li key={s} className="rounded-sm border border-[var(--line)] bg-ink-card/40 px-2 py-1">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {project.scopeNote && (
        <p className="mt-10 max-w-[70ch] rounded-sm border border-[var(--line-strong)] bg-ink-raised/60 px-5 py-4 font-mono text-[0.78rem] leading-relaxed text-paper-muted">
          <span className="font-mono text-[0.7rem] uppercase tracking-wider text-volt">Scope Note</span>
          <span className="mt-1.5 block">{project.scopeNote}</span>
        </p>
      )}

      <ProjectNav slug={project.slug} />
    </div>
  );
}

function ProjectNav({ slug }: { slug: string }) {
  const order = projects.map((p) => p.slug);
  const i = order.indexOf(slug);
  const prev = i > 0 ? projects[i - 1] : null;
  const next = i >= 0 && i < order.length - 1 ? projects[i + 1] : null;

  return (
    <div className="mt-14 grid gap-4 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/projects/${prev.slug}`}
          className="group rounded-sm border border-[var(--line-strong)] bg-ink-raised/40 px-4 py-3.5 transition-colors hover:border-volt/50"
        >
          <span className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-paper-faint">
            <ArrowLeft className="h-3.5 w-3.5 text-volt transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Previous case study
          </span>
          <span className="mt-1.5 block font-sans text-[0.95rem] font-medium text-paper">{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={`/projects/${next.slug}`}
          className="group rounded-sm border border-[var(--line-strong)] bg-ink-raised/40 px-4 py-3.5 text-right transition-colors hover:border-volt/50"
        >
          <span className="flex items-center justify-end gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-paper-faint">
            Next case study
            <ArrowRight className="h-3.5 w-3.5 text-volt transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
          <span className="mt-1.5 block font-sans text-[0.95rem] font-medium text-paper">{next.name}</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
