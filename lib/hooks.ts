"use client";

import { useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () => matchMedia(REDUCED).matches;

/** Same as the original: server snapshot is `true` so nothing animates before hydration */
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(REDUCED);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(REDUCED).matches,
    () => true,
  );
}
