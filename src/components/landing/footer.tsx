"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { Logo } from "./logo";

const footerLinks = {
  Product: [
    { label: "Live Demo", href: "/#demo" },
    { label: "Features", href: "/#solutions" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Support", href: "/#contact" },
  ],
  Company: [
    { label: "Sign In", href: "/login" },
    { label: "Contact Us", href: "/#contact" },
    { label: "About Us", href: "/about" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <Logo size="lg" theme="dark" />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-400">{COMPANY.tagline}</p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white">{title}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-slate-400 transition hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-2.5 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>{COMPANY.address.short}</span>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex gap-2.5 text-sm text-slate-400 transition hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                  className="flex gap-2.5 text-sm text-slate-400 transition hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  {COMPANY.phoneDisplay}
                </a>
              </li>
              <li className="text-sm text-slate-500">
                CIN: {COMPANY.cin}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
