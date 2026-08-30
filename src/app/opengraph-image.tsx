import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Link-preview image, generated to mirror the home page hero: the big yellow
// AreyouDami. wordmark bottom-left with the intro copy above it, on the dark
// cinematic ground. Replaces the old showreel still (a random product frame).
export const alt = `${site.name} — ${site.creator}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Every glyph the card renders — used to subset the Work Sans fetch so Google
// serves a TTF (Satori can't parse woff2) and the download stays tiny.
const RENDER_TEXT = `Hi I'm Damilare Olawoyin ${site.role} · ${site.location} ${site.name}`;

/** Fetch one weight of Work Sans as a TTF ArrayBuffer (Satori-compatible).
 *  Subsetting via `text` makes Google return truetype rather than woff2. */
async function loadWorkSans(weight: number): Promise<ArrayBuffer> {
  const url =
    `https://fonts.googleapis.com/css2?family=Work+Sans:wght@${weight}` +
    `&text=${encodeURIComponent(RENDER_TEXT)}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!src) throw new Error("Work Sans TTF url not found");
  const res = await fetch(src[1]);
  if (!res.ok) throw new Error(`Work Sans fetch failed: ${res.status}`);
  return res.arrayBuffer();
}

export default async function OpengraphImage() {
  // Load the display face so the card reads in the same typeface as the site.
  // If the font fetch fails, fall back to Satori's default sans rather than
  // breaking the whole preview image.
  let fonts: NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"];
  try {
    const [regular, semibold] = await Promise.all([
      loadWorkSans(400),
      loadWorkSans(600),
    ]);
    fonts = [
      { name: "Work Sans", data: regular, weight: 400, style: "normal" },
      { name: "Work Sans", data: semibold, weight: 600, style: "normal" },
    ];
  } catch {
    fonts = undefined;
  }

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
          fontFamily: fonts ? "Work Sans" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 32, color: "#FFCC00" }}>Hi</div>
          <div
            style={{
              marginTop: 8,
              fontSize: 46,
              fontWeight: 600,
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
            fontWeight: 600,
            letterSpacing: "-4px",
            lineHeight: 1,
            color: "#FFCC00",
          }}
        >
          AreyouDami.
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
