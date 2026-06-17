"use client";

import { Navbar } from "./navbar";
import { HeroSection } from "./hero-section";
import { ChallengeSection } from "./challenge-section";
import { SolutionsSection } from "./solutions-section";
import { PricingSection } from "./pricing-section";
import { ContactSection } from "./contact-section";
import { FinalCtaSection } from "./final-cta-section";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-900 [color-scheme:light]">
      <Navbar />
      <main>
        <HeroSection />
        <ChallengeSection />
        <div id="solutions">
          <SolutionsSection />
        </div>
        <PricingSection />
        <ContactSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
