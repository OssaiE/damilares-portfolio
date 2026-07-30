/**
 * Single source of truth for site content.
 * Keeping copy + links here keeps components presentational and easy to extend.
 */

export const site = {
  name: "AreyouDami.",
  creator: "Damilola Olawoyin",
  role: "Creative Director",
  email: "damilare@gmail.com",
  phone: "+234 903 0177 712",
  location: "Lagos, NG",
  copyright: "© 2026 - all rights reserved",
} as const;

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

export type Social = { label: string; href: string; icon: string };

export const socials: Social[] = [
  { label: "Instagram", href: "https://instagram.com", icon: "/social/instagram.svg" },
  { label: "X", href: "https://x.com", icon: "/social/x.svg" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "/social/linkedin.svg" },
  { label: "YouTube", href: "https://youtube.com", icon: "/social/youtube.svg" },
  { label: "TikTok", href: "https://tiktok.com", icon: "/social/tiktok.svg" },
];

/** Footer meta columns */
export const meta = [
  { label: "Services", value: "Edit. Color. VFX." },
  { label: "Based in", value: "Lagos, NG" },
  { label: "Availability", value: "Open - 2026" },
  { label: "Let's talk", value: site.email, href: `mailto:${site.email}` },
] as const;

/** Hero "scene" copy */
export const hero = {
  tagline: "Bringing stories that push emotions",
  scene: "Scene 1: You are introduced to Damilare",
  lenses: ["135mm", "50mm", "35mm"],
} as const;

export type Work = {
  title: string;
  category: string;
  year: string;
  poster: string;
  video?: { mp4: string; webm?: string };
};

/**
 * Featured works. Only one video asset was provided, so the Palmwine entry
 * reuses it with an ember grade. Swap `video`/`poster` when final graded
 * footage is delivered.
 */
export const featuredWorks: Work[] = [
  {
    title: "Palmwine Documentary",
    category: "Commercial",
    year: "2023",
    poster: "/images/palmwine-poster.jpg",
    video: { mp4: "/videos/palmwine.mp4", webm: "/videos/palmwine.webm" },
  },
];
