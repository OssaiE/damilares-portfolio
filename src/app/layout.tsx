import type { Metadata, Viewport } from "next";
import { Inter, Work_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import ScrollTopOnLoad from "@/components/ScrollTopOnLoad";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display face (wordmark, big section titles). Was the self-hosted Oriya Sangam
// MN; now Work Sans — a licensed Google grotesque. Only the weights actually
// used (regular + bold) are loaded; the display look everywhere is `font-bold`.
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const title = `${site.name} — ${site.creator}, ${site.role}`;
const description =
  "Damilare Olawoyin (AreyouDami.) — creative director & editor based in Lagos. Bringing stories that push emotions. Edit. Color. VFX.";

export const metadata: Metadata = {
  metadataBase: new URL("https://areyoudami.com"),
  title: {
    default: title,
    template: "%s — AreyouDami.",
  },
  description,
  keywords: [
    "Damilare Olawoyin",
    "AreyouDami",
    "creative director",
    "film editor",
    "colorist",
    "Lagos",
    "VFX",
    "documentary",
  ],
  authors: [{ name: site.creator }],
  openGraph: {
    type: "website",
    title,
    description,
    siteName: site.name,
    // og:image comes from app/opengraph-image.tsx (the generated home-page card).
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    // twitter:image falls back to the generated og:image.
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${workSans.variable} h-full`}>
      <head>
        {/* Set BEFORE the browser restores scroll on reload, so a reload always
            starts at the top (doing this in an effect runs too late and is racy
            in production). ScrollTopOnLoad is the belt-and-suspenders follow-up. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full bg-ink text-paper">
        <ScrollTopOnLoad />
        <Providers>{children}</Providers>
        {/* Project-wide background noise (density/size tuned in globals.css). */}
        <div className="grain-field" aria-hidden />
      </body>
    </html>
  );
}
