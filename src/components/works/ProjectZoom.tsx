"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import type { Project } from "@/lib/site";

/** Varied media shapes so landscape / portrait / square all read gracefully. */
const SHAPES = [
  { w: "60vw", ar: "16 / 9" },
  { w: "40vw", ar: "4 / 5" },
  { w: "54vw", ar: "3 / 2" },
  { w: "46vw", ar: "1 / 1" },
  { w: "58vw", ar: "16 / 10" },
];

/* ------------------------------------------------------------------ *
 * Zoom view — the original centre-stacked reel (varied frames, a single
 * shared metadata layer, "View project" hover label, desaturated inactive
 * frames) driven by the perspective DEPTH scroll:
 *
 *   ahead / next  → translateZ(-400) scale(.8)  opacity .5   (small, far)
 *   active        → translateZ(0)    scale(1)   opacity 1    (clear, stable)
 *   behind / prev → translateZ(150)  scale(1.08) opacity 0   (past the lens)
 *
 * Each project gets a viewport of scroll so the depth reads one at a time;
 * position-driven, so it's symmetric scrolling either way and needs no
 * hijacking. Reduced-motion / no-JS fall back to a plain readable stack.
 * ------------------------------------------------------------------ */

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

function styleFor(delta: number, depth: number) {
  const NEXT = { z: -400, s: 0.8, o: 0.5 };
  const ACTIVE = { z: 0, s: 1, o: 1 };
  const PREV = { z: 150, s: 1.08, o: 0 };
  let z: number, s: number, o: number;

  if (delta <= -1) {
    z = PREV.z;
    s = PREV.s;
    o = 0;
  } else if (delta < 0) {
    const t = smoothstep(delta + 1);
    z = lerp(PREV.z, ACTIVE.z, t);
    s = lerp(PREV.s, ACTIVE.s, t);
    o = lerp(PREV.o, ACTIVE.o, t);
  } else if (delta < 1) {
    const t = smoothstep(delta);
    z = lerp(ACTIVE.z, NEXT.z, t);
    s = lerp(ACTIVE.s, NEXT.s, t);
    o = lerp(ACTIVE.o, NEXT.o, t);
  } else {
    const t = Math.min(delta - 1, 1);
    z = lerp(NEXT.z, NEXT.z - 260, t);
    s = lerp(NEXT.s, 0.68, t);
    o = lerp(NEXT.o, 0, t);
  }

  z *= depth;
  s = 1 + (s - 1) * depth;
  return { z, s, o };
}

export default function ProjectZoom({
  projects,
  canHover = false,
}: {
  projects: Project[];
  canHover?: boolean;
  reduce?: boolean;
}) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const activeRef = useRef(activeId);

  // The depth reel is a desktop + motion-allowed enhancement.
  const [desktop, setDesktop] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 768px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setDesktop(mqWide.matches);
      setReduceMotion(mqReduce.matches);
    };
    update();
    mqWide.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mqWide.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!desktop) return; // mobile: plain stacked list, no reel
    let raf = 0;
    let smooth = window.scrollY;
    const N = projects.length;

    const frame = () => {
      const vh = window.innerHeight;
      // Soft scroll follow: current += (target − current) * 0.08
      smooth += (window.scrollY - smooth) * 0.08;
      if (Math.abs(window.scrollY - smooth) < 0.4) smooth = window.scrollY;

      const depth =
        0.6 + 0.4 * clamp((window.innerWidth - 768) / (1280 - 768), 0, 1);
      const focus = smooth + vh / 2;

      let bestId: string | null = null;
      let bestNear = -1;

      for (let i = 0; i < N; i++) {
        const img = imgRefs.current[i];
        if (!img) continue;
        const rect = img.getBoundingClientRect();
        const docCentre = rect.top + rect.height / 2 + window.scrollY;
        const delta = (docCentre - focus) / vh;
        const near = Math.max(0, 1 - Math.abs(delta) / 0.85);
        if (near > bestNear) {
          bestNear = near;
          bestId = projects[i].id;
        }

        const cell = cellRefs.current[i];

        if (reduceMotion) {
          // No 3D — just the original look: active clear, others desaturated.
          const g = smoothstep(near);
          img.style.transform = "";
          img.style.opacity = "";
          img.style.visibility = "";
          img.style.willChange = "";
          img.style.filter =
            g > 0.999
              ? "none"
              : `grayscale(${((1 - g) * 0.7).toFixed(3)}) brightness(${lerp(0.85, 1, g).toFixed(3)})`;
          if (cell) cell.style.pointerEvents = "auto";
          continue;
        }

        const { z, s, o } = styleFor(delta, depth);
        img.style.transform = `translate3d(0,0,${z.toFixed(1)}px) scale(${s.toFixed(4)})`;
        img.style.opacity = o.toFixed(3);
        img.style.visibility = o > 0.01 ? "visible" : "hidden";
        img.style.willChange =
          Math.abs(delta) < 1.6 ? "transform, opacity, filter" : "auto";
        // Desaturate away from centre, resolve to full colour when active.
        const g = smoothstep(near);
        img.style.filter =
          g > 0.999
            ? "none"
            : `grayscale(${((1 - g) * 0.85).toFixed(3)}) brightness(${lerp(0.82, 1, g).toFixed(3)})`;
        // Only the centred frame is a live click target.
        if (cell) cell.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }

      if (bestId && bestId !== activeRef.current) {
        activeRef.current = bestId;
        setActiveId(bestId);
      }
      // Metadata layer fades away when no frame holds the centre (top / footer).
      if (overlayRef.current) {
        overlayRef.current.style.opacity = smoothstep(
          clamp(bestNear, 0, 1),
        ).toFixed(3);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      imgRefs.current.forEach((img) => {
        if (!img) return;
        img.style.transform = "";
        img.style.opacity = "";
        img.style.visibility = "";
        img.style.willChange = "";
        img.style.filter = "";
      });
      cellRefs.current.forEach((c) => {
        if (c) c.style.pointerEvents = "";
      });
      if (overlayRef.current) overlayRef.current.style.opacity = "";
    };
  }, [desktop, reduceMotion, projects.length]);

  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  return (
    <section className="relative">
      {/* Shared metadata layer (desktop): title left, services right, at centre */}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-x-[var(--gutter)] top-1/2 z-30 hidden -translate-y-1/2 items-center justify-between md:flex"
      >
        <MetaSlot value={active?.title ?? ""} className="w-[26vw]" />
        <MetaSlot
          value={active?.services ?? ""}
          className="w-[24vw] justify-end text-right"
        />
      </div>

      <ul>
        {projects.map((project, i) => (
          <ZoomMedia
            key={project.id}
            project={project}
            shape={SHAPES[i % SHAPES.length]}
            canHover={canHover}
            registerImg={(el) => {
              imgRefs.current[i] = el;
            }}
            registerCell={(el) => {
              cellRefs.current[i] = el;
            }}
          />
        ))}
      </ul>
    </section>
  );
}

