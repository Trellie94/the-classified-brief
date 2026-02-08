"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Conspiracy } from "@/types/conspiracy";
import { generatePresentationPPTX } from "@/lib/slideGenerator";
import {
  getConspiracy,
  getSlides,
  getImages,
  isPPTXReady,
  clearSessionData,
  Slide,
  GeneratedImage,
} from "@/lib/localStorage";

export default function CompletePage() {
  const router = useRouter();
  const [conspiracy, setConspiracy] = useState<Conspiracy | null>(null);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [images, setImages] = useState<GeneratedImage[] | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedConspiracy = getConspiracy();
    const savedSlides = getSlides();
    const savedImages = getImages();

    if (!savedConspiracy || !savedSlides || !savedImages) {
      // Redirect to appropriate page if data is missing
      if (!savedConspiracy) {
        router.push("/briefing");
      } else if (!savedSlides) {
        router.push(`/workshop?id=${savedConspiracy.id}`);
      } else if (!savedImages) {
        router.push(`/evidence?id=${savedConspiracy.id}`);
      }
      return;
    }

    setConspiracy(savedConspiracy);
    setSlides(savedSlides);
    setImages(savedImages);
  }, [router]);

  const handleDownloadDossier = async () => {
    if (!conspiracy || !slides || !images) return;

    setIsDownloading(true);

    try {
      // Generate and download the PPTX
      await generatePresentationPPTX(conspiracy, slides, images);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download dossier. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStartNew = () => {
    if (
      confirm(
        "Are you sure you want to start a new mission? This will clear your current progress."
      )
    ) {
      clearSessionData();
      router.push("/briefing");
    }
  };

  if (!conspiracy || !slides || !images) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/60 font-mono text-sm uppercase tracking-wider">
          Loading mission complete data...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Watermark stamps scattered */}
      <div className="fixed top-10 right-10 stamp text-6xl opacity-5 rotate-12 pointer-events-none select-none z-40">
        CLASSIFIED
      </div>
      <div className="fixed bottom-10 left-10 stamp text-5xl opacity-5 -rotate-12 pointer-events-none select-none z-40">
        MISSION COMPLETE
      </div>

      <main className="min-h-screen flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-4xl space-y-12">
          {/* Success Message */}
          <div className="text-center space-y-6">
            <div className="inline-block">
              <div className="text-8xl mb-6 animate-pulse">🎯</div>
            </div>
            <h1 className="font-impact text-6xl md:text-7xl uppercase text-accent-green tracking-wide">
              Mission Complete
            </h1>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Your classified dossier has been prepared, Agent. The truth is now ready
              for deployment.
            </p>
            <div className="inline-block px-6 py-3 border-2 border-accent-yellow/50 bg-accent-yellow/10">
              <p className="text-sm font-mono uppercase text-accent-yellow">
                Operation: {conspiracy.title}
              </p>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative">
            <div className="border-4 border-accent-red/30 p-2 bg-background/80">
              {!videoError ? (
                <video
                  controls
                  autoPlay
                  className="w-full h-auto bg-background"
                  onError={() => setVideoError(true)}
                >
                  <source src="/mission-complete.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="aspect-video bg-background/50 border-2 border-foreground/20 flex items-center justify-center">
                  <div className="text-center text-foreground/40 p-8">
                    <p className="text-6xl mb-4">🎬</p>
                    <p className="text-sm font-mono uppercase">
                      Mission Complete Video
                    </p>
                    <p className="text-xs mt-2">
                      (Video file not found: /public/mission-complete.mp4)
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -top-3 -right-3 stamp text-xs text-accent-red rotate-12 bg-background border-2 border-accent-red px-3 py-1">
              DECLASSIFIED
            </div>
          </div>

          {/* Mission Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-6 border-2 border-foreground/20 bg-background/50">
              <p className="text-3xl font-impact text-accent-green mb-2">
                {slides.length}
              </p>
              <p className="text-xs text-foreground/60 uppercase tracking-wider">
                Slides Prepared
              </p>
            </div>
            <div className="text-center p-6 border-2 border-foreground/20 bg-background/50">
              <p className="text-3xl font-impact text-accent-yellow mb-2">
                {images.length}
              </p>
              <p className="text-xs text-foreground/60 uppercase tracking-wider">
                Evidence Fabricated
              </p>
            </div>
            <div className="text-center p-6 border-2 border-foreground/20 bg-background/50">
              <p className="text-3xl font-impact text-accent-red mb-2">100%</p>
              <p className="text-xs text-foreground/60 uppercase tracking-wider">
                Mission Success
              </p>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center space-y-6">
            <button
              onClick={handleDownloadDossier}
              disabled={isDownloading}
              className="px-12 py-5 bg-accent-yellow hover:bg-accent-yellow/80 text-background font-impact text-2xl tracking-widest uppercase transition-all duration-200 border-4 border-accent-yellow hover:border-accent-green disabled:opacity-50 disabled:cursor-not-allowed glitch"
            >
              {isDownloading ? (
                <span className="loading-dots">Downloading</span>
              ) : (
                "Download Dossier"
              )}
            </button>
            <p className="text-xs text-foreground/40 tracking-wider uppercase">
              📥 PowerPoint presentation with embedded evidence
            </p>
          </div>

          {/* Start New Mission */}
          <div className="text-center pt-8 border-t border-foreground/10">
            <button
              onClick={handleStartNew}
              className="text-sm text-foreground/50 hover:text-accent-green uppercase tracking-wider transition-colors font-mono underline"
            >
              Start New Mission →
            </button>
          </div>

          {/* Footer Quote */}
          <div className="text-center pt-12">
            <p className="text-foreground/40 text-sm italic max-w-xl mx-auto leading-relaxed">
              &quot;The truth is out there, Agent. Now it&apos;s your job to present it.
              With a completely straight face.&quot;
            </p>
            <p className="text-xs text-foreground/30 mt-4 stamp uppercase tracking-widest">
              - The Bureau of Unverified Claims
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
