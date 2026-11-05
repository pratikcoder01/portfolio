"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/**
 * One observer serves every section on the page. Framer's `whileInView` gave each
 * reveal its own subscription and per-frame style writes, which showed up as the
 * largest share of main-thread Style & Layout time on a throttled mobile CPU.
 */
let observer: IntersectionObserver | undefined;

function shared(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-reveal", "shown");
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px -5% 0px -5%", threshold: 0.02 },
  );
  return observer;
}

/** Section-level entrance. The hidden state lives in CSS behind a motion
 *  preference query, so reduced-motion and no-JS visitors get plain content. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = shared();
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal="pending"
      style={{ transitionDelay: `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
