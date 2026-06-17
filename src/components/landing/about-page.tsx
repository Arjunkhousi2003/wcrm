"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Handshake,
  Lightbulb,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import {
  COMPANY,
  COMPANY_APPROACH,
  COMPANY_MILESTONES,
  COMPANY_VALUES,
  TEAM_MEMBERS,
} from "@/lib/company";
import { FadeIn, StaggerChildren, StaggerItem } from "./animated";
import { Footer } from "./footer";
import { Navbar } from "./navbar";

const valueIcons = [Lightbulb, Shield, Sparkles, Handshake, Zap] as const;
const approachIcons = [Users, Target, Rocket] as const;

export function AboutPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-900 [color-scheme:light]">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#f8fafc] pt-28 pb-16 sm:pt-32 sm:pb-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium text-blue-600">About TechDigi</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Transforming Businesses Through{" "}
                <span className="text-blue-600">Innovative Technology</span>
              </h1>
              <p className="mt-5 text-lg text-slate-600">
                We are a passionate team of developers, designers, and digital strategists
                dedicated to transforming businesses through innovative technology solutions.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Who We Are */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <FadeIn>
                <p className="text-sm font-medium text-slate-500">Who We Are</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {COMPANY.legalName}
                </h2>
                <div className="mt-6 space-y-4 text-slate-600">
                  <p>
                    {COMPANY.legalName} specializes in designing, developing, and maintaining
                    digital platforms for companies. Our team of skilled software engineers,
                    developers, designers, and digital marketers work together to meet our
                    clients&apos; unique development and marketing needs.
                  </p>
                  <p>
                    We offer a wide range of services, including web application development,
                    mobile app development, enterprise software solutions, e-commerce platforms,
                    digital marketing, and more. Our expertise enables organizations to leverage
                    technology effectively, enhance operations, and achieve strategic goals.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-blue-900 p-8 sm:p-10">
                  <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/20 blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl" />
                  <div className="relative">
                    <p className="text-sm font-medium text-blue-300">TechDigi Team</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">Working Together</h3>
                    <p className="mt-4 text-white/80">
                      Building solutions that make life simpler and smarter — one project at a
                      time.
                    </p>
                    <div className="mt-8 flex -space-x-3">
                      {TEAM_MEMBERS.slice(0, 5).map((member) => (
                        <Image
                          key={member.name}
                          src={member.avatar}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-white/60">
                      {TEAM_MEMBERS.length}+ dedicated professionals
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="bg-[#f8fafc] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center">
              <p className="text-sm font-medium text-slate-500">Our Approach</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                How We Deliver Excellence
              </h2>
            </FadeIn>
            <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-3">
              {COMPANY_APPROACH.map((item, i) => {
                const Icon = approachIcons[i];
                return (
                  <StaggerItem key={item.title}>
                    <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center">
              <p className="text-sm font-medium text-slate-500">Values</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                What We Believe In
              </h2>
            </FadeIn>
            <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {COMPANY_VALUES.map((value, i) => {
                const Icon = valueIcons[i];
                return (
                  <StaggerItem key={value.title}>
                    <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-slate-200 hover:shadow-md">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-bold text-slate-900">{value.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{value.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Journey */}
        <section className="bg-[#f8fafc] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center">
              <p className="text-sm font-medium text-slate-500">Our Journey</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Key Milestones in Our Growth
              </h2>
            </FadeIn>
            <div className="relative mt-12">
              <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-slate-200 sm:left-1/2 sm:block sm:-translate-x-px" />
              <StaggerChildren className="space-y-8">
                {COMPANY_MILESTONES.map((milestone, i) => (
                  <StaggerItem key={milestone.year}>
                    <div
                      className={`relative flex flex-col gap-4 sm:flex-row sm:items-center ${
                        i % 2 === 0 ? "sm:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="hidden sm:block sm:w-1/2" />
                      <div className="absolute left-4 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-blue-600 bg-white sm:left-1/2 sm:block" />
                      <div className={`sm:w-1/2 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                        <div className="ml-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:ml-0">
                          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {milestone.year}
                          </span>
                          <h3 className="mt-3 font-bold text-slate-900">{milestone.title}</h3>
                          <p className="mt-2 text-sm text-slate-600">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center">
              <p className="text-sm font-medium text-slate-500">Our Team</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Meet the People Behind TechDigi
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                Building solutions that make life simpler and smarter.
              </p>
            </FadeIn>
            <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM_MEMBERS.map((member) => (
                <StaggerItem key={member.name}>
                  <div className="group h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center">
                      <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-slate-100 transition group-hover:ring-blue-100">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={112}
                          height={112}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-slate-900">{member.name}</h3>
                      <p className="mt-1 text-sm font-medium text-blue-600">{member.role}</p>
                      <p className="mt-3 text-sm text-slate-600">{member.bio}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Work With Us?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Let&apos;s discuss how TechDigi can help transform your business with innovative
                technology solutions.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Get Started
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
