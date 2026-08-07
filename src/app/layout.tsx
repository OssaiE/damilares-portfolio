import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const title = `${site.name} — ${site.creator}, ${site.role}`;
const description =
  "Damilola Olawoyin (AreyouDami.) — creative director & editor based in Lagos. Bringing stories that push emotions. Edit. Color. VFX.";

export const metadata: Metadata = {
  metadataBase: new URL("https://areyoudami.com"),
  title: {
    default: title,
    template: "%s — AreyouDami.",
  },
  description,
  keywords: [
    "Damilola Olawoyin",
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
    images: [{ url: "/images/hero-poster.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-poster.jpg"],
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
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-ink text-paper">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
