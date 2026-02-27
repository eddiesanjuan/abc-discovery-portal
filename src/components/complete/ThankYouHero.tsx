"use client";

import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";

export default function ThankYouHero() {
  return (
    <section className="pt-8 pb-4 text-center">
      {/* Logo */}
      <FadeIn>
        <div className="flex justify-center mb-8">
          <Image
            src="/efsj-logo.png"
            alt="E.F. San Juan - Celebrating 50 Years"
            width={96}
            height={96}
            className="rounded-full"
            priority
          />
        </div>
      </FadeIn>

      {/* Completion checkmark */}
      <FadeIn delay={0.15}>
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </FadeIn>

      {/* Gold accent line */}
      <FadeIn delay={0.25}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-px bg-gold" />
        </div>
      </FadeIn>

      {/* Headline */}
      <FadeIn delay={0.35}>
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-charcoal leading-tight">
          Thank You for Your Time
        </h1>
      </FadeIn>

      {/* Personal message from Eddie */}
      <FadeIn delay={0.5}>
        <p className="mt-6 text-lg text-warm-gray max-w-xl mx-auto leading-relaxed">
          Your insights are incredibly valuable. I&apos;ll review everything
          you&apos;ve shared and come prepared to discuss what matters most
          to you.
        </p>
        <p className="mt-2 font-playfair text-base text-charcoal/70 italic">
          &mdash; Eddie San Juan
        </p>
      </FadeIn>
    </section>
  );
}
