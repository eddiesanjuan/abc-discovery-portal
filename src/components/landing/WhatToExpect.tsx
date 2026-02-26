"use client";

import FadeIn from "@/components/ui/FadeIn";
import Card from "@/components/ui/Card";

const items = [
  {
    title: "About 5 Minutes",
    description:
      "A quick, conversational experience. No forms, no friction — just a few thoughtful questions.",
  },
  {
    title: "Guided by AI",
    description:
      "Adaptive questions that respond to what you share. Not a rigid survey — a real conversation.",
  },
  {
    title: "For Your Benefit",
    description:
      "Eddie uses your input to prepare specifically for you. Your meeting time becomes more valuable.",
  },
];

export default function WhatToExpect() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-playfair text-2xl md:text-3xl text-charcoal text-center mb-12">
            What to Expect
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={0.15 * (i + 1)}>
              <Card className="text-center h-full">
                <h3 className="font-playfair text-xl text-charcoal mb-3">
                  {item.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-warm-gray text-sm leading-relaxed max-w-lg mx-auto">
            Your responses are private — shared only with Eddie San Juan to
            prepare a conversation tailored to your interests. Nothing leaves
            this page.
          </p>
        </div>
      </div>
    </section>
  );
}
