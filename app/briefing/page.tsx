"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Conspiracy } from "@/types/conspiracy";
import ConspiracySelector from "@/components/ConspiracySelector";
import ProgressBanner from "@/components/ProgressBanner";
import { saveConspiracy } from "@/lib/localStorage";

export default function BriefingPage() {
  const router = useRouter();

  const handleConspiracySelect = (conspiracy: Conspiracy) => {
    // Save to localStorage
    saveConspiracy(conspiracy);

    // Navigate to workshop with conspiracy ID
    router.push(`/workshop?id=${conspiracy.id}`);
  };

  return (
    <>
      <ProgressBanner currentStep="briefing" />

      {/* Watermark stamps scattered */}
      <div className="fixed top-10 right-10 stamp text-6xl opacity-5 rotate-12 pointer-events-none select-none z-40">
        CLASSIFIED
      </div>
      <div className="fixed bottom-10 left-10 stamp text-5xl opacity-5 -rotate-12 pointer-events-none select-none z-40">
        TOP SECRET
      </div>

      {/* Briefing Room Section */}
      <main className="min-h-screen py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <h1 className="font-impact text-6xl md:text-7xl uppercase text-accent-green tracking-wide">
              Briefing Room
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Welcome, Agent. Select your conspiracy theory from the classified archives below.
              Remember: the more absurd, the more convincing.
            </p>
            <div className="flex items-center justify-center gap-4 text-accent-yellow">
              <div className="h-px w-12 bg-accent-yellow/40"></div>
              <span className="stamp text-xs">█ SECURITY CLEARANCE REQUIRED █</span>
              <div className="h-px w-12 bg-accent-yellow/40"></div>
            </div>
          </div>

          <ConspiracySelector onSelect={handleConspiracySelect} />
        </div>
      </main>
    </>
  );
}
