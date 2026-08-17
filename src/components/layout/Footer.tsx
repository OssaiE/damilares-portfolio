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

        {/* Inset content — sits inside the frame, not touching the brackets.
            Flush to the 16px gutter on mobile (matches the nav bar). */}
        <div className="px-0 lg:px-14">
          {/* Timecode + yellow rule */}
          <div className="relative">
            <Timecode className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-sans text-xs tabular-nums tracking-[0.2em] text-primary/80" />
            <div className="relative mx-6 lg:mx-0">
              <motion.div
                className="h-px w-full origin-center bg-primary/80"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.1, ease: easeExpo }}
              />
            </div>
          </div>

          {/* Meta columns */}
          <dl className="mt-10 grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:gap-0">
            {meta.map((m, i) => (
              <motion.div
                key={m.label}
                className={`px-1 text-center lg:px-8 ${
                  i % 2 === 1 ? "border-l border-white/10" : ""
                } ${i > 0 ? "lg:border-l lg:border-white/10" : ""}`}
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

          <div className="mx-6 mt-12 border-t border-white/10 lg:mx-0" />

          {/* Big wordmark */}
          <div className="flex items-center justify-center py-14 lg:py-20">
            <Wordmark
              as="p"
              className="text-[11vw] leading-none text-paper lg:text-[9vw]"
            />
          </div>

          <div className="mx-6 border-t border-white/10 lg:mx-0" />

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col items-center gap-4 text-center text-xs tracking-[0.14em] text-subtext lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:text-left">
            <p className="normal-case lg:uppercase">
              <a href="https://instagram.com" className="hover:text-paper">
                Instagram
              </a>{" "}
              •{" "}
              <a href="https://linkedin.com" className="hover:text-paper">
                LinkedIn
              </a>
              {/* phone shown from tablet up only */}
              <span className="hidden lg:inline"> • {site.phone}</span>
            </p>
            <p className="flex items-center gap-1.5 normal-case lg:uppercase">
              <span className="rec-blink h-1.5 w-1.5 rounded-full bg-primary" />
              {site.name} {site.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
