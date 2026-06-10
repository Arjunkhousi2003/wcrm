"use client";

import { ArrowRight } from "lucide-react";
import { FadeIn } from "./animated";

export function DemoCtaSection() {
  return (
    <section id="demo" className="bg-[#f8fafc] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#134E5E] via-teal-700 to-[#71B280] px-6 py-14 text-center shadow-xl sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">See It In Action</h2>
              <p className="mx-auto mt-3 max-w-xl text-white/90">
                Try our interactive WhatsApp simulator — no signup required
              </p>
              <a
                href="#demo"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-teal-800 transition hover:scale-105 hover:shadow-lg"
              >
                Launch Demo Simulator
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
