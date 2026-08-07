"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { scrollControl } from "@/lib/scrollControl";

/** cubic-bezier(0.22, 1, 0.36, 1) — easeOutQuint: fast start, smooth deceleration
 *  into place, so each project glides into the viewport as smoothly as possible. */
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

const DURATION = 0.95; // seconds — a touch longer for a smoother arrival

/**
 * fela.tv-style strict section scrolling. Native scrolling is hijacked so each
 * wheel flick / swipe / arrow press advances exactly ONE section (hero → each
 * project → footer) — never a free/inertia scroll through several. The move is
 * locked until its transition finishes, and a wheel gesture only counts once
 * (trailing momentum is ignored). Disabled under reduced-motion (native scroll)
 * and while a modal has locked the page.
 */
export default function ScrollController() {
  const lenis = useLenis();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    let sections: HTMLElement[] = [];
    const collect = () => {
      sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-snap]"),
      );
    };
    collect();

    let animating = false;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;

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

    let queuedDir = 0;
    const finishAnimation = () => {
      animating = false;
      clearTimeout(releaseTimer);
      if (queuedDir !== 0) {
        const d = queuedDir;
        queuedDir = 0;
        step(d);
      }
    };

    const goToIndex = (i: number) => {
      const clamped = Math.max(0, Math.min(sections.length - 1, i));
      const target = sections[clamped];
      if (!target) return;
      const y = topOf(target);
      if (Math.abs(window.scrollY - y) < 2) return; // already there

      animating = true;
      clearTimeout(releaseTimer);
      // Safety release in case onComplete never fires.
      releaseTimer = setTimeout(finishAnimation, DURATION * 1000 + 250);

      if (lenis) {
        lenis.scrollTo(y, {
          duration: DURATION,
          easing: easeOutQuint,
          lock: true,
          force: true,
          onComplete: finishAnimation,
        });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
        // releaseTimer -> finishAnimation handles the rest
      }
    };

    const step = (dir: number) => {
      // Mid-transition: remember ONE deliberate step and run it when we land,
      // so a quick second scroll is never lost (but momentum, already gated out
      // upstream, can't reach here to queue a phantom step).
      if (animating) {
        queuedDir = dir;
        return;
      }
      const next = nearestIndex() + dir;
      if (next < 0 || next > sections.length - 1) return;
      goToIndex(next);
    };

    // Let the works indicator jump to a specific project (Nth [data-snap] article).
    scrollControl.goToProject = (projectIndex: number) => {
      const articles = sections.filter((s) => s.tagName === "ARTICLE");
      const target = articles[projectIndex];
      if (target) goToIndex(sections.indexOf(target));
    };

    const blocked = (target: EventTarget | null) =>
      document.body.style.overflow === "hidden" ||
      (target as HTMLElement | null)?.closest?.("[data-lenis-prevent]") != null;

    // --- Wheel: exactly one step per gesture ---
    // The step fires, then a lock is held until the wheel is COMPLETELY silent
    // for GESTURE_IDLE ms. Because every wheel event (the finger-scroll, the
    // phase gap, and the whole inertia tail) keeps resetting that timer, the
    // entire gesture is consumed as a single step no matter its shape — momentum
    // can never sneak in a second one. An acceleration check is a second guard
    // so a decaying tail can't start a step even if the lock ever lapses.
    const GESTURE_IDLE = 200; // ms of wheel silence that ends a gesture
    let scrollings: number[] = [];
    let prevWheelTs = 0;
    let gestureLock = false;
    let gestureIdleTimer: ReturnType<typeof setTimeout> | undefined;
    const avgOf = (arr: number[], n: number) => {
      const s = arr.slice(-n);
      return s.length ? s.reduce((a, b) => a + b, 0) / s.length : 0;
    };
    const onWheel = (e: WheelEvent) => {
      if (blocked(e.target)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - prevWheelTs > GESTURE_IDLE) scrollings = [];
      prevWheelTs = now;
      scrollings.push(Math.abs(e.deltaY));

      // Keep the gesture "alive" as long as any wheel event arrives.
      clearTimeout(gestureIdleTimer);
      gestureIdleTimer = setTimeout(() => {
        gestureLock = false;
      }, GESTURE_IDLE);

      // Note: `animating` is intentionally NOT gated here — step() queues one
      // move if a transition is mid-flight so a deliberate scroll isn't lost.
      if (gestureLock || Math.abs(e.deltaY) < 4) return;
      const accelerating = avgOf(scrollings, 10) >= avgOf(scrollings, 70);
      if (!accelerating) return;

      gestureLock = true;
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
      if (blocked(e.target) || animating) return;
      const dy = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
      if (Math.abs(dy) < 40) return;
      step(dy > 0 ? 1 : -1);
    };

    // --- Keyboard ---
    const onKey = (e: KeyboardEvent) => {
      if (document.body.style.overflow === "hidden" || animating) return;
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
      scrollControl.goToProject = null;
      clearTimeout(releaseTimer);
      clearTimeout(gestureIdleTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", collect);
    };
  }, [lenis, reduce]);

  return null;
}
