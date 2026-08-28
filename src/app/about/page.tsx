import type { Metadata } from "next";
import AboutExperience from "@/components/about/AboutExperience";

export const metadata: Metadata = {
  title: "About",
  description:
    "Based on a True Story — a documentary look at Damilare Olawoyin (AreyouDami.), Creative Director, and the work he makes.",
};

export default function AboutPage() {
  return <AboutExperience />;
}
