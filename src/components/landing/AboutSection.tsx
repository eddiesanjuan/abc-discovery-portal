"use client";

import FadeIn from "@/components/ui/FadeIn";

export default function AboutSection() {
  return (
    <section className="py-20 bg-cream/40">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-playfair text-2xl md:text-3xl text-charcoal">
            About E.F. San Juan
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-6 text-warm-gray leading-relaxed">
            For over 50 years, E.F. San Juan has been Northwest Florida&apos;s
            premier luxury custom architectural millwork manufacturer. From
            Seaside and Rosemary Beach to Alys Beach and WaterColor, their
            craftsmanship defines the 30A corridor&apos;s most distinguished
            homes.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="mt-4 text-warm-gray leading-relaxed">
            Eddie San Juan is pioneering AI integration across manufacturing
            &mdash; from automated work order analysis and AI-powered
            estimating to CNC optimization and quality control. This
            interview helps prepare a conversation tailored specifically to
            your interests.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
