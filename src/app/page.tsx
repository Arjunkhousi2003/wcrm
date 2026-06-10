import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "TECHDIGI — WhatsApp Marketing Platform",
  description:
    "Send bulk WhatsApp messages that actually get read. Manage contacts, create templates, and track campaigns in real-time.",
};

export default function HomePage() {
  return <LandingPage />;
}
