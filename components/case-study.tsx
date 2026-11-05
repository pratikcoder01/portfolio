import { ArrowLeft, ArrowRight, CircleAlert, GitBranch } from "lucide-react";
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
        <span className="font-sans text-[0.7rem] tracking-label text-paper-faint" aria-hidden="true">
          {String(section.id).slice(0, 2).toUpperCase()}
        </span>
        <h2 id={`${section.id}-heading`} className="font-sans text-[1.25rem] font-medium sm:text-[1.45rem]">
          {section.title}
        </h2>
        {section.status === "todo" && (
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-dashed border-volt/45 px-2.5 py-1 text-[0.68rem] uppercase tracking-label text-volt">
            <CircleAlert className="h-3 w-3" aria-hidden="true" />
            To be completed
          </span>
        )}
      </div>

      {section.status === "todo" ? (
        <p className="mt-4 max-w-[70ch] rounded-xl border border-dashed border-[var(--line-strong)] bg-ink-raised/40 px-4 py-3.5 text-[0.86rem] leading-relaxed text-paper-muted">
          {section.needed}
          <span className="mt-2 block text-[0.74rem] text-paper-faint">
            Left deliberately empty - this page states only what a source documents.
          </span>
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {section.paragraphs?.map((p) => (
            <p key={p} className="max-w-[70ch] text-[0.92rem] leading-relaxed text-paper-muted">
              {p}
            </p>
          ))}

          {Diagram && (
            <figure className="my-6 rounded-2xl border border-[var(--line)] bg-ink-card/45 px-4 py-5 sm:px-6">
              <div className="skip-offscreen overflow-x-auto">
                <div className="min-w-[30rem]">
                  <Diagram />
                </div>
              </div>
              <figcaption className="mt-3 text-[0.74rem] leading-relaxed text-paper-faint">
                Diagram drawn only from components named in the project README. Scroll sideways if
                it does not fit.
              </figcaption>
            </figure>
          )}

          {section.bullets && (
            <ul className="space-y-2">
              {section.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[0.9rem] leading-relaxed text-paper-muted">
                  <span
                    className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-volt"
                    aria-hidden="true"
                  />
                  <span className="max-w-[70ch]">{b}</span>
                </li>
              ))}
            </ul>
          )}

          {section.provenance && (
            <p className="text-[0.75rem] italic text-paper-faint">{section.provenance}</p>
          )}

          {section.needed && (
            <p className="max-w-[70ch] rounded-lg border border-dashed border-volt/35 bg-volt/[0.05] px-3.5 py-2.5 text-[0.8rem] leading-relaxed text-paper-muted">
              <span className="font-sans text-[0.68rem] uppercase tracking-label text-volt">
                Still to add
              </span>
              <span className="mt-1 block">{section.needed}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function CaseStudy({ project }: { project: Project }) {
  const documented = project.caseSections.filter((s) => s.status === "documented").length;

  return (
    <div className="shell py-14 sm:py-20">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-[0.78rem] text-paper-faint">
          <li>
            <Link href="/" className="link-quiet">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#work" className="link-quiet">
              Selected work
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-paper-muted" aria-current="page">
            {project.name}
          </li>
        </ol>
      </nav>

      <header className="border-b border-[var(--line)] pb-8">
        <p className="eyebrow">Case study</p>
        <h1 className="mt-3 font-sans text-[1.9rem] font-medium leading-tight sm:text-[2.6rem]">
          {project.name}
        </h1>
        <p className="mt-4 max-w-[68ch] text-[1rem] leading-relaxed text-paper-muted">
          {project.tagline}
        </p>

        <dl className="mt-7 grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { term: "Role", detail: project.role },
            { term: "Period", detail: project.period },
            { term: "State", detail: project.status },
            {
              term: "Documented",
              detail: `${documented} of ${project.caseSections.length} sections`,
            },
          ].map((cell) => (
            <div key={cell.term} className="bg-ink-raised px-4 py-3">
              <dt className="text-[0.68rem] uppercase tracking-label text-paper-faint">{cell.term}</dt>
              <dd className="mt-1 text-[0.84rem] leading-snug text-paper-muted">{cell.detail}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-volt px-4 py-2 font-sans text-[0.84rem] font-medium text-[var(--on-accent)]"
            >
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              Open repository
              <span className="sr-only">{` (external, opens in a new tab)`}</span>
            </a>
          )}
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-4 py-2 font-sans text-[0.84rem] text-paper-muted transition-colors hover:border-volt/60 hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All projects
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[0.78rem]">
          {project.caseSections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="link-quiet capitalize">
                {s.title}
                {s.status === "todo" && <span className="ml-1 text-volt">*</span>}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="min-w-0">
          {project.caseSections.map((section) => (
            <SectionBlock key={section.id} project={project} section={section} />
          ))}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-[var(--line)] bg-ink-raised/50 p-5">
            <p className="eyebrow">Stack</p>
            <ul className="mt-3 space-y-1.5 text-[0.8rem] text-paper-muted">
              {project.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="mt-5 text-[0.72rem] leading-relaxed text-paper-faint">
              * marks a section waiting on source material.
            </p>
          </div>
        </aside>
      </div>

      {project.scopeNote && (
        <p className="mt-10 max-w-[70ch] rounded-xl border border-[var(--line)] bg-ink-raised/50 px-5 py-4 text-[0.84rem] leading-relaxed text-paper-muted">
          <span className="font-sans text-[0.7rem] uppercase tracking-label text-volt">Scope</span>
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
          className="group rounded-xl border border-[var(--line)] px-4 py-3.5 transition-colors hover:border-volt/50"
        >
          <span className="flex items-center gap-1.5 text-[0.72rem] uppercase tracking-label text-paper-faint">
            <ArrowLeft className="h-3.5 w-3.5 text-volt transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Previous case study
          </span>
          <span className="mt-1.5 block font-sans text-[0.95rem] text-paper">{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={`/projects/${next.slug}`}
          className="group rounded-xl border border-[var(--line)] px-4 py-3.5 text-right transition-colors hover:border-volt/50"
        >
          <span className="flex items-center justify-end gap-1.5 text-[0.72rem] uppercase tracking-label text-paper-faint">
            Next case study
            <ArrowRight className="h-3.5 w-3.5 text-volt transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
          <span className="mt-1.5 block font-sans text-[0.95rem] text-paper">{next.name}</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
