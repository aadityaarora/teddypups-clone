"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

// Paw prints that follow the mouse. Constants are taken 1:1 from the original
// PawTrailCanvas (docs/cursor.md). The arrow cursor itself is pure CSS in chrome.css.

// Ellipse as 4 cubic beziers (k = 0.5523), rotated by `deg`
function ellipse(cx: number, cy: number, rx: number, ry: number, deg: number) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const p = (x: number, y: number) => `${(cx + x * c - y * s).toFixed(2)} ${(cy + x * s + y * c).toFixed(2)}`;
  const k = 0.5523;
  return `M${p(rx, 0)}C${p(rx, k * ry)} ${p(k * rx, ry)} ${p(0, ry)}C${p(-k * rx, ry)} ${p(-rx, k * ry)} ${p(-rx, 0)}C${p(-rx, -k * ry)} ${p(-k * rx, -ry)} ${p(0, -ry)}C${p(k * rx, -ry)} ${p(rx, -k * ry)} ${p(rx, 0)}Z`;
}

const PRINT =
  "M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z" +
  ellipse(14.6, 29.2, 5.3, 6.9, -28) +
  ellipse(24.2, 16.6, 5.5, 7.3, -10) +
  ellipse(39.8, 16.6, 5.5, 7.3, 10) +
  ellipse(49.4, 29.2, 5.3, 6.9, 28);

const STEP = 46; // px travelled between prints
const SIDE = 7; // left/right offset
const MAX = 14;
const LIFE = 1000;
const HOLD = 600;

type Print = { x: number; y: number; angle: number; born: number };

export function PawTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const path = new Path2D(PRINT);
    const prints: Print[] = [];
    let dpr = 1, raf = 0, running = false;
    let lastX = NaN, lastY = NaN, travelled = 0, side = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
    };
    resize();

    const draw = (now: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = prints.length - 1; i >= 0; i--) {
        const p = prints[i];
        const age = now - p.born;
        if (age > LIFE) { prints.splice(i, 1); continue; }
        const l = age < HOLD ? 1 : 1 - (age - HOLD) / (LIFE - HOLD);
        ctx.globalAlpha = 0.42 * l * l;
        ctx.setTransform(0.27 * dpr, 0, 0, 0.27 * dpr, p.x * dpr, p.y * dpr);
        ctx.rotate(p.angle);
        ctx.translate(-32, -34);
        ctx.fillStyle = "#c2622b";
        ctx.fill(path);
      }
      if (prints.length) raf = requestAnimationFrame(draw);
      else running = false;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (Number.isNaN(lastX)) { lastX = e.clientX; lastY = e.clientY; return; }
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if ((travelled += Math.hypot(dx, dy)) >= STEP) {
        travelled = 0;
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const off = SIDE * (side = -side);
        prints.push({ x: e.clientX + Math.cos(angle) * off + 14, y: e.clientY + Math.sin(angle) * off + 16, angle, born: performance.now() });
        if (prints.length > MAX) prints.shift();
        if (!running) { running = true; raf = requestAnimationFrame(draw); }
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] size-full" />;
}
