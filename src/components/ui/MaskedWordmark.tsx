"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { motion } from "motion/react";
import ParticleText from "@/components/ui/ParticleText";
import { site } from "@/lib/site";

const FONT_SIZE = 200;
const BASELINE = 200;
const LETTER_SPACING = "-0.07em";

/**
 * Oversized "AreyouDami." wordmark. When particle rendering is available it is
 * drawn as a field of yellow particles (see ParticleText) composited with
 * `mix-blend-mode: exclusion` against the footage; the pointer smoothly repels
 * nearby particles. A self-measuring SVG provides the layout box, the accessible
 * label, the entrance reveal, and the fallback on coarse pointers / reduced
 * motion (where it simply renders the solid type).
 */
export default function MaskedWordmark({
  text = site.name,
  as: Tag = "h1",
  reveal,
}: {
  text?: string;
  as?: "h1" | "p" | "span" | "div";
  /** Gates the blur-in entrance. `undefined` → play once on mount (default,
   *  used elsewhere). `true`/`false` → the caller drives it (e.g. the hero
   *  stages it after the copy types in). */
  reveal?: boolean;
} = {}) {
  const rootRef = useRef<HTMLElement>(null);
  const svgTextRef = useRef<SVGTextElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [box, setBox] = useState({ x: 0, y: 40, w: 1580, h: 168 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);

  // Measure the glyph box → full-bleed layout height.
  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      const t = svgTextRef.current;
      if (!t) return;
      try {
        const bb = t.getBBox();
        if (!cancelled && bb.width > 0)
          setBox({ x: bb.x, y: bb.y, w: bb.width, h: bb.height });
      } catch {
        /* not yet rendered */
      }
    };
    measure();
    document.fonts.ready.then(() => !cancelled && measure());
    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Particle field is desktop-only: a fine pointer, no reduced-motion, AND a
  // desktop-width viewport (≥1024px). The width gate keeps it off mobile/tablet
  // even on touch-laptops / hybrids that report a fine pointer — those get the
  // plain solid SVG wordmark instead. Re-evaluated on resize.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setEnabled(fine.matches && wide.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    wide.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      wide.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  // Hover + pointer tracking (no pointer capture, so chips/reel keep their clicks).
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      const interactive = (e.target as HTMLElement | null)?.closest?.(
        "a, button, [role]",
      );
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      setHovering(inside && !interactive);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  const viewBox = `${box.x} ${box.y} ${box.w} ${box.h}`;

  // Caller-driven reveal fades in gently (small blur); the standalone mount
  // reveal keeps the fuller focus-pull blur.
  // Blur-in ("focus pull") entrance in both modes — caller-driven just uses a
  // slightly softer blur/rise than the fuller standalone mount.
  const hidden =
    reveal === undefined
      ? { y: "14%", opacity: 0, filter: "blur(14px)" }
      : { y: "6%", opacity: 0, filter: "blur(12px)" };
  const shown = { y: "0%", opacity: 1, filter: "blur(0px)" };

  return (
    <Tag
      ref={rootRef as Ref<HTMLHeadingElement>}
      className="relative block select-none"
      aria-label={text}
    >
      {/* When the caller drives the entrance (`reveal` defined) it gets a gentle
          fade so it doesn't re-read as the intro's focus-pull; on its own it
          plays the fuller blur-in once on mount. */}
      <motion.div
        // The exclusion blend (live-negative against the footage) is only for
        // the desktop particle field. On mobile/tablet the particles are off
        // and the SVG shows, so we render it as plain solid type instead —
        // exclusion would invert the yellow over bright footage.
        className={`relative block w-full ${enabled ? "[mix-blend-mode:exclusion]" : ""}`}
        initial={hidden}
        animate={reveal === false ? hidden : shown}
        transition={{
          duration: reveal === undefined ? 1.25 : 1.1,
          delay: reveal === undefined ? 0.55 : 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* SVG mirror: layout box + a11y + reveal + fallback. Hidden once the
            particle field is drawing (both are yellow / exclusion, so the
            hand-off is seamless). */}
        <svg
          viewBox={viewBox}
          width="100%"
          role="img"
          aria-label={text}
          preserveAspectRatio="xMidYMax meet"
          className="block h-auto w-full transition-opacity duration-200"
          style={{ opacity: enabled && particlesReady ? 0 : 1 }}
        >
          <text
            ref={svgTextRef}
            x={0}
            y={BASELINE}
            fontSize={FONT_SIZE}
            fontFamily='"Work Sans", "Arial", sans-serif'
            fontWeight={550}
            style={{ letterSpacing: LETTER_SPACING }}
            fill="#ffcc00"
          >
            {text}
          </text>
        </svg>

        {/* Particle field (desktop only) — pointer smoothly repels nearby
            particles. Not mounted at all on mobile/tablet, where the solid SVG
            wordmark above is the final render. */}
        {enabled && (
          <ParticleText
            text={text}
            hovering={hovering}
            enabled={enabled}
            pointer={pointer}
            onReady={() => setParticlesReady(true)}
          />
        )}
      </motion.div>
    </Tag>
  );
}
