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

/* ------------------------------------------------------------------ */
/*  About page — the "documentary" experience.                         */
/*  IMAGES ARE PLACEHOLDERS (only two stills ship in the repo). Drop    */
/*  the real photos in /public/images/about/ and repoint `portrait` +   */
/*  each gallery `src` below — everything else is data-driven.          */
/* ------------------------------------------------------------------ */
export type AboutCredit = { scene: string; body: string };
export type GalleryShot = {
  src: string;
  /** CSS aspect-ratio for the frame (keeps photos uncropped-ish, varied). */
  aspect: string;
  role: string;
  location: string;
  project?: string;
  year?: string;
};

export const about = {
  chapterOne: "Based on a True Story.",
  chapterTwo: "The Creative in His Element.",
  portrait: "/images/hero-poster.jpg", // → /images/about/portrait.jpg
  intro: `${site.creator} — ${site.role}, ${site.location}.`,
  credits: [
    {
      scene: "Scene 01 — Origins",
      body: "Lagos, first light. A kid who saw the world in frames long before he ever held a camera — learning early that every story is really about the people inside it.",
    },
    {
      scene: "Scene 02 — The Craft",
      body: "Direction, editing, colour. The quiet hours where footage becomes feeling — pacing a cut until it breathes, grading a frame until it remembers the room.",
    },
    {
      scene: "Scene 03 — The Collaborators",
      body: "Artists, musicians and brands who trust the process. From studio sessions to sold-out stages, the work is built shoulder to shoulder.",
    },
    {
      scene: "Scene 04 — The Vision",
      body: "Stories that push emotion first. Cinema made for the culture it comes from — honest, textured, and unmistakably ours.",
    },
    {
      scene: site.role,
      body: `${site.creator} — ${site.location}.`,
    },
  ] as AboutCredit[],
  gallery: [
    { src: "/images/palmwine-poster.jpg", aspect: "3 / 2", role: "Creative Director", location: "Lagos, Nigeria", project: "Trace Live", year: "2024" },
    { src: "/images/hero-poster.jpg", aspect: "3 / 4", role: "On Set", location: "Lagos, Nigeria", project: "Palmwine Fest", year: "2024" },
    { src: "/images/palmwine-poster.jpg", aspect: "4 / 5", role: "Directing", location: "Lagos, Nigeria", project: "Trace Sessions", year: "2024" },
    { src: "/images/hero-poster.jpg", aspect: "3 / 2", role: "In the Edit", location: "Lagos, Nigeria", project: "Lord's Gin", year: "2024" },
    { src: "/images/palmwine-poster.jpg", aspect: "9 / 16", role: "On Stage", location: "Lagos, Nigeria", project: "Live Show", year: "2024" },
    { src: "/images/hero-poster.jpg", aspect: "3 / 2", role: "Collaborating", location: "Lagos, Nigeria", project: "Studio Session", year: "2023" },
    { src: "/images/palmwine-poster.jpg", aspect: "3 / 4", role: "Producing", location: "Lagos, Nigeria", project: "Documentary", year: "2023" },
    { src: "/images/hero-poster.jpg", aspect: "4 / 5", role: "Behind the Lens", location: "Lagos, Nigeria", project: "Campaign Film", year: "2023" },
  ] as GalleryShot[],
} as const;

/* ------------------------------------------------------------------ */
/*  Works catalogue — one shared source powering the Works page's       */
/*  Grid / List / Zoom views.                                           */
/*  NOTE: only two images ship in this repo, so `thumbnail` alternates  */
/*  them as PLACEHOLDERS. Swap each for the real graded still.          */
/* ------------------------------------------------------------------ */
export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  services: string;
  /** Stacked role credits (see the detail page's ROLE column). */
  role: string[];
  description: string;
  thumbnail: string;
  /** Large full-bleed still for the detail-page hero. */
  heroImage: string;
  /** Optional — the "Watch on YouTube" CTA hides when absent. */
  youtubeUrl?: string;
  /** Detail route, `/works/<slug>`. */
  href: string;
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const PROJECT_THUMBS = [
  "/images/palmwine-poster.jpg",
  "/images/hero-poster.jpg",
] as const;

