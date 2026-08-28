import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Link-preview image, generated to mirror the home page hero: the big yellow
// AreyouDami. wordmark bottom-left with the intro copy above it, on the dark
// cinematic ground. Replaces the old showreel still (a random product frame).
export const alt = `${site.name} — ${site.creator}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px",
          backgroundColor: "#0c0c0c",
          backgroundImage:
            "radial-gradient(120% 130% at 50% 25%, #1b1b1b 0%, #0a0a0a 68%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 32, color: "#FFCC00" }}>Hi</div>
          <div
            style={{
              marginTop: 8,
              fontSize: 46,
              fontWeight: 700,
              color: "#FFCC00",
            }}
          >
            I&apos;m Damilare Olawoyin
          </div>
          <div style={{ marginTop: 4, fontSize: 32, color: "rgba(255,204,0,0.82)" }}>
            {`${site.role} · ${site.location}`}
          </div>
        </div>
        <div
          style={{
            marginTop: 30,
            display: "flex",
            fontSize: 150,
            fontWeight: 700,
            letterSpacing: "-4px",
            lineHeight: 1,
            color: "#FFCC00",
          }}
        >
          AreyouDami.
        </div>
      </div>
    ),
    { ...size },
  );
}
