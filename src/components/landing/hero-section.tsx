"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Globe, Languages, Rocket, Send, Zap } from "lucide-react";
import { FadeIn } from "./animated";
import { Logo } from "./logo";

const badges = [
  { label: "Cloud Synced", icon: Globe, color: "border-blue-400 text-blue-600" },
  { label: "Lightning Fast", icon: Zap, color: "border-orange-400 text-orange-600" },
  { label: "Multi-language", icon: Languages, color: "border-teal-400 text-teal-600" },
  { label: "Automated Campaigns", icon: Rocket, color: "border-purple-400 text-purple-600" },
  { label: "Instant Delivery", icon: Send, color: "border-sky-400 text-sky-600" },
  { label: "Real-time Analytics", icon: BarChart3, color: "border-green-400 text-green-600" },
];

const stats = [
  { value: "99.2%", label: "DELIVERY RATE" },
  { value: "10K+", label: "MESSAGES/DAY" },
  { value: "5 min", label: "SETUP TIME" },
];

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-x-clip bg-[#f8fafc] pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <FadeIn>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
              🚀 Now with AI-Powered Analytics
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
              Send Bulk WhatsApp Messages That{" "}
              <span className="text-green-500">Actually Get Read</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Manage contacts, create templates, and track campaigns in real-time. No WhatsApp
              Business API needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 hover:scale-[1.02]"
              >
                Try Live Demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-lg border-2 border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                Start Free Trial
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="relative mx-auto w-full lg:max-w-none">
            <div className="mx-auto flex w-fit max-w-full flex-col items-center gap-5 sm:gap-6">
              <div className="relative z-20 shrink-0">
                <Logo
                  size="sm"
                  className="shadow-md shadow-slate-200/60 sm:hidden"
                />
                <Logo
                  size="md"
                  className="hidden shadow-lg shadow-slate-200/60 sm:inline-flex"
                />
              </div>

            <div className="relative z-10 aspect-[9/16] w-[220px] shrink-0 sm:w-[260px] md:w-[280px] lg:w-[300px]">
              {badges.map((badge, i) => {
                const positions = [
                  "left-0 top-8 -translate-x-2 sm:-translate-x-8",
                  "right-0 top-4 translate-x-2 sm:translate-x-6",
                  "left-2 bottom-32 -translate-x-4 sm:-translate-x-10",
                  "right-0 bottom-40 translate-x-2 sm:translate-x-8",
                  "left-6 bottom-16 -translate-x-6",
                  "right-4 bottom-4 translate-x-4",
                ];
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className={`absolute z-10 flex items-center gap-1.5 rounded-full border-2 bg-white px-2.5 py-1.5 text-[10px] font-semibold shadow-md sm:gap-2 sm:px-3 sm:py-2 sm:text-xs ${badge.color} ${positions[i]}`}
                  >
                    <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="whitespace-nowrap">{badge.label}</span>
                  </div>
                );
              })}

              <div className="absolute inset-0 rounded-[2.5rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl">
                <div className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-white">
                  <div className="flex items-center gap-2 bg-[#075E54] px-4 py-3 text-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                      T
                    </div>
                    <div>
                      <p className="text-sm font-semibold">TechDigi Bot</p>
                      <p className="text-[10px] text-green-200">typing...</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 bg-[#e5ddd5] p-3">
                    <div className="max-w-[75%] rounded-lg rounded-tl-none bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
                      Hi! Welcome to TechDigi 👋
                    </div>
                    <div className="ml-auto max-w-[75%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-3 py-2 text-xs text-slate-700 shadow-sm">
                      I&apos;d like to learn about bulk messaging
                    </div>
                    <div className="max-w-[75%] rounded-lg rounded-tl-none bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
                      Great! We can help you send personalized campaigns to thousands of contacts.
                    </div>
                    <div className="ml-auto max-w-[75%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-3 py-2 text-xs text-slate-700 shadow-sm">
                      Sounds perfect! 🚀
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.25}>
          <div className="mt-16 flex flex-col items-center justify-center gap-6 border-t border-slate-200 pt-10 sm:flex-row sm:gap-0">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                {i > 0 && <div className="mx-8 hidden h-10 w-px bg-slate-200 sm:block" />}
                <div className="text-center sm:text-left">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-0.5 text-xs font-medium tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
