"use client";

import { useEffect, useRef, useState } from "react";
import { site, socials } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Contact — a "camera lens" reveal (desktop only).
 *
 *   Layer 0 · three photographs slowly cross-fading behind everything.
 *   Layer 1 · the black + faint-grid backdrop laid OVER them, masked by a soft
 *     circular aperture that trails the cursor — the mouse is a lens.
 *   Lens UI · a thin viewfinder ring + focus ticks + focal-length readout.
 *     CLICK cycles the lens (35 → 50 → 135mm); the aperture resizes and the
 *     photo does a quick focus-pull.
 *   Content · `mix-blend-mode: difference`, negative type that reacts to the
 *     photo showing through.
 *
 * The lens is a fine-pointer, large-screen conceit — it can't follow a finger,
 * so phones and tablets get a clean static layout instead (no aperture, cursor,
 * photos or blend). Reduced-motion parks the aperture at centre.
 * ------------------------------------------------------------------ */

const IMAGES = [
  "/images/about/bg-1.jpg",
  "/images/about/bg-2.jpg",
  "/images/about/bg-3.jpg",
];

/** Focal length → aperture radius (px). Wider lens = wider view. */
const LENSES = [
  { label: "35mm", radius: 360 },
  { label: "50mm", radius: 260 },
  { label: "135mm", radius: 175 },
] as const;

const GRID_IMAGE =
  "linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(#fff 1px, transparent 1px)";

const linkClass =
  "font-sans text-lg text-paper underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline focus-visible:text-primary md:text-xl";

export default function ContactExperience() {
  const instagram = socials.find((s) => s.label === "Instagram");
  const linkedin = socials.find((s) => s.label === "LinkedIn");

  // The lens experience is desktop + fine-pointer only.
  const [lensOn, setLensOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setLensOn(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Slow cross-fade between the three photographs (desktop lens only).
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!lensOn) return;
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % IMAGES.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, [lensOn]);

  // Lens (aperture size). Click cycles it; a ref feeds the rAF loop.
  const [lens, setLens] = useState(1); // start on 50mm
  const targetR = useRef<number>(LENSES[1].radius);
  const [focusing, setFocusing] = useState(false);
  useEffect(() => {
    targetR.current = LENSES[lens].radius;
    setFocusing(true);
    const t = window.setTimeout(() => setFocusing(false), 300);
    return () => window.clearTimeout(t);
  }, [lens]);

  const cycleLens = () => setLens((l) => (l + 1) % LENSES.length);

  const overlayRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!lensOn) return;
    const overlay = overlayRef.current;
    const ring = ringRef.current;
    if (!overlay) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      overlay.style.setProperty("--mx", "50%");
      overlay.style.setProperty("--my", "50%");
      overlay.style.setProperty("--r", `${LENSES[lens].radius}px`);
      return;
    }

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let r = targetR.current;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const start = performance.now();
    const frame = (now: number) => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      r += (targetR.current - r) * 0.12;
      const rr = r + Math.sin(((now - start) / 1000) * 1.6) * 5;
      overlay.style.setProperty("--mx", `${x.toFixed(1)}px`);
      overlay.style.setProperty("--my", `${y.toFixed(1)}px`);
      overlay.style.setProperty("--r", `${rr.toFixed(1)}px`);
      if (ring) {
        const d = rr * 1.7;
        ring.style.width = `${d}px`;
        ring.style.height = `${d}px`;
        ring.style.transform = `translate3d(${(x - d / 2).toFixed(1)}px, ${(y - d / 2).toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lensOn]);

  const mask =
    "radial-gradient(circle var(--r, 260px) at var(--mx, 50%) var(--my, 50%), transparent 0%, transparent 58%, #fff 92%)";

  /* Shared content (heading + contact details) */
  const content = (
    <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 md:items-center md:gap-16">
      <h1 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-paper md:leading-[0.92]">
        Let&apos;s work
        <br />
        together.
      </h1>

      <div className="max-w-md">
        <p className="font-sans text-base leading-relaxed text-paper md:text-lg">
          Have a project in mind or want to collaborate? Get in touch below.
        </p>

        <dl className="mt-10 space-y-8">
          <div>
            <dt className="u-label text-paper/70">Email</dt>
            <dd className="mt-1.5">
              <a href={`mailto:${site.email}`} className={linkClass}>
                {site.email}
              </a>
            </dd>
          </div>

          <div>
            <dt className="u-label text-paper/70">Instagram</dt>
            <dd className="mt-1.5">
              <a
                href={instagram?.href ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Instagram profile
              </a>
            </dd>
          </div>

          <div>
            <dt className="u-label text-paper/70">LinkedIn</dt>
            <dd className="mt-1.5">
              <a
                href={linkedin?.href ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                LinkedIn profile
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );

  /* Phones & tablets — clean static layout, no lens. */
  if (!lensOn) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.03,
            backgroundImage: GRID_IMAGE,
            backgroundSize: "275px 175px",
          }}
        />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />
        <main
          id="main"
          className="relative z-10 flex min-h-screen items-center px-[var(--gutter)] pb-24 pt-[150px] md:pt-[200px]"
        >
          {content}
        </main>
      </div>
    );
  }

  /* Desktop — the camera-lens reveal. */
  return (
    <div
      className="relative min-h-screen cursor-none overflow-hidden bg-ink"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) return; // let links work
        cycleLens();
      }}
    >
      {/* Layer 0 — cross-fading photographs (focus-pull on lens change) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[filter] duration-300 ease-out"
        style={{ filter: focusing ? "blur(10px)" : "blur(0px)" }}
      >
        {IMAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-ink/25" />
      </div>

      {/* Layer 1 — black + faint grid backdrop, opened up by the aperture */}
      <div
        ref={overlayRef}
        aria-hidden
        className="absolute inset-0 bg-ink"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.03,
            backgroundImage: GRID_IMAGE,
            backgroundSize: "275px 175px",
          }}
        />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />
      </div>

      {/* Content — negative type that reacts to whatever shows behind it */}
      <main
        id="main"
        className="relative z-10 flex min-h-screen items-center px-[var(--gutter)] pb-24 pt-[150px] mix-blend-difference md:pt-[200px]"
      >
        {content}
      </main>

      {/* Lens UI — viewfinder ring + focus ticks + focal-length readout */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 rounded-full border border-primary/60"
        style={{ width: 0, height: 0 }}
      >
        <span className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-primary/70" />
        <span className="absolute bottom-0 left-1/2 h-2.5 w-px -translate-x-1/2 translate-y-1/2 bg-primary/70" />
        <span className="absolute left-0 top-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-primary/70" />
        <span className="absolute right-0 top-1/2 h-px w-2.5 -translate-y-1/2 translate-x-1/2 bg-primary/70" />
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[150%] whitespace-nowrap font-sans text-xs font-medium uppercase tracking-[0.22em] text-primary">
          {LENSES[lens].label}
        </span>
      </div>
    </div>
  );
}
