"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * TiltSurface — the card behaves like a physical instrument panel.
 *
 * The pointer sets a target tilt; a critically-damped lerp chases it in one
 * requestAnimationFrame loop, and the only things written each frame are a
 * transform string and three CSS custom properties on a single element. Nothing
 * here touches layout: rotation, translation and gradient position are all
 * compositor work.
 *
 * It switches itself off for coarse pointers, small screens, low-power devices
 * and `prefers-reduced-motion`, in which case the markup is a plain card.
 */

const MAX_TILT = 8; // degrees: enough to read as 3D on a tall card without smearing text
const LIFT = 22; // px toward the viewer
const SMOOTH = 0.15; // 0..1 chase factor per frame

function isSupported(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia("(pointer: fine)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 640) return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
  const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData;
  return cores > 2 && memory > 2 && !saveData;
}

export function TiltSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLOutputElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner || !isSupported()) return;

    let targetX = 0;
    let targetY = 0;
    let targetEngage = 0;
    let currentX = 0;
    let currentY = 0;
    let engage = 0;
    let pointer = { x: 0.5, y: 0.5 };
    let frame = 0;
    let settled = true;

    const render = () => {
      inner.style.transform =
        `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) ` +
        `translate3d(0, ${(-LIFT * engage).toFixed(2)}px, ${(40 * engage).toFixed(2)}px)`;
      inner.style.setProperty("--mx", `${(pointer.x * 100).toFixed(2)}%`);
      inner.style.setProperty("--my", `${(pointer.y * 100).toFixed(2)}%`);
      inner.style.setProperty("--engage", engage.toFixed(3));
      if (readoutRef.current) {
        readoutRef.current.textContent = `${pointer.x.toFixed(2)} · ${pointer.y.toFixed(2)}`;
      }
    };

    const loop = () => {
      currentX += (targetX - currentX) * SMOOTH;
      currentY += (targetY - currentY) * SMOOTH;
      engage += (targetEngage - engage) * SMOOTH;
      render();
      const done =
        Math.abs(targetX - currentX) < 0.02 &&
        Math.abs(targetY - currentY) < 0.02 &&
        Math.abs(targetEngage - engage) < 0.004;
      if (done) {
        currentX = targetX;
        currentY = targetY;
        engage = targetEngage;
        render();
        root.dataset.engaged = targetEngage > 0.5 ? "true" : "false";
        root.dataset.settled = "true";
        frame = 0;
        settled = true;
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const wake = () => {
      settled = false;
      root.dataset.settled = "false";
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      pointer = { x: Math.min(1, Math.max(0, nx)), y: Math.min(1, Math.max(0, ny)) };
      targetX = (0.5 - pointer.y) * 2 * MAX_TILT;
      targetY = (pointer.x - 0.5) * 2 * MAX_TILT;
      wake();
    };

    const onEnter = () => {
      targetEngage = 1;
      root.dataset.engaged = "true";
      wake();
    };

    const onLeave = () => {
      targetEngage = 0;
      targetX = 0;
      targetY = 0;
      wake();
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.dataset.tilt = "ready";
    if (!settled) wake();

    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      inner.style.transform = "";
      inner.style.removeProperty("--mx");
      inner.style.removeProperty("--my");
      inner.style.removeProperty("--engage");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`tilt-root h-full${className ? ` ${className}` : ""}`}
      data-engaged="false"
      data-settled="true"
    >
      <div ref={innerRef} className="tilt-inner">
        {children}
        <span aria-hidden="true" className="tilt-edge" />
        <span aria-hidden="true" className="tilt-light" />
        <span aria-hidden="true" className="tilt-sheen" />
        <span aria-hidden="true" className="tilt-cross tilt-cross-h" />
        <span aria-hidden="true" className="tilt-cross tilt-cross-v" />
        <span aria-hidden="true" className="tilt-ticks">
          <i />
          <i />
          <i />
          <i />
        </span>
        <output aria-hidden="true" ref={readoutRef} className="tilt-readout" />
      </div>
    </div>
  );
}
