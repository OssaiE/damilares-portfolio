"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import SiteChrome from "@/components/SiteChrome";
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
          <span className="inline-flex h-14 items-center text-[15px] font-medium text-primary">
            About.
          </span>
        }
      />
      {cinematic ? <Cinematic /> : <Fallback />}
    </>
  );
}

/* ------------------------------- shared ------------------------------ */

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

function GalleryFrame({
  shot,
  first = false,
}: {
  shot: GalleryShot;
  first?: boolean;
}) {
  return (
    <figure
      tabIndex={0}
      className="group relative h-screen w-screen shrink-0 overflow-hidden bg-ink outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot.src}
        alt={`${shot.role} — ${shot.location}`}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover"
      />

      {first ? (
        /* Opening frame carries the chapter title (bottom-left). */
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-[var(--gutter)] pb-14 md:pb-20">
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-primary/85 md:text-sm">
            Chapter Two
          </p>
          <h2 className="mt-3 max-w-[14ch] font-sans text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-primary [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]">
            {about.chapterTwo}
          </h2>
        </figcaption>
      ) : (
        /* Black overlay + metadata — fade in on hover / focus only */
        <figcaption className="pointer-events-none absolute inset-0 flex flex-col items-start justify-end bg-ink/0 p-[var(--gutter)] pb-14 opacity-0 transition-[opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-ink/60 group-hover:opacity-100 group-focus-visible:bg-ink/60 group-focus-visible:opacity-100 md:pb-20">
          <p className="font-sans text-3xl font-semibold leading-tight text-paper md:text-4xl">
            {shot.role}
          </p>
          <p className="mt-2 font-sans text-base text-paper/80 md:text-lg">
            {shot.location}
          </p>
          {(shot.project || shot.year) && (
            <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.18em] text-primary">
              {[shot.project, shot.year].filter(Boolean).join(" · ")}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/* ---------------------------- cinematic ----------------------------- */

function Cinematic() {
  const chapterOneRef = useRef<HTMLDivElement>(null); // portrait + wordmark layer
  const creditsRef = useRef<HTMLDivElement>(null);
  const galleryLayerRef = useRef<HTMLDivElement>(null);
  const galleryRowRef = useRef<HTMLDivElement>(null);
  const metrics = useRef({ creditsPx: 1, galleryPx: 0, travel: 1, startY: 0 });
  const [spacerH, setSpacerH] = useState("300vh");

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

        {/* Chapter 1 — outlined wordmark + static portrait */}
        <div ref={chapterOneRef} className="absolute inset-0">
          <OutlinedWordmark className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[82vh] w-auto" style={{ aspectRatio: "3 / 4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.portrait}
                alt={`${site.creator}, ${site.role}`}
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="vignette pointer-events-none absolute inset-0" />
            </div>
          </div>
        </div>

        {/* Credits — roll upward over the portrait, centred, width-capped */}
        <div
          ref={creditsRef}
          className="absolute left-1/2 top-0 w-[min(46vw,40rem)] text-center"
          style={{ transform: "translate3d(-50%, 38vh, 0)" }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-[40vh] font-sans text-[clamp(2.25rem,4.6vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.02em] text-primary [text-shadow:0_2px_28px_rgba(0,0,0,0.65)]"
          >
            {about.chapterOne}
          </motion.h1>

          {about.credits.map((c, i) => (
            <div
              key={i}
              className="mb-[42vh] [text-shadow:0_2px_24px_rgba(0,0,0,0.7)]"
            >
              <p className="font-sans text-lg font-semibold tracking-wide text-primary md:text-xl">
                {c.scene}
              </p>
              <p className="mx-auto mt-4 max-w-[34ch] font-sans text-[15px] leading-relaxed text-primary/85 md:text-base">
                {c.body}
              </p>
            </div>
          ))}
        </div>

        {/* Chapter 2 — full-bleed vertical reel (scroll-driven translateY) */}
        <div
          ref={galleryLayerRef}
          className="absolute inset-0 opacity-0"
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={galleryRowRef}
            className="flex h-full"
            style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
          >
            {about.gallery.map((shot, i) => (
              <GalleryFrame key={i} shot={shot} first={i === 0} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll length */}
      <div aria-hidden style={{ height: spacerH }} />

      {/* Accessible, static copy of the narrative for AT / no-JS crawlers */}
      <div className="sr-only">
        <h1>
          {site.name} — {about.chapterOne}
        </h1>
        {about.credits.map((c, i) => (
          <p key={i}>
            {c.scene}. {c.body}
          </p>
        ))}
        <h2>{about.chapterTwo}</h2>
        <ul>
          {about.gallery.map((shot, i) => (
            <li key={i}>
              {shot.role} — {shot.location}
              {shot.project ? ` (${shot.project})` : ""}
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
          <h1 className="font-sans text-[clamp(2rem,9vw,3rem)] font-bold leading-[1] tracking-[-0.02em] text-primary">
            {about.chapterOne}
          </h1>
          <div className="mt-12 space-y-12">
            {about.credits.map((c, i) => (
              <div key={i}>
                <p className="font-sans text-base font-semibold tracking-wide text-primary">
                  {c.scene}
                </p>
                <p className="mx-auto mt-3 max-w-[34ch] font-sans text-[15px] leading-relaxed text-primary/85">
                  {c.body}
                </p>
              </div>
            ))}
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
                alt={`${shot.role} — ${shot.location}`}
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
                  <p className="font-sans text-2xl font-semibold text-paper">
                    {shot.role}
                  </p>
                  <p className="mt-1 font-sans text-sm text-paper/80">
                    {shot.location}
                  </p>
                </figcaption>
              )}
            </figure>
          ))}
        </section>
      </main>
    </div>
  );
}
