"use client";

import { useState } from "react";
import { Briefcase, Clock, Globe, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { FadeIn, StaggerChildren, StaggerItem } from "./animated";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sending) return;
    setError(null);
    setSending(true);

    try {
      const response = await fetch("/api/user-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Failed to send message");
      }

      setSubmitted(true);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Failed to submit contact message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative bg-[#f8fafc] py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(148,163,184,0.15) 40px, rgba(148,163,184,0.15) 41px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-blue-900 px-6 py-12 text-center sm:px-12">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Get in <span className="text-yellow-400">Touch</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/80">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll
              respond as soon as possible.
            </p>
          </FadeIn>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <StaggerChildren className="space-y-5">
            <StaggerItem>
              <div className="rounded-2xl border border-slate-900/10 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Reach out to us through any of these channels
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-4 rounded-xl border border-slate-200 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Address</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {COMPANY.legalName}
                        <br />
                        {COMPANY.address.full}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-xl border border-slate-200 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <a
                        href={`mailto:${COMPANY.email}`}
                        className="mt-1 block text-sm text-slate-600 hover:text-blue-600"
                      >
                        {COMPANY.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-xl border border-slate-200 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-500">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <a
                        href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                        className="mt-1 block text-sm text-slate-600 hover:text-blue-600"
                      >
                        {COMPANY.phone}
                      </a>
                      <p className="mt-1 text-xs text-slate-500">Mon–Fri, 9am–5pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-2xl border border-slate-900 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-700" />
                  <h4 className="font-semibold text-slate-900">Business Hours</h4>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>{COMPANY.hours.weekdays}</li>
                  <li>{COMPANY.hours.saturday}</li>
                  <li>{COMPANY.hours.sunday}</li>
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-2xl bg-slate-100 p-6">
                <p className="mb-4 text-sm font-semibold text-slate-700">Follow Us</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Globe, label: "Website" },
                    { icon: Briefcase, label: "LinkedIn" },
                    { icon: Share2, label: "Twitter" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:shadow-sm"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </StaggerItem>
          </StaggerChildren>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-slate-900 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-slate-900">Send us a Message</h3>
              <p className="mt-1 text-sm text-slate-600">
                Fill out the form below and we&apos;ll get back to you within 24 hours
              </p>

              {submitted ? (
                <div className="mt-8 rounded-xl bg-green-50 p-6 text-center">
                  <p className="font-semibold text-green-800">Message sent!</p>
                  <p className="mt-1 text-sm text-green-700">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                        placeholder="John Doe"
                        disabled={sending}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="john@example.com"
                        disabled={sending}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder={COMPANY.phone}
                      disabled={sending}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.subject}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, subject: e.target.value }))
                      }
                      placeholder="How can we help?"
                      disabled={sending}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="Tell us more about your needs..."
                      disabled={sending}
                      className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-12">
          <h3 className="text-center text-xl font-bold text-slate-900">Find Us on Map</h3>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <iframe
              title="TechDigi office location"
              src={COMPANY.mapEmbedUrl}
              className="h-64 w-full border-0 sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
