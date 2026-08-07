"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

const LETTER_SPACING = "-0.07em";
const MAX_PARTICLES = 45000; // very dense → reads as (almost) solid type at rest
const RADIUS = 140; // repulsion radius (css px)
const PUSH = 46; // repulsion strength — dense field absorbs it, so no dark void
const SPRING = 0.05; // return-home stiffness
const FRICTION = 0.88; // velocity damping (higher = smoother/floatier)

type P = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
};

/**
 * The wordmark rendered as a field of small yellow particles (Lama-Lama style).
 * At rest they form the letters; the pointer smoothly repels nearby particles,
 * which flow aside and ease back — no mask, no hole, no dark blob. The canvas
 * extends above the type so displaced particles are never clipped at the top.
 */
export default function ParticleText({
  hovering,
  enabled,
  pointer,
  onReady,
}: {
  hovering: boolean;
  enabled: boolean;
  pointer: { current: { x: number; y: number } };
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef(0);
  target.current = hovering && enabled ? 1 : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let pad = 0; // headroom above the type (css px)
    let particles: P[] = [];
    let raf: number | undefined;
    let hover = 0;
    let ready = false;

    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true })!;

    const build = () => {
      const r = parent.getBoundingClientRect();
      W = r.width;
      const textH = r.height;
      if (W < 4 || textH < 4) return;
      pad = Math.round(textH * 0.55); // room for particles to fly upward
      H = textH + pad;

      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      off.width = canvas.width;
      off.height = canvas.height;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.clearRect(0, 0, W, H);
      octx.textBaseline = "alphabetic";
      octx.font = `700 100px "Oriya Sangam MN", "Arial Black", sans-serif`;
      octx.letterSpacing = LETTER_SPACING;
      const base = octx.measureText(site.name).width || 1;
      const size = (100 * W) / base;
      octx.font = `700 ${size}px "Oriya Sangam MN", "Arial Black", sans-serif`;
      octx.letterSpacing = LETTER_SPACING;
      const m = octx.measureText(site.name);
      const desc = m.actualBoundingBoxDescent || size * 0.18;
      octx.fillStyle = "#fff";
      octx.fillText(site.name, 0, H - desc); // bottom-aligned

      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const pts: { x: number; y: number }[] = [];
      const step = Math.max(1, Math.round(dpr));
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 128) {
            pts.push({ x: x / dpr, y: y / dpr });
          }
        }
      }
      let chosen = pts;
      if (pts.length > MAX_PARTICLES) {
        chosen = [];
        const stride = pts.length / MAX_PARTICLES;
        for (let i = 0; i < MAX_PARTICLES; i++)
          chosen.push(pts[Math.floor(i * stride)]);
      }
      particles = chosen.map((p) => ({
        hx: p.x,
        hy: p.y,
        x: p.x,
        y: p.y,
        vx: 0,
        vy: 0,
        s: Math.random() * 0.5 + 2, // ~2–2.5px → overlaps into solid coverage
      }));

      // paint the resting field once so the wordmark is visible immediately
      drawStatic();
      if (!ready) {
        ready = true;
        onReady?.();
      }
    };

    const drawStatic = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#FFCC00";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
    };

    const tick = () => {
      hover += (target.current - hover) * 0.08;
      const mx = pointer.current.x;
      const my = pointer.current.y + pad; // pointer is in type space; shift into canvas space
      const strength = hover * PUSH;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#FFCC00";

      let moving = false;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // smooth repulsion from the pointer
        if (strength > 0.01) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < RADIUS && dist > 0.01) {
            const f = (1 - dist / RADIUS);
            const push = (f * f * strength) / dist;
            p.vx += dx * push;
            p.vy += dy * push;
          }
        }
        // spring home + damping
        p.vx += (p.hx - p.x) * SPRING;
        p.vy += (p.hy - p.y) * SPRING;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillRect(p.x, p.y, p.s, p.s);
        if (Math.abs(p.vx) + Math.abs(p.vy) > 0.05) moving = true;
      }

      if (hover > 0.003 || target.current > 0 || moving) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = undefined;
        drawStatic(); // settle to the crisp resting field
      }
    };

    const kick = () => {
      if (raf === undefined) raf = requestAnimationFrame(tick);
    };
    (canvas as unknown as { __kick?: () => void }).__kick = kick;

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas.parentElement!);
    const onDpr = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      build();
    };
    window.addEventListener("resize", onDpr);
    document.fonts.ready.then(build);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onDpr);
    };
    // Mount-once: pointer/onReady are stable refs/callbacks captured on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const c = canvasRef.current as unknown as { __kick?: () => void } | null;
    if (hovering && enabled && c?.__kick) c.__kick();
  }, [hovering, enabled]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 w-full"
    />
  );
}
