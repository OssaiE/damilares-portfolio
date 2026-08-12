"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import FramingGuides from "@/components/ui/FramingGuides";
import MaskedWordmark from "@/components/ui/MaskedWordmark";
import ReelModal from "@/components/ui/ReelModal";
import { useIntro } from "@/components/intro/IntroContext";
import { hero } from "@/lib/site";

const easeExpo = [0.16, 1, 0.3, 1] as const;

/** The typed copy, split so the name can be bold-italic mid-type. */
const COPY_LINES: { t: string; bi?: boolean }[][] = [
  [{ t: hero.intro }],
  [{ t: "I'm " }, { t: "Damilare Olawoyin.", bi: true }],
  ...hero.lines.slice(1).map((t) => [{ t }]),
];

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

  // Entrance staging (gated on the intro reveal): type the copy → chips →
  // wordmark. `step` = 0 hidden · 1 typing · 2 chips · 3 wordmark.
  const { revealed } = useIntro();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!revealed) return;
    const t = window.setTimeout(() => setStep(1), 600);
    return () => window.clearTimeout(t);
  }, [revealed]);
  // Camcorder "hold" carries onto the revealed frame and settles the moment the
  // copy starts typing (step ≥ 1).
  const shaking = revealed && step === 0;
  const handleTyped = () => {
    setStep(2);
    window.setTimeout(() => setStep(3), 450);
  };

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
      <motion.section
        data-cursor="lens"
        data-snap
        onClick={() => setReelOpen(true)}
        aria-label="Showreel"
        className="relative isolate h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink"
        animate={{
          x: shaking ? [0, 1.6, -1.1, 1, -1.3, 0.6, 0] : 0,
          y: shaking ? [0, -1.1, 1.3, -0.9, 1, -0.5, 0] : 0,
        }}
        transition={
          shaking
            ? {
                x: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 2.7, repeat: Infinity, ease: "easeInOut" },
              }
            : { duration: 0.5, ease: "easeOut" }
        }
        style={{ willChange: shaking ? "transform" : "auto" }}
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
        {/* Extra edge + bottom darkening so the cinematic vignette clearly reads
            over bright footage and the type stays legible. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(125% 115% at 50% 38%, transparent 42%, rgba(17,17,17,0.62) 100%), linear-gradient(to top, rgba(17,17,17,0.6) 0%, rgba(17,17,17,0) 34%)",
          }}
        />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />
        <FramingGuides />

        {/* Content — copy (left) + lens buttons (right), sitting 16px (gap-4)
            above the wordmark via a bottom-anchored flex column. */}
        <div className="absolute inset-x-[var(--gutter)] bottom-[1.4vh] flex flex-col">
          {/* Copy + lenses start low (over where the wordmark will sit) and get
              lifted to their resting spot as the wordmark blurs in below. */}
          <motion.div
            className="flex items-end justify-between gap-8"
            animate={{ y: step >= 3 ? 0 : "17vw" }}
            transition={{ duration: 1.05, ease: easeExpo }}
          >
            {/* Left — intro + lines, typed in on reveal */}
            <TypedCopy play={step >= 1} onDone={handleTyped} />

            {/* Right — lens selector */}
            <motion.div
              role="group"
              aria-label="Lens focal length"
              className="flex shrink-0 items-center gap-2.5"
              initial={{ opacity: 0, y: 14 }}
              animate={step >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.7, ease: easeExpo }}
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
                    className={`group flex items-center gap-1 rounded-[5px] px-2.5 py-1 font-sans text-[20px] tracking-wide transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
          </motion.div>

          {/* Masked wordmark (live negative via mix-blend) — decorative, so it
              never intercepts clicks meant for the chips or the reel trigger.
              The display font renders the visible letters ~6vw below the box's
              top, so a vw-based negative margin pulls the copy onto them and
              overlaps by ~12px. It drives its own blur-in via `reveal` so the
              wordmark actually blurs up (not a hard pop) as the copy lifts. */}
          <div className="pointer-events-none -mt-[5.4vw]">
            <MaskedWordmark reveal={step >= 3} />
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
      </motion.section>

      <ReelModal open={reelOpen} onClose={() => setReelOpen(false)} />
    </>
  );
}

/** Types the hero copy character-by-character once `play` flips true, with a
 *  blinking caret on the active line. Full height is reserved so nothing jumps
 *  as the lines fill in. Calls `onDone` when the last character lands. */
function TypedCopy({
  play,
  onDone,
}: {
  play: boolean;
  onDone: () => void;
}) {
  const total = COPY_LINES.reduce(
    (a, l) => a + l.reduce((b, s) => b + s.t.length, 0),
    0,
  );
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!play) return;
    setTyped(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= total) {
        window.clearInterval(id);
        onDone();
      }
    }, 26);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  // Which line the caret currently sits on.
  let acc = 0;
  let activeLine = COPY_LINES.length - 1;
  for (let li = 0; li < COPY_LINES.length; li++) {
    const len = COPY_LINES[li].reduce((b, s) => b + s.t.length, 0);
    if (typed <= acc + len) {
      activeLine = li;
      break;
    }
    acc += len;
  }

  let offset = 0;
  return (
    <div className="max-w-2xl">
      {COPY_LINES.map((segs, li) => {
        const parts = segs.map((s, si) => {
          const start = offset;
          offset += s.t.length;
          const shown = Math.max(0, Math.min(s.t.length, typed - start));
          return (
            <span key={si} className={s.bi ? "font-bold italic" : undefined}>
              {s.t.slice(0, shown)}
            </span>
          );
        });
        const gap = li === 0 ? "" : li === 1 ? "mt-3" : "mt-0.5";
        return (
          <p
            key={li}
            className={`min-h-[1.4em] text-[24px] leading-snug text-primary ${gap}`}
          >
            {parts}
            {play && typed < total && li === activeLine && (
              <span className="caret" aria-hidden />
            )}
          </p>
        );
      })}
    </div>
  );
}
