"use client";

import { AlertTriangle, Lock, TrendingDown, X } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "./animated";

const challenges = [
  {
    icon: X,
    iconClass: "text-red-500 bg-red-50",
    title: "Manual Copy-Paste Hell",
    description: "Spending hours sending individual messages to each customer",
  },
  {
    icon: TrendingDown,
    iconClass: "text-purple-500 bg-purple-50",
    title: "Zero Tracking",
    description: "No idea who received, read, or engaged with your messages",
  },
  {
    icon: AlertTriangle,
    iconClass: "text-amber-500 bg-amber-50",
    title: "High Error Rate",
    description: "Wrong numbers, typos, and duplicate messages costing time & money",
    highlight: true,
  },
  {
    icon: Lock,
    iconClass: "text-yellow-600 bg-yellow-50",
    title: "Locked Contact Data",
    description: "Contacts scattered across Excel sheets, no central database",
  },
];

export function ChallengeSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <p className="text-sm font-medium text-slate-500">The Challenge</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            WhatsApp Marketing Is Broken
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Most businesses struggle with manual messaging and zero analytics
          </p>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {challenges.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div
                  className={`group h-full rounded-2xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${
                    item.highlight
                      ? "border-red-200 hover:border-red-300"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
