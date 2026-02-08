"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Conspiracy } from "@/types/conspiracy";
import EvidenceFabricator from "@/components/EvidenceFabricator";
import ProgressBanner from "@/components/ProgressBanner";
import FilmStrip from "@/components/FilmStrip";
import { generatePresentationPPTX } from "@/lib/slideGenerator";
import {
  getConspiracy,
  getSlides,
  getImages,
  saveImages,
  markPPTXReady,
  Slide,
  GeneratedImage,
} from "@/lib/localStorage";

export default function EvidencePage() {
  const router = useRouter();
  const [conspiracy, setConspiracy] = useState<Conspiracy | null>(null);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGeneratingPPTX, setIsGeneratingPPTX] = useState(false);
  const [pptxError, setPptxError] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedConspiracy = getConspiracy();
    const savedSlides = getSlides();

    if (!savedConspiracy || !savedSlides) {
      // Redirect to appropriate page if data is missing
      if (!savedConspiracy) {
        router.push("/briefing");
      } else if (!savedSlides) {
        router.push(`/workshop?id=${savedConspiracy.id}`);
      }
      return;
    }

    setConspiracy(savedConspiracy);
    setSlides(savedSlides);

    // Load any previously generated images
    const savedImages = getImages();
    if (savedImages) {
      setGeneratedImages(savedImages);
    }
  }, [router]);

  const handleImagesChange = (images: GeneratedImage[]) => {
    setGeneratedImages(images);
    saveImages(images);
  };

  const handleAcceptMission = async () => {
    if (!conspiracy || !slides) return;

    setIsGeneratingPPTX(true);
    setPptxError(null);

    try {
      await generatePresentationPPTX(conspiracy, slides, generatedImages);
      markPPTXReady();

      // Navigate to complete page
      setTimeout(() => {
        router.push(`/complete?id=${conspiracy.id}`);
      }, 1000);
    } catch (error) {
      console.error("PPTX generation error:", error);
      setPptxError(
        error instanceof Error
          ? error.message
          : "Failed to generate dossier. Please try again."
      );
      setIsGeneratingPPTX(false);
    }
  };

  if (!conspiracy || !slides) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/60 font-mono text-sm uppercase tracking-wider">
          Loading classified materials...
        </p>
      </div>
    );
  }

  const allSlidesHaveImages = slides.every((slide) =>
    generatedImages.some((img) => img.slideNumber === slide.slide_number)
  );

  return (
    <>
      <ProgressBanner currentStep="evidence" />

      {/* Watermark stamps scattered */}
      <div className="fixed top-10 right-10 stamp text-6xl opacity-5 rotate-12 pointer-events-none select-none z-40">
        CLASSIFIED
      </div>
      <div className="fixed bottom-10 left-10 stamp text-5xl opacity-5 -rotate-12 pointer-events-none select-none z-40">
        TOP SECRET
      </div>

      <main className="min-h-screen py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-6">
            <h1 className="font-impact text-6xl md:text-7xl uppercase text-accent-red tracking-wide">
              Department of Evidence
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Generate visual &quot;proof&quot; for each slide. Make sure to generate one image
              for every slide before you can proceed. They will save automatically.
            </p>
            <div className="inline-block px-6 py-3 border-2 border-accent-yellow/50 bg-accent-yellow/10">
              <p className="text-sm font-mono uppercase text-accent-yellow">
                {generatedImages.length} / {slides.length} Evidence Fabricated
              </p>
            </div>
          </div>

          {/* Main Content Grid - Evidence Fabricator + Film Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8 mb-12">
            {/* Left: Evidence Fabricator */}
            <div>
              <EvidenceFabricator
                slides={slides}
                conspiracy={conspiracy}
                generatedImages={generatedImages}
                onImagesChange={handleImagesChange}
              />
            </div>

            {/* Right: Film Strip */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <FilmStrip images={generatedImages} />
              </div>
            </div>
          </div>

          {/* Film Strip for Mobile (below content) */}
          <div className="lg:hidden mb-12">
            <FilmStrip images={generatedImages} />
          </div>

          {/* Accept Mission Button */}
          {allSlidesHaveImages && (
            <div className="text-center pt-12 border-t-2 border-foreground/10">
              <button
                onClick={handleAcceptMission}
                disabled={isGeneratingPPTX}
                className="px-12 py-5 bg-accent-yellow hover:bg-accent-yellow/80 text-background font-impact text-2xl tracking-widest uppercase transition-all duration-200 border-4 border-accent-yellow hover:border-accent-green disabled:opacity-50 disabled:cursor-not-allowed glitch"
              >
                {isGeneratingPPTX ? (
                  <span className="loading-dots">Preparing dossier</span>
                ) : (
                  "Accept your mission dossier, ready for deployment into the field?"
                )}
              </button>
              <p className="mt-4 text-xs text-foreground/40 tracking-wider uppercase">
                All Evidence Fabricated // Mission Ready
              </p>

              {pptxError && (
                <div className="mt-6 max-w-2xl mx-auto p-4 border-2 border-accent-red/50 bg-accent-red/10">
                  <p className="text-sm text-accent-red font-mono">⚠️ {pptxError}</p>
                </div>
              )}
            </div>
          )}

          {!allSlidesHaveImages && (
            <div className="text-center pt-12 border-t-2 border-foreground/10">
              <p className="text-foreground/40 text-sm font-mono uppercase tracking-wider">
                ⚠️ Generate evidence for all slides to proceed
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
