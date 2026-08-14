"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { Project } from "@/lib/site";

const COLS =
  "md:grid md:grid-cols-[minmax(0,1.9fr)_0.9fr_0.6fr_1.4fr] md:items-center md:gap-6";

/**
 * List view — editorial table (Projects / Client / Year / Services). Hovering a
 * row paints a full-bleed yellow highlight (dark text) and floats a monochrome
 * preview near the pointer. Keyboard focus gets the same highlight (no preview).
 */
export default function ProjectList({
  projects,
  canHover,
  reduce,
}: {
  projects: Project[];
  canHover: boolean;
  reduce: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [preview, setPreview] = useState<{ src: string; show: boolean }>({
    src: "",
    show: false,
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.5 });

  const PREVIEW_W = 264;
  const PREVIEW_H = 165;

  const moveTo = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = Math.min(
      Math.max(e.clientX - r.left + 24, 0),
      r.width - PREVIEW_W,
    );
    const py = Math.min(
      Math.max(e.clientY - r.top - PREVIEW_H / 2, 8),
      r.height - PREVIEW_H,
    );
    x.set(px);
    y.set(py);
  };

  return (
    <div ref={containerRef} className="relative px-[var(--gutter)]">
      {/* Column headings */}
      <div
        className={`hidden border-b border-white/10 pb-3 font-sans text-sm text-subtext ${COLS}`}
      >
        <span>Projects</span>
        <span>Client</span>
        <span>Year</span>
        <span>Services</span>
      </div>

      <ul>
        {projects.map((project, i) => {
          const active = i === activeIndex;
          return (
            <li key={project.id}>
              <Link
                href={project.href}
                aria-current={active ? "true" : undefined}
                onPointerEnter={() => {
                  if (!canHover) return;
                  setActiveIndex(i);
                  setPreview({ src: project.thumbnail, show: true });
                }}
                onPointerMove={canHover ? moveTo : undefined}
                onPointerLeave={() => {
                  if (!canHover) return;
                  setActiveIndex((cur) => (cur === i ? null : cur));
                  setPreview((p) => ({ ...p, show: false }));
                }}
                onFocus={() => setActiveIndex(i)}
                onBlur={() =>
                  setActiveIndex((cur) => (cur === i ? null : cur))
                }
                className={`relative block py-4 outline-none transition-colors duration-150 ${COLS} ${
                  active ? "text-ink" : "text-paper"
                }`}
              >
                {/* Full-bleed yellow highlight */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-[calc(var(--gutter)*-1)] right-[calc(var(--gutter)*-1)] bg-primary transition-opacity duration-150"
                  style={{ opacity: active ? 1 : 0 }}
                />
                <span className="relative z-[1] block font-sans text-base">
                  {project.title}
                </span>
                <span
                  className={`relative z-[1] mt-1 block font-sans text-sm md:mt-0 md:text-base ${
                    active ? "text-ink" : "text-subtext md:text-paper"
                  }`}
                >
                  <span className="md:hidden">
                    {project.client} · {project.year}
                  </span>
                  <span className="hidden md:inline">{project.client}</span>
                </span>
                <span className="relative z-[1] hidden font-sans text-base md:block">
                  {project.year}
                </span>
                <span
                  className={`relative z-[1] mt-1 block font-sans text-sm md:mt-0 md:text-base ${
                    active ? "text-ink" : "text-subtext md:text-paper"
                  }`}
                >
                  {project.services}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Floating monochrome preview (pointer only) */}
      {canHover && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 overflow-hidden shadow-2xl"
          style={{
            width: PREVIEW_W,
            height: PREVIEW_H,
            x: reduce ? x : sx,
            y: reduce ? y : sy,
          }}
          animate={{ opacity: preview.show ? 1 : 0, scale: preview.show ? 1 : 0.96 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          {preview.src && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={preview.src}
              alt=""
              className="h-full w-full object-cover grayscale"
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
