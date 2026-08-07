"use client";

import { useEffect, useRef, useState } from "react";
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
export default function MaskedWordmark() {
  const rootRef = useRef<HTMLHeadingElement>(null);
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

  // Enable the effect only for fine pointers without reduced-motion.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
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

  return (
    <h1 ref={rootRef} className="relative select-none" aria-label={site.name}>
      <motion.div
        className="relative block w-full [mix-blend-mode:exclusion]"
        initial={{ y: "14%", opacity: 0, filter: "blur(14px)" }}
        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.25, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* SVG mirror: layout box + a11y + reveal + fallback. Hidden once the
            particle field is drawing (both are yellow / exclusion, so the
            hand-off is seamless). */}
        <svg
          viewBox={viewBox}
          width="100%"
          role="img"
          aria-label={site.name}
          preserveAspectRatio="xMidYMax meet"
          className="block h-auto w-full transition-opacity duration-200"
          style={{ opacity: enabled && particlesReady ? 0 : 1 }}
        >
          <text
            ref={svgTextRef}
            x={0}
            y={BASELINE}
            fontSize={FONT_SIZE}
            fontFamily='"Oriya Sangam MN", "Arial Black", sans-serif'
            fontWeight={700}
            style={{ letterSpacing: LETTER_SPACING }}
            fill="#ffcc00"
          >
            {site.name}
          </text>
        </svg>

        {/* Particle field (pointer smoothly repels nearby particles) */}
        <ParticleText
          hovering={hovering}
          enabled={enabled}
          pointer={pointer}
          onReady={() => setParticlesReady(true)}
        />
      </motion.div>
    </h1>
  );
}
