import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import ContactExperience from "@/components/contact/ContactExperience";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Damilola Olawoyin (AreyouDami.) — creative direction, editing and producing.",
};

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
          <span className="inline-flex h-14 items-center text-base font-medium text-primary">
            Contact.
          </span>
        }
      />

      <ContactExperience />
    </>
  );
}
