"use client";

import { useEffect, useState } from "react";

/**
 * Framer's own `useReducedMotion()` reads `matchMedia` during the first client
 * render while the server has no preference to read, so any markup branch built
 * on it renders differently from the streamed HTML and React discards the tree.
 * This variant starts from the server's answer (no preference) and only switches
 * after hydration, which keeps the two renders identical.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}
