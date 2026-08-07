import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import GridBackdrop from "@/components/works/GridBackdrop";
import { site, socials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Damilola Olawoyin (AreyouDami.) — creative direction, editing and producing.",
};

const instagram = socials.find((s) => s.label === "Instagram");
const linkedin = socials.find((s) => s.label === "LinkedIn");

const linkClass =
  "font-sans text-lg text-paper underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline focus-visible:text-primary md:text-xl";

export default function ContactPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <SiteChrome
        topRight={
          <span className="inline-flex h-14 items-center text-[15px] font-medium text-primary">
            Contact.
          </span>
        }
      />

      <div className="relative min-h-screen bg-ink">
        <GridBackdrop />

        <main
          id="main"
          className="relative z-10 flex min-h-screen items-center px-[var(--gutter)] pb-24 pt-[150px] md:pt-[200px]"
        >
          <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 md:items-center md:gap-16">
            {/* Left — heading */}
            <h1 className="font-display text-[clamp(2.75rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.02em] text-paper">
              Let&apos;s work
              <br />
              together.
            </h1>

            {/* Right — intro + contact details */}
            <div className="max-w-md">
              <p className="font-sans text-[15px] leading-relaxed text-paper md:text-lg">
                Have a project in mind or want to collaborate? Get in touch
                below.
              </p>

              <dl className="mt-10 space-y-8">
                <div>
                  <dt className="u-label text-subtext">Email</dt>
                  <dd className="mt-1.5">
                    <a href={`mailto:${site.email}`} className={linkClass}>
                      {site.email}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="u-label text-subtext">Instagram</dt>
                  <dd className="mt-1.5">
                    <a
                      href={instagram?.href ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      Instagram profile
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="u-label text-subtext">LinkedIn</dt>
                  <dd className="mt-1.5">
                    <a
                      href={linkedin?.href ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      LinkedIn profile
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
