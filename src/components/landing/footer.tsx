"use client";

import Link from "next/link";
import { Logo } from "./logo";

const footerLinks = {
  Product: [
    { label: "Live Demo", href: "#demo" },
    { label: "Features", href: "#solutions" },
    { label: "Pricing", href: "#pricing" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Support", href: "#contact" },
  ],
  Company: [
    { label: "Sign In", href: "/login" },
    { label: "Contact Us", href: "#contact" },
    { label: "About Us", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="#home"
              className="inline-block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <Logo size="lg" theme="dark" />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Empowering businesses with smart WhatsApp marketing automation.
            </p>
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
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} TechDigi Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
