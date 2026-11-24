"use client";

import type { ReactNode } from "react";

/**
 * TiltSurface — clean, tactile card container.
 * Replaces gimmicky 3D tilts and HUD readouts with crisp, flat, tactile surfaces:
 * subtle 1px border, clean hover elevation, and high-craft typography.
 */
export function TiltSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`tilt-root group h-full rounded-2xl transition-transform duration-300 ease-out hover:-translate-y-1 ${className}`}
      data-engaged="false"
      data-settled="true"
    >
      <div className="tilt-inner h-full">
        {children}
      </div>
    </div>
  );
}
