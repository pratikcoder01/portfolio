"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Page-load reveal: a hairline that sweeps across the top once.
 * It is aria-hidden and pointer-events-none so it can never block content.
 */
export function LoadReveal() {
  const reduce = usePrefersReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, [reduce]);

  if (reduce) return null;

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-px origin-left"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgb(var(--volt-rgb) / 0.9) 40%, rgb(var(--volt-rgb) / 0.9) 60%, transparent)",
      }}
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: done ? 1 : 0.02, opacity: done ? 0 : 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
