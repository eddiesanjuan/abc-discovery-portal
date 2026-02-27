"use client";

import FadeIn from "@/components/ui/FadeIn";

export default function NextSteps() {
  return (
    <FadeIn delay={0.8}>
      <section className="max-w-2xl mx-auto pt-10 pb-16 text-center">
        {/* Gold divider */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
            <div className="w-12 h-px bg-gold/40" />
          </div>
        </div>

        <h2 className="font-playfair text-xl md:text-2xl text-charcoal mb-6">
          What Happens Next
        </h2>

        <div className="space-y-3 text-warm-gray text-sm leading-relaxed max-w-lg mx-auto">
          <p>
            Eddie will review your responses before your meeting, so the
            conversation will be tailored to what matters most to you.
          </p>
          <p>
            When you meet, you can dive straight into the topics that are
            most relevant&nbsp;&mdash; no warm-up needed.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-14 pt-6 border-t border-stone/15">
          <p className="font-playfair text-xs tracking-widest uppercase text-warm-gray/50">
            E.F. San Juan &middot; Custom Architectural Millwork &middot;
            Celebrating 50 Years
          </p>
        </div>
      </section>
    </FadeIn>
  );
}
