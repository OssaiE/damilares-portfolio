"use client";

import Header from "@/components/layout/Header";
import CustomCursor from "@/components/ui/CustomCursor";

/**
 * Persistent chrome: the clapperboard nav (self-contained: bar, drawer, blur
 * backdrop) and the desktop cursor. Kept as a client island so page content
 * can remain server-rendered.
 */
export default function SiteChrome() {
  return (
    <>
      <Header />
      <CustomCursor />
    </>
  );
}
