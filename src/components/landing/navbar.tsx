"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
        >
          <Logo size="md" priority />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/about"
                ? pathname === "/about"
                : link.href === "/#home"
                  ? pathname === "/"
                  : false;

            const className = cn(
              "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900",
              isActive && "bg-blue-50 text-blue-700"
            );

            return link.href.startsWith("/") && !link.href.includes("#") ? (
              <Link key={link.href} href={link.href} className={className}>
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className={className}>
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-slate-200 bg-white md:hidden"
        >
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) =>
              link.href.startsWith("/") && !link.href.includes("#") ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {link.label}
                </a>
              )
            )}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-4">
              <Link
                href="/login"
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
