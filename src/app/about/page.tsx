import type { Metadata } from "next";
import { AboutPage } from "@/components/landing/about-page";

export const metadata: Metadata = {
  title: "About Us — TECHDIGI",
  description:
    "Learn about TechDigi Software Pvt. Ltd. — a passionate team of developers, designers, and digital strategists transforming businesses through innovative technology.",
};

export default function About() {
  return <AboutPage />;
}
