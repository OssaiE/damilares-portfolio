"use client";

import { motion } from "motion/react";

const spring = { type: "spring", stiffness: 340, damping: 22 } as const;

/**
 * Hamburger that rotates and morphs into an ×. The three bars collapse to the
 * center (middle fades) while the whole glyph spins 180°.
 */
export default function ClapperMenuIcon({ open }: { open: boolean }) {
  const bar =
    "absolute left-1/2 top-1/2 h-[2px] w-[21px] -translate-x-1/2 rounded-full bg-current";
  return (
    <motion.span
      className="relative block h-4 w-[21px]"
      animate={{ rotate: open ? 180 : 0 }}
      transition={spring}
      aria-hidden
    >
      <motion.span
        className={bar}
        initial={false}
        animate={{ y: open ? 0 : -6, rotate: open ? 45 : 0 }}
        transition={spring}
      />
      <motion.span
        className={bar}
        initial={false}
        animate={{ y: 0, opacity: open ? 0 : 1, scaleX: open ? 0.4 : 1 }}
        transition={spring}
      />
      <motion.span
        className={bar}
        initial={false}
        animate={{ y: open ? 0 : 6, rotate: open ? -45 : 0 }}
        transition={spring}
      />
    </motion.span>
  );
}
