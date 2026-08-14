"use client";

import { useEffect, useRef, useState } from "react";
import SiteChrome from "@/components/SiteChrome";
import Footer from "@/components/layout/Footer";
import GridBackdrop from "@/components/works/GridBackdrop";
import { about, site, type GalleryShot } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * About — a two-chapter "documentary".
 *
 *   Chapter 1 · Based on a True Story  — a fixed centre portrait with the
 *     oversized outlined AreyouDami. behind it; scroll rolls the credits
 *     upward like an end-credits sequence.
 *   Transition — the portrait/credits cross-dissolve out as the gallery
 *     eases in (a soft "camera move", no hard cut).
 *   Chapter 2 · The Creative in His Element — vertical scroll is translated
 *     into smooth horizontal gallery movement; hover reveals role/location.
 *
 * Everything runs off ONE fixed stage driven by the scroll position (a tall
 * spacer supplies the scroll length), so it needs no scroll hijacking and the
 * header stays live throughout. Desktop + motion only; smaller screens and
 * reduced-motion get a clean, natural vertical fallback.
 * ------------------------------------------------------------------ */

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
};

export default function AboutExperience() {
  const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 768px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCinematic(mqWide.matches && !mqReduce.matches);
    update();
    mqWide.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mqWide.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);

  return (
    <>
      <SiteChrome
        topRight={
          <span className="inline-flex h-14 items-center text-base font-medium text-primary">
            About.
          </span>
        }
      />
      {cinematic ? <Cinematic /> : <Fallback />}
    </>
  );
}

/* ------------------------------- shared ------------------------------ */

/* Identical glyph metrics for both stage wordmarks so the outlined copy over
 * the picture lines up pixel-for-pixel with the solid one behind it. */
const WORDMARK_METRICS =
  "block whitespace-nowrap font-display font-bold leading-none tracking-[-0.02em] text-[16vw]";

function OutlinedWordmark({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      <span
        className="block whitespace-nowrap font-display font-bold leading-none tracking-[-0.03em] text-[19vw]"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(255, 204, 0, 0.22)",
        }}
      >
        {site.name}
      </span>
    </div>
  );
}

