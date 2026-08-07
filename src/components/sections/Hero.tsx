"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import FramingGuides from "@/components/ui/FramingGuides";
import MaskedWordmark from "@/components/ui/MaskedWordmark";
import ReelModal from "@/components/ui/ReelModal";
import { hero } from "@/lib/site";

const easeExpo = [0.16, 1, 0.3, 1] as const;

/** Focal-length "lenses" reframe the footage — dramatic zoom + a focus-pull. */
const lensScale: Record<string, number> = {
  "135mm": 1.62,
  "50mm": 1.28,
  "35mm": 1.0,
};

export default function Hero() {
  const [lens, setLens] = useState("135mm");
  const [focusing, setFocusing] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);

  // Dramatic spring zoom + a brief focus-pull blur on each lens switch.
  const changeLens = (l: string) => {
    if (l === lens) return;
    setLens(l);
    setFocusing(true);
  };

  useEffect(() => {
    if (!focusing) return;
    const t = setTimeout(() => setFocusing(false), 220);
    return () => clearTimeout(t);
  }, [focusing, lens]);

  return (
    <>
      <section
        data-cursor="lens"
        data-snap
        onClick={() => setReelOpen(true)}
        aria-label="Showreel"
        className="relative isolate h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink"
      >
        {/* Footage (kept clear — only a focus-pull blur on lens change) */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: lensScale[lens],
            filter: focusing ? "blur(12px)" : "blur(0px)",
          }}
          transition={{
            scale: { type: "spring", stiffness: 90, damping: 12, mass: 0.9 },
            filter: { duration: 0.42, ease: easeExpo },
          }}
        >
          <BackgroundVideo
            mp4="/videos/showreel-bg.mp4"
            poster="/images/hero-poster.jpg"
            position="50% 50%"
          />
        </motion.div>

        {/* Cinematic vignette (edges + bottom) with a clear centre for the reel.
            No z-index anywhere below — DOM order layers these, and the section is
            `isolate`, so the wordmark's exclusion blends against the footage. */}
        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />
        <FramingGuides />

        {/* Content */}
        <div className="relative h-full px-[var(--gutter)]">
          <div className="absolute left-[var(--gutter)] right-[var(--gutter)] top-[53%] max-w-xl md:top-[56%]">
            <motion.p
              className="text-[15px] leading-relaxed text-primary md:text-lg"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: easeExpo }}
            >
              {hero.tagline}
              <span className="caret" aria-hidden />
            </motion.p>
            <motion.p
              className="mt-1 text-[15px] leading-relaxed text-primary/85 md:text-lg"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: easeExpo }}
            >
              {hero.scene}
            </motion.p>

            {/* Lens selector */}
            <motion.div
              role="group"
              aria-label="Lens focal length"
              className="mt-5 flex items-center gap-2.5"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: easeExpo }}
            >
              {hero.lenses.map((l) => {
                const active = l === lens;
                return (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={active}
                    onClick={(e) => {
                      e.stopPropagation();
                      changeLens(l);
                    }}
                    className={`group flex items-center gap-1 rounded-[5px] px-2.5 py-1 font-sans text-[13px] tracking-wide transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active
                        ? "border border-primary/70 text-primary"
                        : "border border-transparent text-primary/55 hover:text-primary"
                    }`}
                  >
                    <span aria-hidden className="opacity-70">
                      [
                    </span>
                    {l}
                    <span aria-hidden className="opacity-70">
                      ]
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Masked wordmark (live negative via mix-blend) — decorative, so it
              never intercepts clicks meant for the chips or the reel trigger */}
          <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-[1.4vh]">
            <MaskedWordmark />
          </div>
        </div>

        {/* Accessible affordance for the click-to-play interaction */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setReelOpen(true);
          }}
          className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--gutter)] focus:top-24 focus:z-30 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-ink"
        >
          Play showreel
        </button>
      </section>

      <ReelModal open={reelOpen} onClose={() => setReelOpen(false)} />
    </>
  );
}
