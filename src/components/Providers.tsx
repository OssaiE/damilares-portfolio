"use client";

import { MotionConfig } from "motion/react";
import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";

/**
 * App-wide motion configuration.
 *
 * - `MotionConfig reducedMotion="user"` makes every Motion animation honor the
 *   visitor's prefers-reduced-motion setting (transforms skipped, opacity kept).
 * - `ReactLenis root` is the animation engine for scrolling. On the section-
 *   scrolled pages (Home/Works) its own wheel smoothing stays OFF so the strict
 *   one-section-per-gesture `ScrollController` owns the wheel. On the About
 *   page there's no section controller, so we switch Lenis to smooth-wheel for
 *   a fluid, cinematic free-scroll. Keyed so the instance re-inits on the swap.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const smooth = pathname?.startsWith("/about") ?? false;

  const content = (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );

  // Lenis ONLY on the About page (for its smooth cinematic scroll). Home/Works
  // stay on native scrolling — Lenis's virtual scroll fights CSS scroll-snap, so
  // keeping it off Home is what lets the one-section-at-a-time snap work reliably.
  if (!smooth) return content;

  return (
    <ReactLenis root options={{ smoothWheel: true, syncTouch: false }}>
      {content}
    </ReactLenis>
  );
}
