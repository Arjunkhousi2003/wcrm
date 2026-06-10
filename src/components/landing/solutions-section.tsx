"use client";

import { BarChart3, Lock, Palette, Pencil, Rocket, Users } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "./animated";

const solutions = [
  {
    icon: Users,
    gradient: "from-blue-100 to-indigo-100",
    iconColor: "text-indigo-600",
    title: "Smart Contact Management",
    description: "Import from CSV, organize in groups, validate phone numbers automatically",
  },
  {
    icon: Pencil,
    gradient: "from-emerald-100 to-teal-100",
    iconColor: "text-emerald-600",
    title: "Template Library",
    description: "Create reusable templates with variables. One-click personalization.",
  },
  {
    icon: BarChart3,
    gradient: "from-purple-100 to-pink-100",
    iconColor: "text-purple-600",
    title: "Real-Time Analytics",
    description: "Track delivery, read receipts, and engagement. Export reports.",
  },
  {
    icon: Rocket,
    gradient: "from-amber-100 to-orange-100",
    iconColor: "text-orange-600",
    title: "Campaign Automation",
    description: "Schedule bulk sends, A/B test messages, auto-retry failures",
  },
  {
    icon: Palette,
    gradient: "from-pink-100 to-rose-100",
    iconColor: "text-pink-600",
    title: "Media Support",
    description: "Send images, videos, documents. Up to 16MB per file.",
  },
  {
    icon: Lock,
    gradient: "from-yellow-100 to-amber-100",
    iconColor: "text-amber-600",
    title: "API Access",
    description: "Integrate with your CRM, e-commerce, or custom apps",
  },
];

export function SolutionsSection() {
  return (
    <section className="bg-[#f8fafc] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Solutions
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need in One Platform
          </h2>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className={`flex h-36 items-center justify-center bg-gradient-to-br ${item.gradient}`}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-md">
                      <Icon className={`h-8 w-8 ${item.iconColor}`} />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
