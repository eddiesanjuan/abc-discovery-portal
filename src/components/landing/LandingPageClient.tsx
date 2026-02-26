"use client";

import { useState, useSyncExternalStore } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import WhatToExpect from "@/components/landing/WhatToExpect";
import AccessGate from "@/components/landing/AccessGate";

const emptySubscribe = () => () => {};

function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function LandingPageClient() {
  const isClient = useIsClient();
  const [justAuthed, setJustAuthed] = useState(false);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-warm-gray text-sm">Loading...</p>
      </div>
    );
  }

  const storedAuth = sessionStorage.getItem("visitorAuth") === "true";
  const authenticated = storedAuth || justAuthed;

  if (!authenticated) {
    return <AccessGate onAuthenticated={() => setJustAuthed(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <WhatToExpect />
      </main>
      <Footer />
    </div>
  );
}
