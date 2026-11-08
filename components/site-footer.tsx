import { ArrowUp, Download } from "lucide-react";
import Link from "next/link";

import { profile, sections, socials } from "@/lib/data";
import { resumeExists } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="shell py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-sans text-[1.05rem] font-medium text-paper">{profile.name}</p>
            <p className="mt-1 text-[0.85rem] text-paper-muted">
              {profile.title} - {profile.location}
            </p>
            <p className="mt-3 flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-[0.8rem] text-paper-muted transition-colors hover:text-paper"
                >
                  {s.label}
                  <span className="sr-only">{` - ${s.handle}, opens in a new tab`}</span>
                </a>
              ))}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-[0.84rem] sm:grid-cols-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link href={`/#${s.id}`} className="link-quiet">
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#work" className="link-quiet">
                  Case studies
                </Link>
              </li>
              {resumeExists && (
                <li>
                  <a
                    href="/resume.pdf"
                    download
                    aria-label="Download resume (PDF)"
                    className="link-quiet inline-flex items-center gap-1.5"
                  >
                    <Download className="h-3 w-3" aria-hidden="true" />
                    Résumé
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-[0.75rem] text-paper-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built with Next.js, TypeScript and Tailwind CSS. Every claim on this page is sourced from
            my profile or a public repository.
          </p>
          <a
            href="#main"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-3 py-1.5 transition-colors hover:border-volt/60 hover:text-paper"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