/** One reel slot: crossfades (short, restrained vertical) to the active label. */
function MetaSlot({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return (
    <div className={`relative h-6 overflow-hidden ${className}`}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          className="absolute inset-0 flex items-center truncate font-sans text-sm text-paper"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={
            className.includes("justify-end")
              ? { justifyContent: "flex-end", textAlign: "right" }
              : undefined
          }
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function ZoomMedia({
  project,
  shape,
  canHover,
  registerImg,
  registerCell,
}: {
  project: Project;
  shape: { w: string; ar: string };
  canHover: boolean;
  registerImg: (el: HTMLDivElement | null) => void;
  registerCell: (el: HTMLDivElement | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 });

  const track = (e: React.PointerEvent, jump: boolean) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = clamp(e.clientX - r.left, 56, r.width - 56);
    const py = clamp(e.clientY - r.top, 18, r.height - 18);
    x.set(px);
    y.set(py);
    if (jump) {
      sx.jump(px);
      sy.jump(py);
    }
  };

  return (
    <li className="flex min-h-[60vh] items-center justify-center">
      <div
        ref={registerCell}
        className="zoom-media relative w-full max-w-[900px] md:w-[var(--w)]"
        style={{ ["--w" as string]: shape.w } as React.CSSProperties}
      >
        <Link
          href={project.href}
          className="group relative block outline-none [transform-style:preserve-3d]"
          onPointerEnter={(e) => {
            if (!canHover) return;
            track(e, true);
            setHovered(true);
          }}
          onPointerLeave={() => canHover && setHovered(false)}
          onPointerMove={(e) => canHover && hovered && track(e, false)}
        >
          <div
            ref={(el) => {
              wrapRef.current = el;
              registerImg(el);
            }}
            className="relative w-full overflow-hidden bg-ink ring-1 ring-white/5 group-focus-visible:ring-2 group-focus-visible:ring-primary"
            style={{
              aspectRatio: shape.ar,
              maxHeight: "50vh",
              transformStyle: "preserve-3d",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.thumbnail}
              alt={`${project.title} — ${project.services}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />

            {/* Yellow "View project" label (pointer only), follows the cursor */}
            {canHover && hovered && (
              <motion.span
                className="pointer-events-none absolute z-10 whitespace-nowrap bg-primary px-2.5 py-1 text-xs font-medium text-ink"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                style={{
                  left: sx,
                  top: sy,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
              >
                View project
              </motion.span>
            )}
          </div>
        </Link>

        {/* Mobile metadata (no fixed side layer on small screens) */}
        <div className="mt-3 md:hidden">
          <h3 className="font-sans text-base font-medium text-paper">
            {project.title}
          </h3>
          <p className="mt-1 font-sans text-sm text-subtext">
            {project.services}
          </p>
        </div>
      </div>
    </li>
  );
}
