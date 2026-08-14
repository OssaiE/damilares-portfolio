"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Wordmark from "@/components/ui/Wordmark";
import { meta, site } from "@/lib/site";

const easeExpo = [0.16, 1, 0.3, 1] as const;

/** Running film timecode HH:MM:SS:FF (24fps). Counts only while on screen. */
function Timecode({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const fps = 24;
    const pad = (n: number) => String(n).padStart(2, "0");
    let raf = 0;
    let start = 0;
    let running = false;
    const tick = (now: number) => {
      if (!start) start = now;
      const frames = Math.floor(((now - start) / 1000) * fps);
      const ts = Math.floor(frames / fps);
      el.textContent = `${pad(Math.floor(ts / 3600))}:${pad(
        Math.floor(ts / 60) % 60,
      )}:${pad(ts % 60)}:${pad(frames % fps)}`;
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce]);

  return (
    <span ref={ref} className={className}>
      00:00:00:20
    </span>
  );
}

/** L-shaped frame bracket */
function Bracket({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-6 w-6 border-primary/70 ${className}`}
    />
  );
}

export default function Footer({
  transparent = false,
}: {
  /** When true, drop the footer's own bg + grid so a page-wide grid shows
   *  through continuously (used on the Works page). */
  transparent?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <footer
      ref={ref}
      data-snap
      className={`relative overflow-hidden px-[var(--gutter)] py-[200px] ${
        transparent ? "" : "bg-ink"
      }`}
    >
      {/* faint background grid (skipped when a page-wide grid is provided) */}
      {!transparent && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "275px 175px",
          }}
        />
      )}

      {/* Frame (brackets) — same width as the header nav */}
      <div className="relative">
        <Bracket className="left-0 -top-8 border-l border-t" />
        <Bracket className="right-0 -top-8 border-r border-t" />
        <Bracket className="-bottom-8 left-0 border-b border-l" />
        <Bracket className="-bottom-8 right-0 border-b border-r" />

        {/* Inset content — sits inside the frame, not touching the brackets */}
        <div className="px-6 md:px-14">
          {/* Timecode + yellow rule */}
          <div className="relative">
            <Timecode className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-sans text-xs tabular-nums tracking-[0.2em] text-primary/80" />
            <div className="relative">
              <span className="absolute -left-1 -top-2 h-3 w-3 border-l border-t border-primary" />
              <span className="absolute -right-1 -top-2 h-3 w-3 border-r border-t border-primary" />
              <motion.div
                className="h-px w-full origin-center bg-primary/80"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.1, ease: easeExpo }}
              />
            </div>
          </div>

          {/* Meta columns */}
          <dl className="mt-10 grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-0">
            {meta.map((m, i) => (
              <motion.div
                key={m.label}
                className={`px-1 text-center md:px-8 ${
                  i > 0 ? "md:border-l md:border-white/10" : ""
                }`}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 * i, ease: easeExpo }}
              >
                <dt className="u-label text-subtext">{m.label}</dt>
                <dd
                  className={`mt-2 text-sm font-semibold tracking-wide ${
                    "href" in m && m.href ? "normal-case" : "uppercase"
                  }`}
                >
                  {"href" in m && m.href ? (
                    <a
                      href={m.href}
                      className="underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      {m.value}
                    </a>
                  ) : (
                    m.value
                  )}
                </dd>
              </motion.div>
            ))}
          </dl>

          <div className="mt-12 border-t border-white/10" />

          {/* Big wordmark */}
          <div className="flex items-center justify-center py-14 md:py-20">
            <Wordmark
              as="p"
              className="text-[15vw] leading-none text-paper md:text-[11vw] lg:text-[9vw]"
            />
          </div>

          <div className="border-t border-white/10" />

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs tracking-[0.14em] text-subtext md:flex-row md:items-center">
            <p className="uppercase">
              <a href="https://instagram.com" className="hover:text-paper">
                Instagram
              </a>{" "}
              •{" "}
              <a href="https://linkedin.com" className="hover:text-paper">
                LinkedIn
              </a>{" "}
              • {site.phone}
            </p>
            <p className="flex items-center gap-1.5 uppercase">
              <span className="rec-blink h-1.5 w-1.5 rounded-full bg-primary" />
              {site.name} {site.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
