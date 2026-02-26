"use client";

import FadeIn from "@/components/ui/FadeIn";

export default function NextSteps() {
  return (
    <FadeIn delay={0.5}>
      <section className="max-w-2xl mx-auto py-12 text-center">
        <h2 className="font-playfair text-2xl text-charcoal mb-6">
          What Happens Next
        </h2>
        <div className="space-y-4 text-warm-gray text-sm leading-relaxed">
          <p>
            Eddie will review your responses before your meeting, so the
            conversation will be tailored to what matters most to you.
          </p>
          <p>
            When you meet, you can dive straight into the topics that are
            most relevant — no warm-up needed.
          </p>
        </div>
        <div className="mt-10 pt-6 border-t border-stone/20">
          <p className="text-xs text-warm-gray/60">
            Powered by E.F. San Juan
          </p>
        </div>
      </section>
    </FadeIn>
  );
}
