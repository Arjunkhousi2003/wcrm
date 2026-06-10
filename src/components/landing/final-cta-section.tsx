"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { FadeIn } from "./animated";

const trustBadges = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
];

export function FinalCtaSection() {
  return (
    <section className="bg-[#f8fafc] pb-20 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 px-6 py-14 text-center shadow-xl sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, transparent, transparent 24px, rgba(255,255,255,0.08) 24px, rgba(255,255,255,0.08) 48px)",
              }}
            />

            <div className="absolute right-6 top-6 hidden rounded-lg bg-black/30 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white sm:block">
              99.2% UPTIME
            </div>
            <div className="absolute bottom-6 left-6 hidden rounded-lg bg-black/30 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white sm:block">
              24/7 SUPPORT
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Transform Your WhatsApp Marketing?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/85">
                Join 10,000+ businesses sending smarter messages.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#demo"
                  className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:scale-105"
                >
                  Try Interactive Demo
                </a>
                <Link
                  href="/signup"
                  className="rounded-xl border-2 border-white px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:scale-105"
                >
                  Start Free Trial
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {trustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs text-white/90"
                  >
                    <Check className="h-3.5 w-3.5 text-green-400" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
