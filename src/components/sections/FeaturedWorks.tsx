"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { PlayCircleIcon, PauseCircleIcon } from "@/components/icons";
import { featuredWorks, type Work } from "@/lib/site";
import { scrollControl } from "@/lib/scrollControl";

const easeSmooth = [0.22, 1, 0.36, 1] as const; // cubic-bezier: easeOutQuint (smooth arrival)
const COUNT = featuredWorks.length;

function timecode(total: number) {
  const s = Math.max(0, Math.floor(total));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s / 60) % 60))}:${pad(
    s % 60,
  )}`;
}

/**
 * Selected works — a fela.tv-style scroll: full-screen project slides flow past
 * one after another, each zooming from a card (~0.86) up to fill the screen as
 * it centres and back down as it leaves. A side indicator tracks 1 → 8, then
 * the footer follows. Only the centred (active) project's video plays.
 */
export default function FeaturedWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Which project currently fills the viewport (from scroll position), and keep
  // the side indicator's top aligned to the active project's category tag.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let ticking = false;
    const measure = () => {
      ticking = false;
      const vh = window.innerHeight;
      const scrolled = -el.getBoundingClientRect().top;
      const idx = Math.max(0, Math.min(COUNT - 1, Math.round(scrolled / vh)));
      setActive((prev) => (prev === idx ? prev : idx));

      const nav = navRef.current;
      if (nav) {
        const tag = el
          .querySelectorAll("article")
          [idx]?.querySelector<HTMLElement>("[data-tag]");
        if (tag) nav.style.top = `${Math.round(tag.getBoundingClientRect().top)}px`;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    if (scrollControl.goToProject) {
      scrollControl.goToProject(i);
    } else {
      const article = sectionRef.current?.querySelectorAll("article")[i];
      article?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Selected works"
      className="relative bg-ink text-paper"
    >
      {/* Side progress indicator (desktop) — top aligned to the active tag */}
      <div className="pointer-events-none sticky top-0 z-40 hidden h-0 md:block">
        <nav
          ref={navRef}
          aria-label="Works progress"
          className="pointer-events-auto absolute left-[var(--gutter)] top-[60svh] flex flex-col items-center gap-1.5"
        >
          {featuredWorks.map((w, i) => {
            const on = i === active;
            return (
              <button
                key={w.title}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${w.title}`}
                aria-current={on ? "true" : undefined}
                className="group flex w-4 items-center justify-center"
              >
                <span
                  className={`w-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    on
                      ? "h-6 bg-primary"
                      : "h-2 border border-primary/50 group-hover:border-primary"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {featuredWorks.map((work, i) => (
        <WorkPanel key={work.title} work={work} active={active === i} />
      ))}
    </section>
  );
}

function WorkPanel({ work, active }: { work: Work; active: boolean }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startRef = useRef(work.clipStart ?? 0);
  const [ready, setReady] = useState(false);
  const len = work.runtime;
  const contentPad =
    "pl-[var(--gutter)] pr-[var(--gutter)] md:pl-[calc(var(--gutter)+3.25rem)]";

  // Scroll-driven zoom: each slide grows from a card (~0.82) to fill the
  // screen (1.0) as it centres, then shrinks again — the fela.tv reveal.
  // Driven from a post-mount scroll listener (motion values, no re-renders)
  // to avoid useScroll's SSR "ref not hydrated" error in the App Router.
  const scale = useMotionValue(1);
  const radius = useMotionValue(0);
  const opacity = useMotionValue(1);

  useEffect(() => {
    if (reduce) return;
    const el = panelRef.current;
    if (!el) return;
    // Cache the panel's document offset + viewport height and only re-measure on
    // resize. Each scroll frame is then pure arithmetic — no getBoundingClientRect
    // (which would force a synchronous layout on every panel, every frame).
    let docTop = 0;
    let vh = window.innerHeight;
    const measure = () => {
      vh = window.innerHeight;
      docTop = el.getBoundingClientRect().top + window.scrollY;
    };
    let ticking = false;
    const update = () => {
      ticking = false;
      const rectTop = docTop - window.scrollY; // panel top relative to viewport
      // 0 when the slide is centred, → 1 by ~half a viewport away either side.
      const dist = Math.min(1, Math.abs(rectTop) / (vh * 0.55));
      scale.set(1 - 0.18 * dist);
      radius.set(26 * dist);
      opacity.set(1 - 0.5 * dist);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce, scale, radius, opacity]);

  // Fade the footage in once it can paint.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setReady(true);
    if (v.readyState >= 2) setReady(true);
    v.addEventListener("canplay", onCanPlay);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, []);

  // Constrain playback to a 5-second window that loops (placeholder previews).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const applyStart = () => {
      let s = work.clipStart ?? 0;
      // If the window would run past the source, just loop from the top.
      if (!Number.isFinite(v.duration) || s + len > v.duration) s = 0;
      startRef.current = s;
      if (v.currentTime < s || v.currentTime > s + len) v.currentTime = s;
    };
    const onTime = () => {
      const s = startRef.current;
      if (v.currentTime >= s + len || v.currentTime < s - 0.05) {
        v.currentTime = s;
      }
    };
    v.addEventListener("loadedmetadata", applyStart);
    v.addEventListener("timeupdate", onTime);
    if (v.readyState >= 1) applyStart();
    return () => {
      v.removeEventListener("loadedmetadata", applyStart);
      v.removeEventListener("timeupdate", onTime);
    };
  }, [work.clipStart, len]);

  // Only the active project plays (perf + battery); honour reduced-motion.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active && !reduce) {
      if (v.currentTime < startRef.current) v.currentTime = startRef.current;
      v.play().catch(() => {});
    } else if (!v.paused) {
      v.pause();
    }
  }, [active, reduce]);

  return (
    <article
      ref={panelRef}
      data-snap
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink"
    >
      {/* The whole slide is a card that zooms to fill as it centres */}
      <motion.div
        style={reduce ? undefined : { scale, opacity, borderRadius: radius }}
        className="absolute inset-0 origin-center overflow-hidden bg-ink"
      >
        {/* Footage */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: ready ? 1 : 0, objectPosition: "50% 45%" }}
          poster={work.poster}
          muted
          loop
          playsInline
          preload="none"
        >
          {work.video?.webm && (
            <source src={work.video.webm} type="video/webm" />
          )}
          {work.video && <source src={work.video.mp4} type="video/mp4" />}
        </video>

        {/* Legibility scrim so the yellow type reads over any frame.
            (No vignette or grain on projects — those cost a full-screen blend
            layer each; only the hero keeps them.) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/25" />

        {/* Content — bottom-aligned like the reference */}
        <div className="relative z-10 flex h-full w-full flex-col justify-end">
          <div className={`w-full ${contentPad} pb-[7svh]`}>
            {/* Category tag — Inter 12px / medium / 0 tracking */}
            <motion.span
              data-tag
              className="inline-block rounded-[6px] border border-primary px-2.5 py-1 font-sans text-xs font-medium tracking-[0] text-primary"
              initial={{ opacity: 0, y: 14 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.6, ease: easeSmooth }}
            >
              {work.category}
            </motion.span>

            {/* Title — Inter 96px / extrabold / 90% lh / -2px tracking / max 2 lines */}
            <h2 className="mt-2 max-w-[40rem] font-sans text-[3.25rem] font-extrabold leading-[0.9] tracking-[-2px] text-primary md:text-8xl">
              <span className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={active ? { y: "0%" } : { y: "110%" }}
                  transition={{ duration: 0.8, ease: easeSmooth }}
                >
                  {work.title}
                </motion.span>
              </span>
            </h2>

            {/* Year — Inter 16px / extrabold / 0 tracking */}
            <motion.p
              className="mt-2 font-sans text-base font-extrabold tracking-[0] tabular-nums text-primary"
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeSmooth }}
            >
              {work.year}
            </motion.p>

            {/* Transport — 40px below the title text */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.3, ease: easeSmooth }}
            >
              <WorkTransport videoRef={videoRef} startRef={startRef} len={len} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </article>
  );
}

/**
 * Transport wired to the panel's <video>: play/pause + a progress bar and
 * timecode scoped to the 5-second preview window.
 */
function WorkTransport({
  videoRef,
  startRef,
  len,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  startRef: RefObject<number>;
  len: number;
}) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () =>
      setCurrent(Math.min(len, Math.max(0, v.currentTime - startRef.current)));
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    setPlaying(!v.paused);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [videoRef, startRef, len]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const pct = len ? (current / len) * 100 : 0;

  return (
    <div className="w-[clamp(260px,34vw,600px)]">
      {/* Play/pause + timecode sit ON TOP of the player bar (8px above it) */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="shrink-0 text-primary transition-opacity duration-300 hover:opacity-70"
        >
          {playing ? (
            <PauseCircleIcon className="h-6 w-6" />
          ) : (
            <PlayCircleIcon className="h-6 w-6" />
          )}
        </button>
        <span className="font-sans text-sm font-medium tabular-nums tracking-wide text-primary">
          {timecode(current)}/{timecode(len)}
        </span>
      </div>

      {/* Player bar — track / fill / thumb */}
      <div className="relative h-4">
        <span className="absolute left-0 top-1/2 h-[4px] w-full -translate-y-1/2 rounded-full bg-paper/40" />
        <span
          className="absolute left-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper shadow-[0_1px_5px_rgba(0,0,0,0.35)]"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}
