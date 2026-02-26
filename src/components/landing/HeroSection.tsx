"use client";

import FadeIn from "@/components/ui/FadeIn";
import BeginButton from "./BeginButton";

export default function HeroSection() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center relative overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory via-cream/30 to-ivory" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <div className="flex justify-center mb-8">
            <div className="w-16 h-px bg-gold" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl leading-tight text-charcoal">
            Before We Meet, Let&apos;s Discover What Matters Most to You
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-8 text-lg md:text-xl text-warm-gray leading-relaxed max-w-2xl mx-auto">
            A brief AI-guided conversation to help Eddie San Juan prepare
            the most valuable discussion for your time together.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="mt-12">
            <BeginButton />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
