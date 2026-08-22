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

/** Circle-enclosed play / pause (provided assets, recolored via currentColor) */
export function PlayCircleIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      focusable={false}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.9987 14.6663C11.6806 14.6663 14.6654 11.6816 14.6654 7.99967C14.6654 4.31778 11.6806 1.33301 7.9987 1.33301C4.3168 1.33301 1.33203 4.31778 1.33203 7.99967C1.33203 11.6816 4.3168 14.6663 7.9987 14.6663Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.33203 5.97656C6.33203 5.65837 6.33203 5.49928 6.39853 5.41046C6.45647 5.33306 6.54517 5.28463 6.64162 5.27774C6.75229 5.26984 6.88611 5.35587 7.15377 5.52793L10.3008 7.55105C10.5331 7.70035 10.6492 7.77501 10.6893 7.86993C10.7244 7.95288 10.7244 8.04647 10.6893 8.12941C10.6492 8.22434 10.5331 8.29899 10.3008 8.4483L7.15377 10.4714C6.88611 10.6435 6.75229 10.7295 6.64162 10.7216C6.54517 10.7147 6.45647 10.6663 6.39853 10.5889C6.33203 10.5001 6.33203 10.341 6.33203 10.0228V5.97656Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PauseCircleIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      focusable={false}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.33203 9.99967V5.99967M9.66536 9.99967V5.99967M14.6654 7.99967C14.6654 11.6816 11.6806 14.6663 7.9987 14.6663C4.3168 14.6663 1.33203 11.6816 1.33203 7.99967C1.33203 4.31778 4.3168 1.33301 7.9987 1.33301C11.6806 1.33301 14.6654 4.31778 14.6654 7.99967Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  // Solid YouTube play badge. One currentColor shape with the play triangle
  // knocked out (evenodd), so the badge follows the text colour and the arrow
  // shows the button background through it — inverts cleanly on hover.
  return (
    <svg {...base(props)} viewBox="0 0 24 16">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.8673 16H3.86599C1.72496 16 0 14.1065 0 11.7775V4.22249C0 1.88402 1.73363 0 3.86599 0H19.8673C22.0083 0 23.7333 1.89349 23.7333 4.22249V11.7775C23.742 14.116 22.0083 16 19.8673 16ZM16.0634 7.88166L9.33203 4V11.7633L16.0634 7.88166Z"
        fill="currentColor"
      />
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
