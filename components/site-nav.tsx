"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Magnetic } from "@/components/magnetic";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile, sections, contactEmail } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function SiteNav() {
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname === "";
  const reduce = usePrefersReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.01, 0.25, 0.5] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [onHome, pathname]);

  useEffect(() => setOpen(false), [pathname]);

  const indicator = hovered ?? active;
  const email = contactEmail();
  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-ink/88 backdrop-blur-[6px]">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-baseline gap-2 font-sans text-[0.95rem] font-medium tracking-tight text-paper"
        >
          <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-volt/45 font-sans text-[0.7rem] text-volt">
            PN
          </span>
          <span>{profile.name}</span>
          <span className="hidden text-[0.75rem] text-paper-faint sm:inline">
            / {profile.title}
          </span>
        </Link>

        <nav aria-label="Section navigation" className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center gap-1">
            {sections.map((s) => {
              const isActive = indicator === s.id;
              return (
                <li key={s.id} onMouseEnter={() => setHovered(s.id)} onMouseLeave={() => setHovered(null)}>
                  <Link
                    href={hrefFor(s.id)}
                    className="relative block px-3 py-2 text-[0.82rem] text-paper-muted transition-colors hover:text-paper"
                    aria-current={active === s.id ? "location" : undefined}
                  >
                    {s.label}
                    {isActive && !reduce ? (
                      <m.span
                        layoutId="nav-underline"
                        className="absolute inset-x-2 -bottom-px h-px bg-volt"
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ) : (
                      <span
                        className={`absolute inset-x-2 -bottom-px h-px bg-volt/70 ${isActive ? "" : "opacity-0"}`}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Magnetic className="ml-3">
            <a
              href={email ? `mailto:${email}` : hrefFor("contact")}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-4 py-2 font-sans text-[0.82rem] text-paper transition-colors hover:border-volt/60 hover:bg-volt/10"
            >
              Get in touch
              <ArrowUpRight className="h-3.5 w-3.5 text-volt" aria-hidden="true" />
            </a>
          </Magnetic>

          <ThemeToggle className="ml-2" />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="md:hidden" />

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-3 py-2 font-sans text-[0.8rem] text-paper md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <m.nav
            id="mobile-nav"
            aria-label="Section navigation"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[var(--line)] md:hidden"
          >
            <ul className="shell flex flex-col py-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link
                    href={hrefFor(s.id)}
                    onClick={() => setOpen(false)}
                    className="block border-b border-[var(--line)] py-3 font-sans text-[0.9rem] text-paper last:border-0"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={email ? `mailto:${email}` : hrefFor("contact")}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-sans text-[0.9rem] text-volt"
                >
                  Get in touch
                </a>
              </li>
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
