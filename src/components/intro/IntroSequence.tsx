"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useIntro } from "./IntroContext";

/* ------------------------------------------------------------------ *
 * Landing entrance — a film "leader" countdown then a camera viewfinder.
 *
 *   3 · 2 · 1      → oversized film / sonar leader: hairline rings, crosshair
 *                    and ticks over a rule-of-thirds grid + noise, yellow digit.
 *   Camera         → a yellow viewfinder (thirds, reticle, REC, "Action").
 *   Reveal         → the black irises open from the CENTRE while the hero hunts
 *                    for focus. The recording frame does NOT vanish: it shrinks
 *                    into a small nav-like box, then fades once the lens settles
 *                    and the copy begins typing.
 *
 * Fires `reveal()` the instant the iris begins so the hero stages its own
 * entrance. Skipped entirely under reduced-motion.
 * ------------------------------------------------------------------ */

type Stage = "count" | "camera" | "reveal" | "gone";

const EASE_INOUT = [0.76, 0, 0.24, 1] as const;

const GRID = "#18191A"; // rule-of-thirds grid
const SONAR = "#55575A"; // sonar rings / ticks / crosshair

export default function IntroSequence() {
  const { reveal } = useIntro();
  const [stage, setStage] = useState<Stage>("count");
  // Starts at 0 (no digit) — the "3" pops in on the clip's first beep.
  const [n, setN] = useState(0);
  // Touch devices (phones/tablets) still play the intro, but in a "lite" mode
  // that drops the animated backdrop-filter blur focus-hunt — that blur
  // compositing is what can lock up mobile Safari on a single frame. The
  // countdown, camera viewfinder and iris reveal all still run.
  const [lite, setLite] = useState(false);

  useEffect(() => {
    // Only reduced-motion skips the cinematic intro entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      setStage("gone");
      return;
    }
    setLite(window.matchMedia("(pointer: coarse)").matches);

    // Countdown sound — the provided clip, played as the leader counts 3·2·1.
    // Best-effort: browsers may block audio until the visitor interacts.
    const audio = new Audio("/audio/countdown.mp3");
    audio.volume = 0.8;
    audio.play().catch(() => {});

    // Timeline synced to the clip's beeps: 3·2·1 pop on the beeps at 0.71 /
    // 1.71 / 2.71 s, and "Action" lands on the final beep at 3.71 s.
    const t: number[] = [];
    t.push(window.setTimeout(() => setN(3), 710));
    t.push(window.setTimeout(() => setN(2), 1710));
    t.push(window.setTimeout(() => setN(1), 2710));
    t.push(window.setTimeout(() => setStage("camera"), 3710));
    t.push(
      window.setTimeout(() => {
        setStage("reveal");
        reveal();
      }, 4600),
    );
    t.push(window.setTimeout(() => setStage("gone"), 6350));
    return () => {
      t.forEach((id) => window.clearTimeout(id));
      audio.pause();
    };
  }, [reveal]);

  if (stage === "gone") return null;
  const revealing = stage === "reveal";
  // Gentle camcorder "hold" — a small positional drift + correct (not a shake)
  // while the viewfinder is up and the page irises open.
  const holding = stage === "camera" || revealing;

  return (
    <motion.div
      className="pointer-events-none fixed -inset-2 z-[200]"
      aria-hidden
      animate={{
        x: stage === "camera" ? [0, 2, -1.4, 1, -1, 0.5, 0] : 0,
        y: stage === "camera" ? [0, -1.4, 1, -1, 1.4, -0.5, 0] : 0,
      }}
      transition={{
        x: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 3.1, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {/* The black itself — a solid black leader that also masks the countdown /
          viewfinder. The circular aperture (var(--iris) = the hole's radius) is
          applied ONLY during the reveal, so the count + camera phases are an
          unmasked, guaranteed-opaque black on every engine. (A masked gradient
          could render partly transparent on mobile Safari/Chrome and leak the
          page through below the countdown.) --iris is registered via @property
          so the hole resolves + animates reliably on WebKit. */}
      <motion.div
        className="absolute inset-0 bg-ink"
        style={
          revealing
            ? {
                ["--iris" as string]: "0%",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 50%, transparent calc(var(--iris) - 7%), #000 var(--iris))",
                maskImage:
                  "radial-gradient(circle at 50% 50%, transparent calc(var(--iris) - 7%), #000 var(--iris))",
              }
            : undefined
        }
        initial={false}
        animate={revealing ? { ["--iris" as string]: "120%" } : {}}
        transition={{ duration: 1.15, ease: EASE_INOUT }}
      />

      {/* Camera focus-hunt: blurs the opening circle, nudges toward sharp,
          drifts back, then locks — how a lens pulls focus before recording.
          Skipped in lite (touch) mode — the animated backdrop-filter blur is
          the layer that can freeze mobile Safari. */}
      {revealing && !lite && (
        <motion.div
          className="absolute inset-0"
          initial={{ backdropFilter: "blur(24px)" }}
          animate={{
            backdropFilter: [
              "blur(24px)",
              "blur(4px)",
              "blur(13px)",
              "blur(1px)",
              "blur(0px)",
            ],
          }}
          transition={{ duration: 1.4, times: [0, 0.4, 0.62, 0.85, 1], ease: "easeInOut" }}
        />
      )}

      {/* A faint aperture ring riding the edge of the opening circle. */}
      {revealing && (
        <motion.div
          className="absolute left-1/2 top-1/2 aspect-square w-[8vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50"
          initial={{ scale: 0, opacity: 0.55 }}
          animate={{ scale: 32, opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE_INOUT }}
        />
      )}

      {/* Overlay content (noise · grid · centrepiece). Fades as the iris opens. */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: revealing ? 0 : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Film noise across the whole leader. */}
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-screen" />

        {/* Countdown only during the count; the camera grid holds through the
            reveal so "Action" fades out with the overlay (otherwise the ternary
            falls back to the countdown and flashes the last digit, "1"). */}
        {stage === "count" ? <Countdown n={n} /> : <CameraGrid />}
      </motion.div>

      {/* Recording frame — persists through the reveal (does NOT fade with the
          content), shrinks to a small nav-like box, then fades out. */}
      {holding && <RecordingFrame revealing={revealing} />}
    </motion.div>
  );
}

/* ------------------------- film-leader countdown ------------------------- */

function Countdown({ n }: { n: number }) {
  return (
    <>
      {/* Rule-of-thirds cross grid — hairline (1px). */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute inset-y-0 left-1/3 w-px" style={{ background: GRID }} />
        <span className="absolute inset-y-0 left-2/3 w-px" style={{ background: GRID }} />
        <span className="absolute inset-x-0 top-1/3 h-px" style={{ background: GRID }} />
        <span className="absolute inset-x-0 top-2/3 h-px" style={{ background: GRID }} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[64vmin] w-[64vmin]">
          {/* Radar / sonar sweep behind the number */}
          <motion.div
            key={`sweep-${n}`}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from -90deg, rgba(85,87,90,0.30), rgba(85,87,90,0) 80deg, rgba(85,87,90,0) 360deg)",
            }}
            initial={{ rotate: -90 }}
            animate={{ rotate: 270 }}
            transition={{ duration: 0.85, ease: "linear" }}
          />

          {/* Rings · crosshair · tick marks — all hairline (1px, non-scaling). */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
            <circle cx="100" cy="100" r="98" fill="none" stroke={SONAR} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <circle cx="100" cy="100" r="68" fill="none" stroke={SONAR} strokeOpacity={0.7} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <circle cx="100" cy="100" r="40" fill="none" stroke={SONAR} strokeOpacity={0.5} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <line x1="100" y1="1" x2="100" y2="199" stroke={SONAR} strokeOpacity={0.6} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <line x1="1" y1="100" x2="199" y2="100" stroke={SONAR} strokeOpacity={0.6} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            {Array.from({ length: 60 }).map((_, i) => {
              const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
              const long = i % 5 === 0;
              const r1 = 98;
              const r2 = long ? 87 : 93;
              // toFixed keeps the string identical on server + client (no
              // hydration mismatch from float precision).
              const cos = Math.cos(a);
              const sin = Math.sin(a);
              return (
                <line
                  key={i}
                  x1={(100 + r1 * cos).toFixed(2)}
                  y1={(100 + r1 * sin).toFixed(2)}
                  x2={(100 + r2 * cos).toFixed(2)}
                  y2={(100 + r2 * sin).toFixed(2)}
                  stroke={SONAR}
                  strokeOpacity={long ? 0.9 : 0.5}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {n > 0 && (
                <motion.span
                  key={n}
                  className="font-display text-[26vmin] font-bold leading-none text-primary [text-shadow:0_2px_40px_rgba(0,0,0,0.5)]"
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {n}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

/* --------------------------- camera viewfinder --------------------------- */

const BRACKETS = [
  "left-0 top-0 border-l border-t",
  "right-0 top-0 border-r border-t",
  "left-0 bottom-0 border-l border-b",
  "right-0 bottom-0 border-r border-b",
] as const;

/** The recording frame's corner brackets. Lives in its own persistent layer so
 *  it survives the reveal, then travels/shrinks to a small nav-like box. */
function RecordingFrame({ revealing }: { revealing: boolean }) {
  // Inset in vmin (same unit as the corner labels) so the brackets sit inside
  // the REC / timecode / lens / label text on every aspect ratio — the widest
  // label (the lens readout) reaches ~19vmin from the edge.
  const full = { top: "9vmin", left: "21vmin", right: "21vmin", bottom: "9vmin" };
  // A small box centred on screen (like a focus box) — not tucked in a corner.
  const box = { top: "43vh", left: "41vw", right: "41vw", bottom: "43vh" };
  return (
    <motion.div
      className="pointer-events-none absolute"
      initial={{ opacity: 0, ...full }}
      animate={
        revealing ? { opacity: [1, 1, 0], ...box } : { opacity: 1, ...full }
      }
      transition={{
        opacity: revealing
          ? { duration: 1.7, times: [0, 0.78, 1], ease: "easeInOut" }
          : { duration: 0.3, ease: "easeOut" },
        top: { duration: 0.9, ease: EASE_INOUT },
        left: { duration: 0.9, ease: EASE_INOUT },
        right: { duration: 0.9, ease: EASE_INOUT },
        bottom: { duration: 0.9, ease: EASE_INOUT },
      }}
    >
      {BRACKETS.map((p) => (
        <span
          key={p}
          className={`absolute h-[2.6vmin] w-[2.6vmin] border-primary ${p}`}
        />
      ))}
    </motion.div>
  );
}

function CameraGrid() {
  return (
    <motion.div
      className="absolute inset-0 text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {/* rule-of-thirds (yellow) */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute inset-y-0 left-1/3 w-px bg-primary/25" />
        <span className="absolute inset-y-0 left-2/3 w-px bg-primary/25" />
        <span className="absolute inset-x-0 top-1/3 h-px bg-primary/25" />
        <span className="absolute inset-x-0 top-2/3 h-px bg-primary/25" />
      </div>

      {/* centre — crosshair + the director's call */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-[3vmin]">
        <div className="relative h-[7vmin] w-[7vmin]">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/50" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary/50" />
          <span className="absolute inset-[34%] rounded-full border border-primary/60" />
        </div>
        <motion.span
          className="font-display text-[8vmin] font-bold leading-none tracking-[0.02em]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          Action
        </motion.span>
      </div>

      {/* REC (blinking) */}
      <div className="absolute left-[6vmin] top-[6vmin] flex items-center gap-[1.2vmin] font-sans text-[1.6vmin] font-medium tracking-[0.3em]">
        <motion.span
          className="h-[1.4vmin] w-[1.4vmin] rounded-full bg-primary"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
        REC
      </div>

      {/* timecode */}
      <div className="absolute right-[6vmin] top-[6vmin] font-sans text-[1.6vmin] tracking-[0.25em] text-primary/85">
        00:00:00
      </div>

      {/* labels */}
      <div className="absolute bottom-[5.5vmin] left-1/2 -translate-x-1/2 font-display text-[3.2vmin] font-bold tracking-[-0.07em]">
        AreyouDami.
      </div>
      <div className="absolute bottom-[6vmin] right-[6vmin] font-sans text-[1.6vmin] tracking-[0.25em] text-primary/85">
        35mm · f2.8
      </div>
    </motion.div>
  );
}
