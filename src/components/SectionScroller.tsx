"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { scrollControl } from "@/lib/scrollControl";

/** easeOutQuint — fast start, long smooth deceleration into place. */
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const DURATION = 900; // ms per section glide

/**
 * fela.tv-style strict section scrolling, restored. Each wheel flick / swipe /
 * arrow advances exactly ONE `[data-snap]` section, gliding into place with an
 * easeOutQuint tween — never a free/inertia scroll through several.
 *
 * Runs on a plain rAF tween over the NATIVE scroll position (no Lenis), so it
 * can't stall or fight CSS scroll-snap: a fresh flick simply retargets the tween
 * from wherever we are. Disabled under reduced-motion (native scroll).
 */
export default function SectionScroller() {
  const reduce = useReducedMotion();
  const [hijack, setHijack] = useState(false);

  // Section-snapping (and its `touchmove` preventDefault) is a desktop-with-a-
  // mouse conceit — on touch devices it kills native scrolling and freezes the
  // page. Only a fine pointer on a ≥768px viewport opts in; phones/tablets
  // scroll normally.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () => setHijack(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduce || !hijack) return;

    // The CSS `scroll-behavior: smooth` would re-animate on every rAF scrollTo,
    // fighting our tween — force instant scrolling while we own the motion.
    const prevBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    let sections: HTMLElement[] = [];
    const collect = () => {
      sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-snap]"),
      );
    };
    collect();

    let raf = 0;
    const topOf = (el: HTMLElement) =>
      Math.round(el.getBoundingClientRect().top + window.scrollY);

    const nearestIndex = () => {
      const y = window.scrollY;
      let best = 0;
      let bestD = Infinity;
      sections.forEach((s, i) => {
        const d = Math.abs(topOf(s) - y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    };

    const tweenTo = (y: number) => {
      cancelAnimationFrame(raf);
      const startY = window.scrollY;
      const dist = y - startY;
      if (Math.abs(dist) < 2) return;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / DURATION);
        window.scrollTo(0, startY + dist * easeOutQuint(p));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const goToIndex = (i: number) => {
      const clamped = Math.max(0, Math.min(sections.length - 1, i));
      const target = sections[clamped];
      if (target) tweenTo(topOf(target));
    };

    const step = (dir: number) => {
      const next = nearestIndex() + dir;
      if (next < 0 || next > sections.length - 1) return;
      goToIndex(next);
    };

    // Works indicator → jump to the Nth project (Nth [data-snap] article).
    scrollControl.goToProject = (projectIndex: number) => {
      const articles = sections.filter((s) => s.tagName === "ARTICLE");
      const target = articles[projectIndex];
      if (target) goToIndex(sections.indexOf(target));
    };

    const blocked = (target: EventTarget | null) =>
      document.body.style.overflow === "hidden" ||
      (target as HTMLElement | null)?.closest?.("[data-lenis-prevent]") != null;

    // --- Wheel: responsive one-step-per-flick via ACCELERATION detection.
    // A fresh flick's deltas are RISING (accelerating) → fire a step immediately,
    // even mid-glide or during the previous flick's inertia. The inertia tail is
    // FALLING (decelerating) → ignored, so momentum never over-scrolls. A short
    // debounce keeps a single flick to a single step. No lock to wait on, so
    // rapid flicks chain straight through sections. ---
    const GESTURE_IDLE = 150; // ms of silence that ends a gesture (resets samples)
    const STEP_DEBOUNCE = 110; // min ms between steps (one step per flick)
    let deltas: number[] = [];
    let prevTs = 0;
    let lastStep = 0;
    const avgOf = (arr: number[], n: number) => {
      const s = arr.slice(-n);
      return s.length ? s.reduce((a, b) => a + b, 0) / s.length : 0;
    };
    const onWheel = (e: WheelEvent) => {
      if (blocked(e.target)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - prevTs > GESTURE_IDLE) deltas = [];
      prevTs = now;
      const mag = Math.abs(e.deltaY);
      deltas.push(mag);
      if (deltas.length > 80) deltas.shift();
      if (mag < 4 || now - lastStep < STEP_DEBOUNCE) return;
      // Fire only while the gesture is accelerating (new input), not decaying.
      if (avgOf(deltas, 8) < avgOf(deltas, 40)) return;
      lastStep = now;
      step(e.deltaY > 0 ? 1 : -1);
    };

    // --- Touch: one step per swipe ---
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!blocked(e.target)) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (blocked(e.target)) return;
      const dy = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
      if (Math.abs(dy) < 40) return;
      step(dy > 0 ? 1 : -1);
    };

    // --- Keyboard ---
    const onKey = (e: KeyboardEvent) => {
      if (document.body.style.overflow === "hidden") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          step(1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          step(-1);
          break;
        case "Home":
          e.preventDefault();
          goToIndex(0);
          break;
        case "End":
          e.preventDefault();
          goToIndex(sections.length - 1);
          break;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", collect);

    return () => {
      document.documentElement.style.scrollBehavior = prevBehavior;
      scrollControl.goToProject = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", collect);
    };
  }, [reduce, hijack]);

  return null;
}
