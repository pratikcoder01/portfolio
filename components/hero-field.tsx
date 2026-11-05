"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "off" | "static" | "animated";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const LINK_DISTANCE = 150;

/** The canvas reads its accent from the same token the CSS uses, so the node
 *  graph follows the theme instead of carrying a second copy of the colour. */
function readAccent(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--volt-rgb").trim();
  const parts = raw.split(/[\s,]+/).map(Number);
  return parts.length === 3 && parts.every((n) => Number.isFinite(n))
    ? [parts[0], parts[1], parts[2]]
    : [124, 140, 255];
}

/**
 * Drifting node graph behind the hero.
 * - transform/opacity-style work only: canvas pixels, no layout writes.
 * - pauses when off-screen or when the tab is hidden.
 * - never runs under prefers-reduced-motion; low-power devices get one static frame.
 */
export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("off");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMode("off");
      return;
    }

    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
    const saveData = (
      navigator as unknown as { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowPower =
      cores <= 2 ||
      memory <= 2 ||
      Boolean(saveData) ||
      coarse ||
      window.innerWidth < 768;

    setMode(lowPower ? "static" : "animated");
  }, []);

  useEffect(() => {
    if (mode === "off") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let frame = 0;
    let running = false;
    let visible = true;
    let docVisible = true;
    let accent = readAccent();

    const seed = () => {
      const count = Math.max(10, Math.min(34, Math.round((width * height) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.1 + 0.9,
      }));
    };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const paint = (time: number) => {
      const rgba = (alpha: number) => `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha})`;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;
          const alpha = (1 - dist / LINK_DISTANCE) * 0.2;
          ctx.strokeStyle = rgba(alpha);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();

          // One signal pulse per linked pair, sampled sparsely.
          if ((i + j) % 5 === 0) {
            const t = ((time / 5200 + (i * 0.17 + j * 0.07)) % 1 + 1) % 1;
            const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
            const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
            ctx.fillStyle = rgba(alpha * 3.2);
            ctx.beginPath();
            ctx.arc(px, py, 1.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = rgba(0.5);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (time: number) => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }
      paint(time);
    };

    const loop = (time: number) => {
      if (!running) return;
      step(time);
      frame = requestAnimationFrame(loop);
    };

    let ready = false;

    const sync = () => {
      const shouldRun = ready && mode === "animated" && visible && docVisible;
      if (shouldRun && !running) {
        running = true;
        frame = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    };

    measure();
    paint(0);

    // The loop waits for the first idle moment so the decoration never competes
    // with hydration and the hero's own reveal for main-thread time.
    const idle = window.setTimeout(() => {
      ready = true;
      sync();
    }, 1200);

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0.01 },
    );
    observer.observe(canvas);

    const onVisibility = () => {
      docVisible = document.visibilityState !== "hidden";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measure();
        paint(0);
      }, 180);
    };
    window.addEventListener("resize", onResize);

    // Repaint straight away when the palette changes, so the static frame used on
    // low-power devices follows the toggle instead of keeping the old accent.
    const themeWatcher = new MutationObserver(() => {
      accent = readAccent();
      paint(0);
    });
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeWatcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(idle);
    };
  }, [mode]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgb(var(--volt-rgb) / 0.13), transparent 62%)",
          filter: "blur(8px)",
        }}
      />
      {mode !== "off" && (
        <canvas ref={canvasRef} className="h-full w-full opacity-70" style={{ display: "block" }} />
      )}
      {/* Hairline horizon keeps the field anchored to the editorial grid. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--line-strong),transparent)]" />
    </div>
  );
}
