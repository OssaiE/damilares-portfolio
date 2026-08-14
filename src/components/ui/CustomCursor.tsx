"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type Mode = "default" | "hover" | "lens";

/**
 * Desktop cursor. A soft trailing ring by default, growing over interactive
 * elements, and morphing into a camera-lens reticle (with a "SHOWREEL" hint)
 * over the hero, signalling that a click plays the reel. Disabled for touch +
 * reduced-motion (native cursor left intact).
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = e.target as HTMLElement | null;
      const interactive = el?.closest(
        'a, button, [role="slider"], [role="button"], input, textarea, [data-cursor="hover"]',
      );
      const lensZone = el?.closest('[data-cursor="lens"]');
      setMode(interactive ? "hover" : lensZone ? "lens" : "default");
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [x, y]);

  if (!enabled) return null;

  const isLens = mode === "lens";
  const isHover = mode === "hover";
  const spring = { type: "spring", stiffness: 400, damping: 28 } as const;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] mix-blend-difference"
      style={{ x: springX, y: springY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Ring (default / interactive) */}
      <motion.div
        className="absolute rounded-full border border-white"
        style={{ translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHover ? 46 : 22,
          height: isHover ? 46 : 22,
          opacity: isLens ? 0 : 1,
          backgroundColor: isHover
            ? "rgba(255,255,255,0.12)"
            : "rgba(255,255,255,0)",
        }}
        transition={spring}
      />

      {/* Lens reticle (over the hero) */}
      <motion.div
        className="absolute flex flex-col items-center gap-2"
        style={{ translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: isLens ? 1 : 0, scale: isLens ? 1 : 0.5 }}
        transition={spring}
      >
        <div className="relative h-[76px] w-[76px]">
          <motion.span
            className="absolute inset-0 rounded-full border border-white"
            animate={{ rotate: isLens ? 360 : 0 }}
            transition={{
              duration: 14,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* aperture ticks */}
            {[0, 90, 180, 270].map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-white/80"
                style={{
                  transformOrigin: "center 38px",
                  transform: `rotate(${deg}deg)`,
                }}
              />
            ))}
          </motion.span>
          <span className="absolute inset-[11px] rounded-full border border-white/45" />
          {/* play triangle */}
          <span
            className="absolute left-1/2 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-l-[10px] border-y-transparent border-l-white"
            style={{ transform: "translate(-30%, -50%)" }}
          />
        </div>
        <span className="font-sans text-xs font-medium tracking-[0.32em] text-white">
          SHOWREEL
        </span>
      </motion.div>
    </motion.div>
  );
}
