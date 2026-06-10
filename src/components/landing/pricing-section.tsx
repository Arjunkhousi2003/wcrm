"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "./animated";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small businesses",
    popular: false,
    features: [
      { text: "500 messages/month", included: true },
      { text: "100 contacts", included: true },
      { text: "5 templates", included: true },
      { text: "Basic analytics", included: true },
      { text: "Email support", included: true },
      { text: "API access", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free Trial",
    href: "/signup",
    variant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$99",
    description: "For growing teams",
    popular: true,
    features: [
      { text: "5,000 messages/month", included: true },
      { text: "Unlimited contacts", included: true },
      { text: "Unlimited templates", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: true },
      { text: "Custom integrations", included: false },
    ],
    cta: "Start Free Trial",
    href: "/signup",
    variant: "solid" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    popular: false,
    features: [
      { text: "Unlimited messages", included: true },
      { text: "Unlimited contacts", included: true },
      { text: "Unlimited templates", included: true },
      { text: "Real-time analytics", included: true },
      { text: "Dedicated support", included: true },
      { text: "API access", included: true },
      { text: "Custom integrations", included: true },
      { text: "SLA guarantee", included: true },
    ],
    cta: "Contact Sales",
    href: "#contact",
    variant: "outline" as const,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, Transparent Plans
          </h2>
          <p className="mt-3 text-slate-600">No hidden fees. Cancel anytime.</p>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8 ${
                  plan.popular
                    ? "border-slate-900 shadow-md ring-1 ring-slate-900"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-sm text-slate-500">/month</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600">{plan.description}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2.5 text-sm">
                      {feature.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                      )}
                      <span
                        className={feature.included ? "text-slate-700" : "text-slate-400"}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition hover:scale-[1.02] ${
                    plan.variant === "solid"
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
