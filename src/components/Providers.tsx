"use client";

import { MotionConfig } from "motion/react";

/**
 * App-wide motion configuration. `reducedMotion="user"` makes every Framer
 * Motion animation automatically honor the visitor's prefers-reduced-motion
 * setting (transforms are skipped, only opacity fades remain).
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
