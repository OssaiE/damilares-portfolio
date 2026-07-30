import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M3 6.5h18M3 12h18M3 17.5h18"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M5 5l14 14M19 5L5 19"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8.5 5.5h3v13h-3zM12.5 5.5h3v13h-3z" fill="currentColor" />
    </svg>
  );
}

export function SoundIcon({ muted, ...props }: IconProps & { muted?: boolean }) {
  return (
    <svg {...base(props)}>
      <path
        d="M4 9v6h3.5L12 19V5L7.5 9H4z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {muted ? (
        <path
          d="M16 9.5l4 5M20 9.5l-4 5"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M15.5 9.5a3.5 3.5 0 010 5M18 7a7 7 0 010 10"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/** Figma-style pointer used in the footer name tag */
export function CursorArrow(props: IconProps) {
  return (
    <svg {...base({ viewBox: "0 0 24 24", ...props })}>
      <path
        d="M5.5 3.2l13.2 7.6-5.9 1.2-2.4 5.7-4.9-14.5z"
        fill="currentColor"
        stroke="#111111"
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------- Social icons --------------------------- */

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect
        x={3.5}
        y={3.5}
        width={17}
        height={17}
        rx={5}
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <circle cx={12} cy={12} r={4} stroke="currentColor" strokeWidth={1.6} />
      <circle cx={17} cy={7} r={1.1} fill="currentColor" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M4 4l16 16M20 4L4 20"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect
        x={3.5}
        y={3.5}
        width={17}
        height={17}
        rx={3}
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <path
        d="M7.2 10v6.3M7.2 7.6v.02M11 16.3V10m0 0c.6-1 4.3-1.6 4.3 2.2v4.1"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect
        x={2.8}
        y={6}
        width={18.4}
        height={12}
        rx={3.5}
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <path d="M10.5 9.4v5.2l4.4-2.6-4.4-2.6z" fill="currentColor" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M13.5 4v9.8a3.2 3.2 0 11-2.6-3.15M13.5 4c.4 2 1.9 3.5 4 3.7"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const socialIconMap: Record<
  string,
  (props: IconProps) => React.ReactElement
> = {
  Instagram: InstagramIcon,
  X: XIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YouTubeIcon,
  TikTok: TikTokIcon,
};
