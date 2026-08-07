"use client";

import { MotionConfig } from "motion/react";
import { ReactLenis } from "lenis/react";

/**
 * App-wide motion configuration.
 *
 * - `MotionConfig reducedMotion="user"` makes every Motion animation honor the
 *   visitor's prefers-reduced-motion setting (transforms skipped, opacity kept).
 * - `ReactLenis root` is the animation engine for the section scroller
 *   (`ScrollController` drives it via `lenis.scrollTo`). Its own wheel/touch
 *   smoothing is off — scrolling is strictly one section per gesture, not a
 *   free glide — so Lenis never free-scrolls on top of the controller.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        smoothWheel: false,
        syncTouch: false,
      }}
    >
      <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </MotionConfig>
    </ReactLenis>
  );
}