export const projects: Project[] = [
  "Trace Live with Fireboy",
  "Trace Live with Wandecoal",
  "PALMWINE FEST_ (The Making)_Documentry",
  "IB QUAKE_Lord's Achievers Awards_ INTERVIEW_2024",
  "Lord's Gin Achievers Awards - [JOHNNY DRILLE]",
  "SWEET 16: PDSTRN - #TraceSweet16",
  "Get to Know Olumide Oworu",
  "Get To Know Dami Oniru",
  "Get to Know: YKB",
  "How Angel Became Africa's Billionaire Stylist",
  "How Ireti Built Africa's Largest Street Wear Convention",
  "TRACE SESSIONS with MOHBAD - #TraceSessions",
  "Feminist and Marriage | THE DIALOGUE ON SNOOPER",
  "TRACE LIVE with FIREBOY - 2023",
  "TRACE LIVE with CHIKE - 2023",
  "FLAVOUR'S HOMECOMING CONCERT @UMUNZE",
  "Hennessy VS Class VIII Episode 5",
  "TRACE SESSIONS with Vector #TraceSessions",
  "TRACE MENTAL HEALTH CAMPAIGN AWARENESS VIDEO",
  "RICKROSSxDAVIDO CONCERT_LAGOS",
].map((title, i) => {
  const s = slug(title);
  const thumb = PROJECT_THUMBS[i % PROJECT_THUMBS.length];
  return {
    id: `${s}-${i}`,
    slug: s,
    title,
    client: "Trace",
    year: "2024",
    services: "Creative direction, editing, producing",
    role: ["Creative direction", "Editing", "Colouring"],
    // Placeholder copy — swap for the real project write-up before launch.
    description: `${title} is a Trace production directed, edited and coloured in-house at AreyouDami. We shaped the story in the edit — pacing the energy of the room, grading for mood and finishing to a broadcast-ready master.`,
    thumbnail: thumb,
    // Placeholder — reuse the poster until a graded hero still ships.
    heroImage: thumb,
    // Placeholder — point each at its real YouTube upload before launch.
    youtubeUrl: "https://www.youtube.com/@areyoudami",
    href: `/works/${s}`,
  };
});

export type Work = {
  title: string;
  category: string;
  year: string;
  /** Preview clip length in seconds — drives the transport bar / timecode. */
  runtime: number;
  /** Where in the source video the 5s preview window begins. */
  clipStart?: number;
  poster?: string;
  video?: { mp4: string; webm?: string };
};

/**
 * Selected works. These scroll through the works section one project at a
 * time (fela.tv-style), with a side indicator tracking 1 → 8.
 *
 * NOTE: only two source clips were provided (palmwine + showreel-bg). As a
 * PLACEHOLDER they're reused here, each panel showing a different 5-second
 * window (`clipStart`) on loop. Swap `video`/`poster` for the real graded
 * preview per project as final footage is delivered.
 */
export const featuredWorks: Work[] = [
  {
    title: "Palmwine Documentary",
    category: "Commercial",
    year: "2023",
    runtime: 5,
    clipStart: 0,
    poster: "/images/palmwine-poster.jpg",
    video: { mp4: "/videos/palmwine.mp4", webm: "/videos/palmwine.webm" },
  },
  {
    title: "Lagos After Dark",
    category: "Music Video",
    year: "2024",
    runtime: 5,
    clipStart: 0,
    poster: "/images/hero-poster.jpg",
    video: { mp4: "/videos/showreel-bg.mp4" },
  },
  {
    title: "Gold & Grit",
    category: "Commercial",
    year: "2023",
    runtime: 5,
    clipStart: 10,
    poster: "/images/palmwine-poster.jpg",
    video: { mp4: "/videos/palmwine.mp4", webm: "/videos/palmwine.webm" },
  },
  {
    title: "Echoes of Home",
    category: "Short Film",
    year: "2022",
    runtime: 5,
    clipStart: 8,
    poster: "/images/hero-poster.jpg",
    video: { mp4: "/videos/showreel-bg.mp4" },
  },
  {
    title: "Neon Harmattan",
    category: "Fashion Film",
    year: "2024",
    runtime: 5,
    clipStart: 5,
    poster: "/images/palmwine-poster.jpg",
    video: { mp4: "/videos/palmwine.mp4", webm: "/videos/palmwine.webm" },
  },
  {
    title: "The Last Danfo",
    category: "Documentary",
    year: "2023",
    runtime: 5,
    clipStart: 4,
    poster: "/images/hero-poster.jpg",
    video: { mp4: "/videos/showreel-bg.mp4" },
  },
  {
    title: "Sunlight Sessions",
    category: "Music Video",
    year: "2022",
    runtime: 5,
    clipStart: 14,
    poster: "/images/palmwine-poster.jpg",
    video: { mp4: "/videos/palmwine.mp4", webm: "/videos/palmwine.webm" },
  },
  {
    title: "Becoming",
    category: "Brand Film",
    year: "2024",
    runtime: 5,
    clipStart: 12,
    poster: "/images/hero-poster.jpg",
    video: { mp4: "/videos/showreel-bg.mp4" },
  },
];
