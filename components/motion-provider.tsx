"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * reducedMotion="user" makes every animated node drop transform animations for
 * visitors who ask for it, without components branching their own markup on the
 * preference (which would not match the server render).
 *
 * LazyMotion + domAnimation loads only the features this site uses, instead of
 * shipping the whole animation library on first paint. `strict` makes any stray
 * `motion.*` component throw, so nothing slips past the lighter build.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
