/**
 * Single source of truth for site content.
 * Keeping copy + links here keeps components presentational and easy to extend.
 */

export const site = {
  name: "AreyouDami.",
  creator: "Damilola Olawoyin",
  role: "Creative Director",
  email: "damilare@gmail.com",
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
  intro: "Hi",
  lines: [
    "I'm Damilare Olawoyin.",
    "I'm a creative based in Lagos, Nigeria",
    "Bringing stories that push emotions",
  ],
  lenses: ["135mm", "50mm", "35mm"],
} as const;

/* ------------------------------------------------------------------ */
/*  About page — the "documentary" experience.                         */
/*  IMAGES ARE PLACEHOLDERS (only two stills ship in the repo). Drop    */
/*  the real photos in /public/images/about/ and repoint `portrait` +   */
/*  each gallery `src` below — everything else is data-driven.          */
/* ------------------------------------------------------------------ */
export type GalleryShot = {
  src: string;
  /** CSS aspect-ratio for the frame (keeps photos uncropped-ish, varied). */
  aspect: string;
  /** What he's doing in the frame — top hover line (Inter regular 20). */
  action: string;
  /** His role/title — bottom hover line (Inter semibold 24). */
  role: string;
};

export const about = {
  chapterOne: "Based on a True Story.",
  chapterTwo: "The Creative in His Element.",
  portrait: "/images/hero-poster.jpg", // → /images/about/portrait.jpg
  intro: `${site.creator} — ${site.role}, ${site.location}.`,
  bio: [
    "I'm Damilare Olawoyin, a filmmaker and creative director who lives for moments that move people. For me, storytelling isn't just a craft; it's an instinct. It's the way I see the world. Every frame, every cut, every sound is a chance to pull an audience into an experience they won't forget.",
    "Over the years, I've built my career around creating visuals that feel alive, from high-energy commercials and brand films to emotionally grounded digital content and TV projects. I work end-to-end across the creative process: directing, editing, colour grading, sound design, VFX, and post-production supervision, allowing me to shape the heartbeat of a project from concept to final delivery.",
    "My style blends cinematic storytelling with modern, sleek visual craftsmanship. I'm obsessed with rhythm, emotion, and detail, the pace of an edit, the weight of a sound cue, the glow of a highlight, the way colour shifts the mood. I create with intention, ensuring everything on screen is saying something.",
    "As a director and editor, I'm drawn to stories that feel bold, human, and visually striking. As a post-production artist, I'm meticulous when sculpting visuals, enhancing realism, and building atmosphere. Whether I'm on set bringing a vision together or in the edit refining the soul of a piece, I lead with clarity, creativity, and purpose.",
    "I'm constantly pushing myself, experimenting with new techniques, blending practical and digital storytelling, and exploring the next evolution of visual language. At the core of everything I make is one mission:",
    "To craft visuals that resonate… stories that breathe… and experiences that stay with you long after the screen goes dark.",
  ] as string[],
  gallery: [
    { src: "/images/about/el-1.jpg", aspect: "3 / 4", action: "On Set", role: "Videographer" },
    { src: "/images/about/el-2.jpg", aspect: "3 / 2", action: "Directing the Crew", role: "Creative Director" },
    { src: "/images/about/el-3.jpg", aspect: "3 / 4", action: "On Stage", role: "Creative Director" },
    { src: "/images/about/el-4.jpg", aspect: "3 / 4", action: "Monitoring the Shot", role: "Director" },
    { src: "/images/about/el-5.jpg", aspect: "4 / 3", action: "In Conversation", role: "Creative Director" },
    { src: "/images/about/el-6.jpg", aspect: "3 / 4", action: "Spotlight", role: "Director" },
    { src: "/images/about/el-7.jpg", aspect: "4 / 3", action: "Behind the Lens", role: "Videographer" },
    { src: "/images/about/el-8.jpg", aspect: "3 / 2", action: "Calling the Shot", role: "Creative Director" },
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

/** Pull the 11-char video id out of a youtu.be / watch?v= URL. */
const ytId = (url: string) => {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
};

/** Local copy of each video's YouTube thumbnail (see public/images/works). */
const ytThumb = (url: string) => `/images/works/${ytId(url)}.jpg`;

const PROJECT_THUMBS = [
  "/images/palmwine-poster.jpg",
  "/images/hero-poster.jpg",
] as const;

/** The real catalogue. `category` surfaces as the "Services"/type label; the
 *  role credits stack on the detail page. Thumbnails/hero stills are still the
 *  two ship-ready placeholders until graded stills are delivered. */
const PROJECT_DATA: {
  title: string;
  category: string;
  year: string;
  role: string[];
  client: string;
  description: string;
  youtubeUrl: string;
}[] = [
  {
    title: "Talking the Most — Prandas",
    category: "Music Video",
    year: "2026",
    role: ["Editor", "Colorist"],
    client: "Prandas",
    description:
      "A performance-driven visual piece built around Prandas' presence, energy, and distinct musical identity. I contributed to the visual execution, using cinematic framing, movement, and rhythm to create an immersive visual world that complements the track.",
    youtubeUrl: "https://www.youtube.com/watch?v=Bgx95FVAoM8",
  },
  {
    title: "Sooyah Bistro",
    category: "Brand Documentary",
    year: "2025",
    role: ["Editor", "Colorist"],
    client: "Sooyah Bistro",
    description:
      "A cinematic documentary exploring the story, atmosphere, and identity behind Sooyah Bistro. The film uses intimate moments, rich visuals, and observational storytelling to capture the people, culture, and experience that define the brand.",
    youtubeUrl: "https://youtu.be/BPLOhvkpE5I",
  },
  {
    title: "TraceLive with Ruger",
    category: "TV Commercial",
    year: "2025",
    role: ["Director", "Editor", "Colorist"],
    client: "Trace",
    description:
      "A high-energy visual campaign built around the raw energy and personality of Ruger, capturing the spirit of TRACE Live through dynamic performance, bold imagery, and a fast-paced cinematic approach.",
    youtubeUrl: "https://youtu.be/j0-GoI2b7Pc",
  },
  {
    title: "Adroh Homes",
    category: "TV Commercial",
    year: "2025",
    role: ["Creative Director", "Editor"],
    client: "Adroh Homes",
    description:
      "A culturally rooted commercial inspired by the colour, elegance, and spectacle of Ojude Oba. I contributed to the visual execution, capturing the celebration through cinematic compositions, vibrant imagery, and a strong sense of place and tradition.",
    youtubeUrl: "https://youtu.be/NpVuuC07kZ0",
  },
  {
    title: "American Cola",
    category: "Digital Commercial",
    year: "2025",
    role: ["Editor", "Colorist"],
    client: "American Cola",
    description:
      "A vibrant TV commercial for American Cola, created to capture the energy, refreshment, and youthful spirit of the brand through dynamic visuals and engaging storytelling.",
    youtubeUrl: "https://youtu.be/uaxwfqOuOU8",
  },
  {
    title: "Palmwine Fest — The Making",
    category: "Documentary",
    year: "2024",
    role: ["Editor", "Colorist"],
    client: "Palmwine Fest",
    description:
      "A behind-the-scenes documentary capturing the energy, scale, and creative process behind Palmwine Fest. Through intimate moments, candid perspectives, and cinematic imagery, the film explores the people and production that bring the festival experience to life.",
    youtubeUrl: "https://youtu.be/WPUffgFapd8",
  },
  {
    title: "Lord's Achievers Awards — IB Quake",
    category: "Interview",
    year: "2024",
    role: ["Director", "Cinematographer", "Editor"],
    client: "Lord's Gin",
    description:
      "A character-driven interview capturing IB Quake's journey, personality, and creative perspective with the elegance and atmosphere of the Lord's Gin Achievers Awards.",
    youtubeUrl: "https://youtu.be/2hBNssMe0bM",
  },
  {
    title: "Lord's Achievers Awards — Johnny Drille",
    category: "Interview",
    year: "2023",
    role: ["Cinematographer", "Editor"],
    client: "Lord's Gin",
    description:
      "A cinematic artist profile capturing Johnny Drille beyond the stage, blending intimate portraiture with the elegance and atmosphere of the Lord's Gin Achievers Awards.",
    youtubeUrl: "https://youtu.be/ltywxkqvzp4",
  },
  {
    title: "Trace Mental Health Campaign",
    category: "Short Documentary",
    year: "2022",
    role: ["Director", "Editor", "Colorist"],
    client: "Trace",
    description:
      "A socially driven campaign film created to spark conversation around mental health and emotional wellbeing. I contributed to the visual execution, using intimate performances and cinematic framing to communicate the campaign's message with honesty and emotional weight.",
    youtubeUrl: "https://youtu.be/-xOwXtaQRts",
  },
  {
    title: "Trace Sessions with Fola",
    category: "Music Performance",
    year: "2025",
    role: ["Creative Director", "Editor"],
    client: "Trace",
    description:
      "A cinematic live-session experience capturing Fola's distinctive sound and energy. I contributed to the visual execution, using intimate framing, dynamic camera movement, and atmospheric imagery to create a visual world that complements the music and performance.",
    youtubeUrl: "https://youtu.be/H1gb-_llab8",
  },
  {
    title: "Trace Sessions with Mohbad",
    category: "Music Performance",
    year: "2023",
    role: ["Editor"],
    client: "Trace",
    description:
      "A cinematic live-session capturing Mohbad's raw energy, personality, and unmistakable sound. I contributed to the visual execution, using dynamic camera movement, intimate framing, and atmospheric imagery to translate the energy of his performance into a compelling visual experience.",
    youtubeUrl: "https://youtu.be/lztk0SWApAw",
  },
  {
    title: "Get to Know — Dami Oniru",
    category: "Editorial",
    year: "2024",
    role: ["Editor", "Colorist"],
    client: "Dami Oniru",
    description:
      "A character-driven profile exploring Dami Oniru's creative journey, personality, and perspective as an artist. I contributed to the visual execution, using intimate framing, considered compositions, and a relaxed cinematic approach to create an authentic portrait that lets her story and personality lead.",
    youtubeUrl: "https://youtu.be/Dh2nLfUEfB8",
  },
  {
    title: "Get to Know — Olumide Oworu",
    category: "Editorial",
    year: "2024",
    role: ["Editor", "Colorist"],
    client: "Olumide Oworu",
    description:
      "A character-driven profile offering an intimate look into Olumide Oworu's personality, journey, and life beyond the screen. I contributed to the visual execution, using cinematic framing, natural performances, and a considered visual rhythm to create an authentic portrait of the actor.",
    youtubeUrl: "https://youtu.be/ZgpxbMEt-y4",
  },
  {
    title: "Victoria Orenze — Father We Are Grateful",
    category: "Music Performance",
    year: "2025",
    role: ["Creative Director", "Editor", "Colorist"],
    client: "Victoria Orenze",
    description:
      "A cinematic worship film built around intimacy, emotion, and spiritual expression. I contributed to the visual execution, using atmospheric lighting, intentional framing, and fluid movement to create a visual experience that complements Victoria Orenze's powerful performance.",
    youtubeUrl: "https://youtu.be/_CmXr8vbS0k",
  },
  {
    title: "This Week Tonight — Nescafé (Ep. 3)",
    category: "Brand Campaign",
    year: "2026",
    role: ["Director", "Editor", "Colorist"],
    client: "Nescafé",
    description:
      "A high-energy branded content piece built around anticipation, excitement, and the reveal of the third draw winners. I contributed to the visual execution, using dynamic coverage, energetic pacing, and polished compositions to build momentum and capture the excitement of the moment.",
    youtubeUrl: "https://youtu.be/JMu_8y4YCaU",
  },
  {
    title: "This Week Tonight — Nescafé (Ep. 2)",
    category: "Brand Campaign",
    year: "2026",
    role: ["Director", "Editor", "Colorist"],
    client: "Nescafé",
    description:
      "A high-energy branded content piece built around anticipation, excitement, and the reveal of the second draw winners. I contributed to the visual execution, using dynamic coverage, energetic pacing, and polished compositions to build momentum and capture the excitement of the moment.",
    youtubeUrl: "https://youtu.be/SW0ExaiVgXY",
  },
  {
    title: "Flavour's Homecoming Concert",
    category: "Event Recap",
    year: "2022",
    role: ["Cinematographer", "Editor", "Colorist"],
    client: "Flavour",
    description:
      "A cinematic edit capturing the energy, scale, and cultural spirit of Flavour's homecoming concert in Umunze. I shaped the footage into an immersive visual experience, blending performance, atmosphere, and intimate moments to tell the story of a celebration rooted in music, community, and home.",
    youtubeUrl: "https://youtu.be/L7pGWZiu-8E",
  },
  {
    title: "TraceLive with Wande Coal",
    category: "Event Recap",
    year: "2023",
    role: ["Editor", "Colorist"],
    client: "Trace",
    description:
      "A cinematic concert film capturing Wande Coal's commanding stage presence and the electric atmosphere of TRACE Live. I contributed to the visual execution and edit, shaping the energy of the performance, crowd, and live experience into a dynamic visual story.",
    youtubeUrl: "https://youtu.be/usRUgdnJ6s0",
  },
  {
    title: "Hennessy VS Class VIII — Ep. 3",
    category: "TV Show",
    year: "2022",
    role: ["Editor"],
    client: "Hennessy",
    description:
      "A high-energy episode of Hennessy VS Class, capturing the intensity, personality, and competitive spirit of Nigeria's emerging MCs. I contributed to the visual execution, using dynamic coverage, fast-paced editing, and cinematic imagery to bring the battle and culture of the series to life.",
    youtubeUrl: "https://youtu.be/yb0MomsOSAg",
  },
  {
    title: "Hennessy VS Class VIII — Ep. 5",
    category: "TV Show",
    year: "2022",
    role: ["Editor"],
    client: "Hennessy",
    description:
      "A high-energy episode of Hennessy VS Class that captures the tension, personality, and competitive spirit of the MCs as they battle for their place in the competition. I contributed to the visual execution, using dynamic coverage, cinematic compositions, and fast-paced editing to amplify the energy of the series.",
    youtubeUrl: "https://youtu.be/ySmNbUmo5cE",
  },
];

export const projects: Project[] = PROJECT_DATA.map((p, i) => {
  const s = slug(p.title);
  const thumb = ytThumb(p.youtubeUrl) || PROJECT_THUMBS[i % PROJECT_THUMBS.length];
  return {
    id: `${s}-${i}`,
    slug: s,
    title: p.title,
    client: p.client,
    year: p.year,
    services: p.category,
    role: p.role,
    description: p.description,
    thumbnail: thumb,
    heroImage: thumb,
    youtubeUrl: p.youtubeUrl,
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
 * Selected works — the FIRST 8 of the catalogue, scrolling through the works
 * section one project at a time (fela.tv-style), side indicator 1 → 8.
 *
 * NOTE: real preview clips weren't provided (the catalogue links to YouTube),
 * so the two ship-ready source clips (palmwine + showreel-bg) are reused here
 * as PLACEHOLDER previews — each panel loops a different 5-second window
 * (`clipStart`). Swap `video`/`poster` per project as final footage is delivered.
 */
const FW_CLIP_START = [0, 6, 10, 8, 5, 4, 14, 12] as const;

export const featuredWorks: Work[] = PROJECT_DATA.slice(0, 8).map((p, i) => ({
  title: p.title,
  category: p.category,
  year: p.year,
  runtime: 5,
  clipStart: FW_CLIP_START[i],
  poster: ytThumb(p.youtubeUrl),
  video:
    i % 2 === 0
      ? { mp4: "/videos/palmwine.mp4", webm: "/videos/palmwine.webm" }
      : { mp4: "/videos/showreel-bg.mp4" },
}));
