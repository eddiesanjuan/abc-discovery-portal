"use client";

import FadeIn from "@/components/ui/FadeIn";

export default function ThankYouHero() {
  return (
    <section className="py-16 text-center">
      <FadeIn>
        <h1 className="font-playfair text-4xl md:text-5xl text-charcoal">
          Thank You for Your Time
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="mt-6 text-lg text-warm-gray max-w-xl mx-auto leading-relaxed">
          Your insights are incredibly valuable. Eddie will use this
          conversation to make your upcoming meeting as productive and
          relevant as possible.
        </p>
      </FadeIn>
    </section>
  );
}
