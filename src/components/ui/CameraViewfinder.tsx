"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * A subtle camera-viewfinder overlay shown while the clapperboard drawer is
 * open. Sits above the blurred backdrop, below the menu. Purely decorative
 * (aria-hidden, pointer-events-none): a rule-of-thirds grid, edge framing
 * guides, and a centre autofocus reticle that hunts, then "locks" — with a
 * gentle focus-breathing loop. Fades/blurs away as the drawer snaps shut.
 *
 * Transform/blur keyframes are automatically reduced for prefers-reduced-motion
 * via the app-level <MotionConfig reducedMotion="user">.
 */
export default function CameraViewfinder() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45]"
      initial={{ opacity: 0, filter: "blur(6px)", scale: 1.04 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(5px)", scale: 1.02 }}
      transition={{ duration: 0.6, ease }}
    >
      {/* Rule-of-thirds grid */}
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <g stroke="white" strokeWidth={1} style={{ opacity: 0.13 }}>
          <line x1="33.333%" y1="0" x2="33.333%" y2="100%" />
          <line x1="66.666%" y1="0" x2="66.666%" y2="100%" />
          <line x1="0" y1="33.333%" x2="100%" y2="33.333%" />
          <line x1="0" y1="66.666%" x2="100%" y2="66.666%" />
        </g>
      </svg>

      {/* Edge framing brackets */}
      {(
        [
          "left-6 top-6 border-l border-t",
          "right-6 top-6 border-r border-t",
          "bottom-6 left-6 border-b border-l",
          "bottom-6 right-6 border-b border-r",
        ] as const
      ).map((pos) => (
        <span
          key={pos}
          className={`absolute h-7 w-7 border-white/30 ${pos}`}
        />
      ))}

      {/* Edge centre ticks */}
      <span className="absolute left-1/2 top-6 h-2.5 w-px -translate-x-1/2 bg-white/25" />
      <span className="absolute bottom-6 left-1/2 h-2.5 w-px -translate-x-1/2 bg-white/25" />
      <span className="absolute left-6 top-1/2 h-px w-2.5 -translate-y-1/2 bg-white/25" />
      <span className="absolute right-6 top-1/2 h-px w-2.5 -translate-y-1/2 bg-white/25" />

      {/* Centre autofocus reticle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 1.5, opacity: 0, filter: "blur(7px)" }}
          animate={{
            scale: [1.5, 0.9, 1],
            opacity: [0, 1, 0.85],
            filter: ["blur(7px)", "blur(0px)", "blur(0px)"],
          }}
          exit={{ scale: 1.15, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 1.1, ease, times: [0, 0.72, 1], delay: 0.12 }}
        >
          {/* Focus-breathing loop (starts after the lock) */}
          <motion.div
            className="relative h-[112px] w-[112px] md:h-[150px] md:w-[150px]"
            animate={{ scale: [1, 1.045, 1] }}
            transition={{
              duration: 3.4,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 1.2,
            }}
          >
            {/* AF corner ticks */}
            {(
              [
                "left-0 top-0 border-l border-t",
                "right-0 top-0 border-r border-t",
                "bottom-0 left-0 border-b border-l",
                "bottom-0 right-0 border-b border-r",
              ] as const
            ).map((pos) => (
              <span
                key={pos}
                className={`absolute h-4 w-4 border-white/75 ${pos}`}
              />
            ))}

            {/* Centre crosshair + dot */}
            <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-white/45" />
            <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-white/45" />
            <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />

            {/* Focus-confirm flash (yellow, once, on lock) */}
            <motion.span
              className="absolute -inset-1 rounded-[2px] border border-primary"
              initial={{ opacity: 0, scale: 1.28 }}
              animate={{ opacity: [0, 0.9, 0], scale: [1.28, 1, 1] }}
              transition={{ duration: 0.9, ease, times: [0, 0.6, 1], delay: 0.5 }}
            />
          </motion.div>

          {/* Minimal focus-lock label */}
          <motion.span
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-sans text-[10px] font-medium tracking-[0.35em] text-primary/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7] }}
            transition={{ duration: 0.5, delay: 1, ease }}
          >
            AF
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
