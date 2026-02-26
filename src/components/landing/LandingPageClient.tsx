"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import WhatToExpect from "@/components/landing/WhatToExpect";
import AccessGate from "@/components/landing/AccessGate";

export default function LandingPageClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("visitorAuth");
    setAuthenticated(auth === "true");
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-warm-gray text-sm">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <AccessGate onAuthenticated={() => setAuthenticated(true)} />;
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
