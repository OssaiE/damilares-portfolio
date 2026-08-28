"use client";

import { useEffect } from "react";

/**
 * Always land at the top of the page on a fresh load / reload. Browsers restore
 * the previous scroll position on reload by default; disable that and force the
 * top. (Client-side route navigation is left to Next's own scroll handling.)
 */
export default function ScrollTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);
  return null;
}