function GalleryFrame({ shot }: { shot: GalleryShot }) {
  return (
    <figure
      tabIndex={0}
      style={{ aspectRatio: shot.aspect }}
      className="group relative h-full shrink-0 overflow-hidden bg-ink outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot.src}
        alt={`${shot.action} — ${shot.role}`}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover"
      />

      {/* Black overlay + caption — fade in centred on hover / focus only.
          Top: what he's doing (Inter regular 20). Below: role (Inter semibold 24). */}
      <figcaption className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-ink/0 p-6 text-center opacity-0 transition-[opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-ink/55 group-hover:opacity-100 group-focus-visible:bg-ink/55 group-focus-visible:opacity-100">
        <p className="font-sans text-xl font-normal leading-snug text-primary/80 [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">
          {shot.action}
        </p>
        <p className="font-sans text-2xl font-semibold leading-snug text-primary [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">
          {shot.role}
        </p>
      </figcaption>
    </figure>
  );
}

/* ---------------------------- cinematic ----------------------------- */

function Cinematic() {
  const chapterOneRef = useRef<HTMLDivElement>(null); // portrait + wordmark layer
  const creditsRef = useRef<HTMLDivElement>(null);
  const galleryLayerRef = useRef<HTMLDivElement>(null);
  const galleryRowRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const metrics = useRef({ creditsPx: 1, galleryPx: 0, travel: 1, startY: 0 });
  const [spacerH, setSpacerH] = useState("300vh");

  // Intro reveal — wordmark types in → portrait wipes open from the middle → bio
  // rises. `typed` counts the wordmark characters; `phase` gates each stage.
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  useEffect(() => {
    const full = site.name.length;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= full) {
        window.clearInterval(id);
        window.setTimeout(() => setPhase(1), 240);
      }
    }, 90);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (phase !== 1) return;
    const t = window.setTimeout(() => setPhase(2), 640);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Measure the credits height + gallery width → scroll length.
  useEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const creditsH = creditsRef.current?.scrollHeight ?? vh * 3;
      const galleryW = galleryRowRef.current?.scrollWidth ?? vw;
      // Opening title starts near centre, then everything rolls fully off the top.
      const startY = vh * 0.38;
      const travel = creditsH + startY + vh * 0.2;
      const creditsPx = travel; // ~1:1 scroll → roll speed
      // Full-bleed horizontal reel: vertical scroll → sideways, last frame rests.
      const galleryPx = Math.max(galleryW - vw, 0);
      metrics.current = { creditsPx, galleryPx, travel, startY };
      setSpacerH(`${Math.round(creditsPx + galleryPx + vh)}px`);
    };
    measure();
    const t = setTimeout(measure, 350);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Scroll driver — one rAF, softened follow, maps scroll → the whole sequence.
  useEffect(() => {
    let raf = 0;
    let smooth = window.scrollY;
    const frame = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      smooth += (window.scrollY - smooth) * 0.11;
      if (Math.abs(window.scrollY - smooth) < 0.3) smooth = window.scrollY;

      const { creditsPx, galleryPx, travel, startY } = metrics.current;
      const s = smooth;

      // Credits roll upward: opening title holds near centre, then everything
      // continues off the top as new scenes rise from below.
      const credits = creditsRef.current;
      if (credits) {
        const cp = clamp(s / creditsPx, 0, 1);
        const y = startY - cp * travel;
        credits.style.transform = `translate3d(-50%, ${y.toFixed(1)}px, 0)`;
      }

      // Cross-dissolve around the end of the credits (a soft camera move).
      const trans = vh * 0.7;
      const te = smoothstep((s - (creditsPx - trans)) / trans);

      const chapterOne = chapterOneRef.current;
      if (chapterOne) chapterOne.style.opacity = (1 - te).toFixed(3);
      if (credits) credits.style.opacity = (1 - te).toFixed(3);

      // Dark overlay deepens as soon as the scroll starts, so the bio reads over
      // the portrait. Eases back out with the cross-dissolve into Chapter 2.
      const scrim = scrimRef.current;
      if (scrim) {
        scrim.style.opacity = (clamp(s / (vh * 0.5), 0, 0.5) * (1 - te)).toFixed(3);
      }

      // Gallery eases in (slight slide from the right) then scrolls horizontally.
      const galleryLayer = galleryLayerRef.current;
      const galleryRow = galleryRowRef.current;
      if (galleryLayer && galleryRow) {
        galleryLayer.style.opacity = te.toFixed(3);
        galleryLayer.style.pointerEvents = te > 0.6 ? "auto" : "none";
        const gs = clamp(s - creditsPx, 0, galleryPx);
        const enter = lerp(vw * 0.05, 0, te); // soft sideways settle on entry
        galleryRow.style.transform = `translate3d(${(enter - gs).toFixed(1)}px, 0, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* Fixed stage — background, portrait, credits, gallery all live here. */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-ink">
        <GridBackdrop />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.06]" />

        {/* Chapter 1 — solid wordmark behind · full-height portrait ·
            outlined wordmark clipped over the picture (aligned to the one behind) */}
        <div ref={chapterOneRef} className="absolute inset-0">
          {/* (a) solid, bold wordmark — types in bright, then settles to a faint
              watermark behind the picture. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none overflow-hidden text-center transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: phase >= 1 ? 0.1 : 0.42 }}
          >
            <span className={WORDMARK_METRICS} style={{ color: "#FFCC00" }}>
              {site.name.slice(0, typed)}
              {phase === 0 && (
                <span className="[animation:caret-blink_1s_infinite]">|</span>
              )}
            </span>
          </div>

          {/* (b) full-height portrait, centred — wipes open from the middle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative h-screen w-auto transition-[opacity,transform,clip-path] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                aspectRatio: "3 / 4",
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? "scale(1)" : "scale(1.06)",
                clipPath: phase >= 1 ? "inset(0% 0 0% 0)" : "inset(50% 0 50% 0)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.portrait}
                alt={`${site.creator}, ${site.role}`}
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="vignette pointer-events-none absolute inset-0" />

              {/* (c) outlined wordmark — same metrics, centred on the viewport,
                  then clipped to the image box so the outline shows only over the
                  picture and registers exactly with the solid wordmark behind. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 select-none overflow-hidden"
              >
                <div className="absolute left-1/2 top-1/2 w-screen -translate-x-1/2 -translate-y-1/2 text-center">
                  <span
                    className={WORDMARK_METRICS}
                    style={{
                      color: "transparent",
                      WebkitTextStroke: "1.5px rgba(255, 204, 0, 0.55)",
                    }}
                  >
                    {site.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll-in dark overlay — deepens as you scroll so the bio reads.
              Above the portrait/wordmark, below the credits (a separate layer). */}
          <div
            ref={scrimRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-ink"
            style={{ opacity: 0 }}
          />
        </div>

        {/* Credits — roll upward over the portrait, centred, width-capped */}
        <div
          ref={creditsRef}
          className="absolute left-1/2 top-0 w-[min(46vw,40rem)] text-center"
          style={{ transform: "translate3d(-50%, 38vh, 0)" }}
        >
          <div
            className="transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <h1 className="mb-[7vh] font-sans text-8xl font-extrabold leading-[0.9] tracking-[-0.02em] text-primary [text-shadow:0_2px_28px_rgba(0,0,0,0.65)]">
              {about.chapterOne}
            </h1>

            {about.bio.map((para, i) => {
              const last = i === about.bio.length - 1;
              if (last) {
                // The mission — set like a quote pulled from a screenplay.
                return (
                  <figure key={i} className="mx-auto mb-[16vh] mt-[4vh] max-w-[44ch]">
                    <blockquote className="text-lg italic leading-relaxed text-primary [text-shadow:0_2px_24px_rgba(0,0,0,0.75)] [font-family:'Courier_New',ui-monospace,monospace] md:text-xl">
                      “{para}”
                    </blockquote>
                    <figcaption className="mt-4 text-xs uppercase tracking-[0.28em] text-primary/70 [font-family:'Courier_New',ui-monospace,monospace]">
                      — Damilare
                    </figcaption>
                  </figure>
                );
              }
              return (
                <p
                  key={i}
                  className="mx-auto mb-[9vh] max-w-[42ch] font-sans text-base leading-relaxed text-primary/90 [text-shadow:0_2px_24px_rgba(0,0,0,0.75)] md:text-lg"
                >
                  {para}
                </p>
              );
            })}
          </div>
        </div>

        {/* Chapter 2 — layered stage:
            (z-0) full-bleed photo reel · (z-10) vignette · (z-20) pinned title */}
        <div
          ref={galleryLayerRef}
          className="absolute inset-0 opacity-0"
          style={{ pointerEvents: "none" }}
        >
          {/* Horizontal photo reel — full-bleed frames, edge to edge, no gaps */}
          <div
            ref={galleryRowRef}
            className="absolute inset-0 z-0 flex"
            style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
          >
            {about.gallery.map((shot, i) => (
              <GalleryFrame key={i} shot={shot} />
            ))}
          </div>

          {/* Vignette — above the photos, below the title */}
          <div className="vignette pointer-events-none absolute inset-0 z-10" />

          {/* Pinned title — on top, fixed to the bottom edge as the reel scrolls */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-[var(--gutter)] pb-14 md:pb-20">
            <p className="font-sans text-xs uppercase tracking-[0.22em] text-primary/85 md:text-sm">
              Chapter Two
            </p>
            <h2 className="mt-3 max-w-[16ch] font-sans text-8xl font-extrabold leading-[0.9] tracking-[-0.02em] text-primary [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]">
              {about.chapterTwo}
            </h2>
          </div>
        </div>
      </div>

      {/* Scroll length */}
      <div aria-hidden style={{ height: spacerH }} />

      {/* Footer — rides above the fixed stage (z-30) so it slides up and
          "pops out" over the resting last frame at the end of the scroll.
          Full-bleed + vertically centred so it lands as a centred full page. */}
      <div className="relative z-30 flex min-h-screen flex-col justify-center bg-ink">
        <Footer />
      </div>

      {/* Accessible, static copy of the narrative for AT / no-JS crawlers */}
      <div className="sr-only">
        <h1>
          {site.name} — {about.chapterOne}
        </h1>
        {about.bio.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <h2>{about.chapterTwo}</h2>
        <ul>
          {about.gallery.map((shot, i) => (
            <li key={i}>
              {shot.action} — {shot.role}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ------------- fallback: natural vertical page (mobile / RM) ---------- */

function Fallback() {
  return (
    <div className="relative min-h-screen bg-ink">
      <GridBackdrop />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />

      <main id="main" className="relative z-10">
        {/* Portrait + wordmark */}
        <section className="relative flex min-h-[86vh] items-center justify-center overflow-hidden px-[var(--gutter)] pt-[140px]">
          <OutlinedWordmark className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center" />
          <div
            className="relative w-full max-w-[380px]"
            style={{ aspectRatio: "3 / 4" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={about.portrait}
              alt={`${site.creator}, ${site.role}`}
              className="h-full w-full object-cover"
            />
            <div className="vignette pointer-events-none absolute inset-0" />
          </div>
        </section>

        {/* Chapter 1 — narrative */}
        <section className="mx-auto max-w-[36rem] px-[var(--gutter)] py-16 text-center">
          <h1 className="font-sans text-[clamp(2.5rem,12vw,4rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-primary">
            {about.chapterOne}
          </h1>
          <div className="mt-8 space-y-6 text-left">
            {about.bio.map((para, i) => {
              const last = i === about.bio.length - 1;
              return (
                <p
                  key={i}
                  className={`font-sans leading-relaxed ${
                    last
                      ? "text-lg font-medium italic text-primary [font-family:'Courier_New',ui-monospace,monospace]"
                      : "text-base text-primary/90"
                  }`}
                >
                  {para}
                </p>
              );
            })}
          </div>
        </section>

        {/* Chapter 2 — full-bleed horizontal reel (native scroll, no spacing) */}
        <section className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]">
          {about.gallery.map((shot, i) => (
            <figure
              key={i}
              className="relative h-[100svh] w-screen shrink-0 snap-center overflow-hidden bg-ink"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={`${shot.action} — ${shot.role}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {i === 0 ? (
                <figcaption className="absolute inset-x-0 bottom-0 p-[var(--gutter)] pb-14">
                  <p className="font-sans text-xs uppercase tracking-[0.22em] text-primary/85">
                    Chapter Two
                  </p>
                  <h2 className="mt-2 max-w-[12ch] font-sans text-[clamp(2rem,10vw,3.25rem)] font-bold leading-[0.98] tracking-[-0.02em] text-primary [text-shadow:0_2px_28px_rgba(0,0,0,0.6)]">
                    {about.chapterTwo}
                  </h2>
                </figcaption>
              ) : (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-[var(--gutter)] pb-10">
                  <p className="font-sans text-xl font-normal text-primary/80">
                    {shot.action}
                  </p>
                  <p className="mt-0.5 font-sans text-2xl font-semibold text-primary">
                    {shot.role}
                  </p>
                </figcaption>
              )}
            </figure>
          ))}
        </section>

        <Footer />
      </main>
    </div>
  );
}
