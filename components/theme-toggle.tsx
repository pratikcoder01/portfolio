"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { applyTheme, type Theme } from "@/lib/theme";

/**
 * Dark / light switch. The icons are swapped by CSS on `[data-theme]`, never by
 * conditional markup, because the theme is decided by a pre-paint script that the
 * server cannot see — branching on it here would break hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const next: Theme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={
        theme === null
          ? "Switch colour theme"
          : theme === "light"
            ? "Switch to dark theme"
            : "Switch to light theme"
      }
      title={theme === "light" ? "Dark theme" : "Light theme"}
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-3 py-2 font-sans text-[0.78rem] text-paper transition-colors hover:border-volt/60 hover:bg-volt/10 ${className ?? ""}`}
    >
      <span aria-hidden="true" className="relative grid h-4 w-4 place-items-center">
        <Moon className="theme-icon-moon absolute h-4 w-4" />
        <Sun className="theme-icon-sun absolute h-4 w-4" />
      </span>
      <span className="hidden lg:inline">{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  );
}
