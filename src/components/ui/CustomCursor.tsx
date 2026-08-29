"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { playClap } from "@/lib/clap";

type Mode = "default" | "hover";

/**
 * Desktop cursor as a camera framing system:
 *   idle   → a small focus box (four corner brackets + centre dot), à la the
 *            framing guides.
 *   hover  → "rack focus": the brackets pull inward and the centre locks to a
 *            ring, like an AF box snapping onto a subject.
 *   click  → "clap snap": the box collapses and rebounds with the clapperboard
 *            clap ("Action!").
 * Disabled for touch + reduced-motion (native cursor left intact).
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

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
      setMode(interactive ? "hover" : "default");
    };
    const leave = () => setVisible(false);
    const down = (e: PointerEvent) => {
      setClicking(true);
      if (e.button === 0) playClap(0.08); // the clapper snap — "Action!"
    };
    const up = () => setClicking(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [x, y]);

  if (!enabled) return null;

  const isHover = mode === "hover";
  const spring = { type: "spring", stiffness: 500, damping: 26 } as const;

  // Box half-size: idle wide, hover pulls focus in, click snaps tight.
  const half = clicking ? 7 : isHover ? 11 : 15;
  const arm = 6; // corner bracket arm length

  const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
    const edges: Record<typeof pos, string> = {
      tl: "left-0 top-0 border-l border-t",
      tr: "right-0 top-0 border-r border-t",
      bl: "left-0 bottom-0 border-l border-b",
      br: "right-0 bottom-0 border-r border-b",
    };
    return (
      <span
        className={`absolute border-white ${edges[pos]}`}
        style={{ width: arm, height: arm }}
      />
    );
  };

  return (
    <motion.div
      aria-hidden
      // z above the intro leader (z-200) so the crosshair still shows on the
      // tap-to-start / countdown screens — the native cursor is hidden there.
      className="pointer-events-none fixed left-0 top-0 z-[210]"
      // A dark drop-shadow (instead of mix-blend-difference) keeps the white
      // crosshair readable over ANY background. Difference-blend mathematically
      // loses all contrast over mid-tones — so the cursor vanished on the hero
      // video and the yellow wordmark, which read as it being "missing".
      style={{
        x: springX,
        y: springY,
        filter:
          "drop-shadow(0 0 1px rgba(0,0,0,0.55)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Focus box — corner brackets tighten on hover / snap on click */}
      <motion.div
        className="absolute"
        style={{ translateX: "-50%", translateY: "-50%" }}
        animate={{ width: half * 2, height: half * 2 }}
        transition={spring}
      >
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
      </motion.div>

      {/* Centre — a dot at rest, locking to a focus ring on hover */}
      <motion.span
        className="absolute rounded-full border-white bg-white"
        style={{ translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHover ? 7 : 3,
          height: isHover ? 7 : 3,
          borderWidth: isHover ? 1 : 0,
          backgroundColor: isHover ? "rgba(255,255,255,0)" : "rgb(255,255,255)",
        }}
        transition={spring}
      />
    </motion.div>
  );
}
