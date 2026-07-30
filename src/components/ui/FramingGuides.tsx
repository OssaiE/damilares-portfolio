"use client";

import { motion } from "motion/react";

/**
 * Subtle viewfinder framing: thin vertical rule guides + a focus reticle with
 * corner brackets. Purely decorative — hidden from assistive tech and disabled
 * for reduced-motion users (rendered static instead of animating in).
 */
export default function FramingGuides({
  reticle = true,
}: {
  reticle?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Vertical thirds guides */}
      {[0.28, 0.72].map((x, i) => (
        <motion.span
          key={x}
          className="absolute top-0 h-full w-px bg-primary/15"
          style={{ left: `${x * 100}%` }}
          initial={{ scaleY: 0, transformOrigin: "top" }}
          animate={{ scaleY: 1 }}
          transition={{
            duration: 1.4,
            delay: 0.4 + i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}

      {reticle && (
        <motion.div
          className="absolute left-[6%] top-[16%] hidden h-[62%] w-[62%] md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          {(
            [
              "left-0 top-0 border-l border-t",
              "right-0 top-0 border-r border-t",
              "left-0 bottom-0 border-l border-b",
              "right-0 bottom-0 border-r border-b",
            ] as const
          ).map((pos) => (
            <span
              key={pos}
              className={`absolute h-5 w-5 border-primary/40 ${pos}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
