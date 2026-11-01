"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

/**
 * Marks [data-reveal] descendants with data-revealed as they scroll into view, so CSS can animate them in.
 * Items already on screen at mount are revealed immediately (no data-armed, so no entrance animation).
 * Reduced motion: everything is revealed at once.
 */
export function RevealScope({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const pending = () => root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");

    if (prefersReducedMotion()) {
      const all = () => pending().forEach((el) => (el.dataset.revealed = "true"));
      all();
      const mo = new MutationObserver(all);
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.revealed = "true";
        io.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

    const arm = (el: HTMLElement) => {
      if (el.dataset.armed) return io.observe(el);
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) { el.dataset.revealed = "true"; return; }
      el.dataset.armed = "true";
      io.observe(el);
    };
    pending().forEach(arm);
    const mo = new MutationObserver(() => pending().forEach(arm));
    mo.observe(root, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return <div ref={ref} className={className} {...rest}>{children}</div>;
}
