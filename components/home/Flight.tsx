"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

const ROUTE = "M40 250 C 170 40, 470 20, 620 168";

/**
 * Plane flying Korea -> Dubai along a dashed route as the section scrolls through the viewport.
 * It fades in after 11% of the route and banks to follow the curve. Reduced motion: parked at 62%.
 */
export function Flight({ photo, label }: { photo?: string; label: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();
  const clipId = useId();
  const { scrollYProgress } = useScroll({ target: boxRef, offset: ["start 95%", "end 25%"] });

  const place = (p: number) => {
    const route = routeRef.current, plane = planeRef.current;
    if (!route || !plane) return;
    const len = route.getTotalLength();
    const at = Math.min(len, Math.max(0, p * len));
    const pt = route.getPointAtLength(at);
    const ahead = route.getPointAtLength(Math.min(len, at + 1));
    const behind = route.getPointAtLength(Math.max(0, at - 1));
    const angle = (180 * Math.atan2(ahead.y - behind.y, ahead.x - behind.x)) / Math.PI;
    plane.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
    plane.style.opacity = String(Math.min(1, Math.max(0, (p - 0.11) / 0.06)));
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => !reduced && place(p));
  useEffect(() => place(reduced ? 0.62 : scrollYProgress.get()), [reduced, scrollYProgress]);

  return (
    <div ref={boxRef} className="tp-flight">
      <svg viewBox="0 0 660 300" role="img" aria-label={label}>
        <defs>
          <clipPath id={clipId}>
            <circle r="25" />
          </clipPath>
        </defs>
        <path ref={routeRef} d={ROUTE} className="tp-flight__route" />
        <circle cx="40" cy="250" r="7" className="tp-flight__dot" />
        <circle cx="620" cy="168" r="7" className="tp-flight__dot" />
        <text x="40" y="284" textAnchor="middle" className="tp-flight__label">Korea</text>
        <text x="620" y="202" textAnchor="middle" className="tp-flight__label">Dubai</text>
        <g ref={planeRef} transform="translate(410 70)">
          <g transform="translate(-126 -78)">
            <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing" />
            <path d="M108 112 L142 156 L172 156 L158 112 Z" className="tp-flight__wing tp-flight__wing--far" />
            <path d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z" className="tp-flight__body" />
            <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing" />
            <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line" />
          </g>
          {photo && (
            <g transform="translate(10 2)">
              <image href={photo} x="-25" y="-25" width="50" height="50" clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice" />
              <circle r="25" className="tp-flight__porthole" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
