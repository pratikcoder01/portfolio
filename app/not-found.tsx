import Link from "next/link";

import { sections } from "@/lib/data";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[68vh] flex-col justify-center py-24">
      <p className="eyebrow">404 - route not found</p>
      <h1 className="mt-4 font-sans text-[2rem] font-medium leading-tight sm:text-[2.8rem]">
        This path has no build artefact.
      </h1>
      <p className="mt-4 max-w-[54ch] text-[0.95rem] leading-relaxed text-paper-muted">
        The page you asked for does not exist. Everything that does is reachable from the sections
        below.
      </p>

      <nav aria-label="Available sections" className="mt-9">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/"
              className="inline-block rounded-full bg-volt px-4 py-2 font-sans text-[0.84rem] font-medium text-[var(--on-accent)]"
            >
              Home
            </Link>
          </li>
          {sections.map((s) => (
            <li key={s.id}>
              <Link
                href={`/#${s.id}`}
                className="inline-block rounded-full border border-[var(--line-strong)] px-4 py-2 font-sans text-[0.84rem] text-paper-muted transition-colors hover:border-volt/60 hover:text-paper"
              >
                {s.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/projects/athlix"
              className="inline-block rounded-full border border-[var(--line-strong)] px-4 py-2 font-sans text-[0.84rem] text-paper-muted transition-colors hover:border-volt/60 hover:text-paper"
            >
              Athlix case study
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
