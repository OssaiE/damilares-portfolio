"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CursorArrow } from "@/components/icons";
import Wordmark from "@/components/ui/Wordmark";
import { meta, site } from "@/lib/site";

const easeExpo = [0.16, 1, 0.3, 1] as const;

/** L-shaped frame bracket */
function Bracket({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-6 w-6 border-primary/70 ${className}`}
    />
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-ink px-[var(--gutter)] pb-8 pt-16 md:pt-20"
    >
      {/* faint background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "12.5% 33%",
        }}
      />

      {/* Outer frame brackets */}
      <Bracket className="left-4 top-6 border-l border-t" />
      <Bracket className="right-4 top-6 border-r border-t" />
      <Bracket className="bottom-4 left-4 border-b border-l" />
      <Bracket className="bottom-4 right-4 border-b border-r" />

      <div className="relative">
        {/* Timecode + yellow rule */}
        <div className="relative mx-auto max-w-[1600px]">
          <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-sans text-[11px] tabular-nums tracking-[0.2em] text-primary/80">
            00:00:00:20
          </span>
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
        <dl className="mx-auto mt-10 grid max-w-[1600px] grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-0">
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

        <div className="mx-auto mt-12 max-w-[1600px] border-t border-white/10" />

        {/* Big wordmark + collaborator cursor */}
        <div className="relative flex items-center justify-center py-14 md:py-20">
          <div className="relative">
            <Wordmark
              as="p"
              className="text-[15vw] leading-none text-paper md:text-[11vw] lg:text-[9vw]"
            />
            {/* Figma-style multiplayer cursor */}
            <motion.div
              className="absolute -left-2 top-1/2 flex items-start"
              initial={{ opacity: 0, x: -18, y: 18 }}
              animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: easeExpo }}
            >
              <CursorArrow className="h-6 w-6 text-[#14ae5c]" />
              <span className="ml-1 mt-4 whitespace-nowrap rounded-md rounded-tl-none bg-[#14ae5c] px-2 py-1 text-xs font-medium text-white shadow-lg">
                {site.creator}
              </span>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] border-t border-white/10" />

        {/* Bottom bar */}
        <div className="mx-auto mt-6 flex max-w-[1600px] flex-col items-start justify-between gap-3 text-[11px] tracking-[0.14em] text-subtext md:flex-row md:items-center">
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
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {site.name} {site.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
