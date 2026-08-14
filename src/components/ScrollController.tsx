"use client";

import { useEffect, useState } from "react";
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
  const [hijack, setHijack] = useState(false);

  // Section-snapping is a desktop-with-a-mouse conceit. On touch devices
  // (phones / tablets) hijacking `touchmove` fights the browser's native
  // scrolling and leaves the page feeling frozen — so there we do nothing and
  // let it scroll normally. Only a fine pointer on a ≥768px viewport opts in.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () => setHijack(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduce || !hijack) return;

    let sections: HTMLElement[] = [];
    const collect = () => {
      sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-snap]"),
      );
    };
    collect();

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

    let animating = false;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
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
      // Safety release: ALWAYS clears `animating` even if onComplete never fires,
      // so the page can never be left stuck/unscrollable.
      releaseTimer = setTimeout(finishAnimation, DURATION * 1000 + 300);

      if (lenis) {
        // One move at a time (guarded by `animating`) so scrollTo calls never
        // overlap — overlapping calls were leaving Lenis stuck (frozen scroll).
        lenis.scrollTo(y, {
          duration: DURATION,
          easing: easeOutQuint,
          lock: true,
          force: true,
          onComplete: finishAnimation,
        });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
        finishAnimation();
      }
    };

    const step = (dir: number) => {
      // Mid-animation: remember the LATEST direction and run it (recomputed from
      // the nearest section) the instant we land — so a scroll during the
      // transition is never lost, and never inverted.
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
    const GESTURE_IDLE = 180; // ms of wheel silence that ends a gesture
    let gestureLock = false;
    let gestureIdleTimer: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      if (blocked(e.target)) return;
      e.preventDefault();
      // The whole fling (finger scroll + inertia tail) keeps resetting this
      // timer, so it's consumed as ONE step; the first significant event sets
      // the direction.
      clearTimeout(gestureIdleTimer);
      gestureIdleTimer = setTimeout(() => {
        gestureLock = false;
      }, GESTURE_IDLE);

      if (gestureLock || Math.abs(e.deltaY) < 4) return;
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
  }, [lenis, reduce, hijack]);

  return null;
}
