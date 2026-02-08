"use client";

import { useState } from "react";
import { Conspiracy } from "@/types/conspiracy";
import { generatePresentationPPTX } from "@/lib/slideGenerator";

interface Slide {
  slide_number: number;
  title: string;
  talking_points: string[];
  speaker_notes: string;
  suggested_image: string;
}

interface GeneratedImage {
  slideNumber: number;
  imageUrl: string;
  style: string;
  prompt: string;
}

interface EvidenceFabricatorProps {
  slides: Slide[];
  conspiracy: Conspiracy;
}

const IMAGE_STYLES = [
  {
    id: "leaked-photo",
    name: "Leaked Photograph",
    description: "Grainy surveillance camera aesthetic with date stamp",
    icon: "📷",
  },
  {
    id: "newspaper",
    name: "Newspaper Front Page",
    description: "NY Post tabloid style with headline overlay",
    icon: "📰",
  },
  {
    id: "declassified",
    name: "Declassified Document",
    description: "Aged paper with redaction bars and stamps",
    icon: "📄",
  },
  {
    id: "satellite",
    name: "Satellite Imagery",
    description: "Aerial view with targeting reticle",
    icon: "🛰️",
  },
];

export default function EvidenceFabricator({
  slides,
  conspiracy,
}: EvidenceFabricatorProps) {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [customPrompt, setCustomPrompt] = useState(
    slides[0]?.suggested_image || ""
  );
  const [selectedStyle, setSelectedStyle] = useState("leaked-photo");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSlideData = slides[currentSlide];
  const hasGeneratedForCurrentSlide = generatedImages.some(
    (img) => img.slideNumber === currentSlideData.slide_number
  );

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt,
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();

      // If newspaper style, generate headline and composite
      let finalImageUrl = data.imageUrl;
      if (selectedStyle === "newspaper") {
        // For now, just use the raw image. Newspaper compositing can be added later
        finalImageUrl = data.imageUrl;
      }

      setGeneratedImages((prev) => [
        ...prev.filter((img) => img.slideNumber !== currentSlideData.slide_number),
        {
          slideNumber: currentSlideData.slide_number,
          imageUrl: finalImageUrl,
          style: selectedStyle,
          prompt: customPrompt,
        },
      ]);
    } catch (err) {
      console.error("Image generation error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      setCustomPrompt(slides[nextSlide].suggested_image || "");
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      setCustomPrompt(slides[prevSlide].suggested_image || "");
    }
  };

  const currentImage = generatedImages.find(
    (img) => img.slideNumber === currentSlideData.slide_number
  );

  const allSlidesHaveImages = slides.every((slide) =>
    generatedImages.some((img) => img.slideNumber === slide.slide_number)
  );

  const handleExportPPTX = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      await generatePresentationPPTX(conspiracy, slides, generatedImages);
    } catch (err) {
      console.error("PPTX export error:", err);
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section
      id="evidence-fabricator"
      className="min-h-screen py-20 px-6 relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-impact text-5xl md:text-6xl uppercase text-accent-red mb-4 tracking-wide">
            Fabricate Evidence
          </h2>
          <p className="text-foreground/60 text-sm md:text-base max-w-2xl mx-auto">
            Generate visual &quot;proof&quot; for each slide. The Bureau&apos;s image synthesis division is standing by.
          </p>
          <div className="mt-4 inline-block px-4 py-2 border border-accent-yellow/50 bg-accent-yellow/10">
            <p className="text-xs font-mono uppercase text-accent-yellow">
              {generatedImages.length} / {slides.length} Images Fabricated
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Slide Info & Controls */}
          <div className="space-y-6">
            {/* Slide Navigation */}
            <div className="bg-background/80 border-2 border-accent-green/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-impact text-2xl uppercase text-foreground">
                  Slide {currentSlideData.slide_number}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handlePreviousSlide}
                    disabled={currentSlide === 0}
                    className="px-3 py-1 text-xs font-mono uppercase border border-foreground/20 hover:border-accent-green disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← PREV
                  </button>
                  <button
                    onClick={handleNextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="px-3 py-1 text-xs font-mono uppercase border border-foreground/20 hover:border-accent-green disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    NEXT →
                  </button>
                </div>
              </div>
              <h4 className="text-lg text-foreground/80 mb-3">
                {currentSlideData.title}
              </h4>
              <ul className="text-xs text-foreground/60 space-y-1">
                {currentSlideData.talking_points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent-green">▸</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Prompt */}
            <div>
              <label className="block text-xs text-foreground/60 uppercase tracking-wider mb-2">
                Image Description
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-background border-2 border-foreground/20 text-foreground font-mono text-sm focus:border-accent-green focus:outline-none transition-colors resize-none"
                placeholder="Describe the evidence to fabricate..."
              />
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-xs text-foreground/60 uppercase tracking-wider mb-3">
                Evidence Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {IMAGE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 text-left border-2 transition-all ${
                      selectedStyle === style.id
                        ? "border-accent-yellow bg-accent-yellow/10"
                        : "border-foreground/20 hover:border-accent-green/50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="font-mono text-xs uppercase text-foreground mb-1">
                      {style.name}
                    </div>
                    <div className="text-[10px] text-foreground/50">
                      {style.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating || !customPrompt.trim()}
              className="w-full px-8 py-4 bg-accent-red hover:bg-accent-red/80 text-background font-impact text-xl tracking-widest uppercase transition-all duration-200 border-4 border-accent-red hover:border-accent-yellow disabled:opacity-50 disabled:cursor-not-allowed glitch"
            >
              {isGenerating ? (
                <span className="loading-dots">FABRICATING</span>
              ) : hasGeneratedForCurrentSlide ? (
                "REGENERATE EVIDENCE"
              ) : (
                "FABRICATE EVIDENCE"
              )}
            </button>

            {error && (
              <div className="p-4 border-2 border-accent-red/50 bg-accent-red/10">
                <p className="text-xs text-accent-red font-mono uppercase">
                  ⚠️ {error}
                </p>
              </div>
            )}
          </div>

          {/* Right: Image Preview */}
          <div>
            <div className="bg-background/50 border-2 border-foreground/20 p-6 min-h-[500px] flex items-center justify-center">
              {currentImage ? (
                <div className="w-full">
                  <img
                    src={currentImage.imageUrl}
                    alt={`Evidence for slide ${currentSlideData.slide_number}`}
                    className="w-full h-auto border border-foreground/20"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-xs text-accent-green font-mono uppercase">
                      ✓ Evidence Fabricated
                    </p>
                    <p className="text-[10px] text-foreground/40 mt-1">
                      Style: {IMAGE_STYLES.find((s) => s.id === currentImage.style)?.name}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-foreground/30">
                  <p className="text-6xl mb-4">📷</p>
                  <p className="text-sm font-mono uppercase tracking-wider">
                    No Evidence Generated Yet
                  </p>
                  <p className="text-xs mt-2">
                    Configure your prompt and style, then fabricate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Export Button - only shows when all slides have images */}
        {allSlidesHaveImages && (
          <div className="text-center pt-8 border-t-2 border-foreground/10">
            <button
              onClick={handleExportPPTX}
              disabled={isGenerating}
              className="px-12 py-5 bg-accent-yellow hover:bg-accent-yellow/80 text-background font-impact text-2xl tracking-widest uppercase transition-all duration-200 border-4 border-accent-yellow hover:border-accent-green disabled:opacity-50 disabled:cursor-not-allowed glitch"
            >
              {isGenerating ? (
                <span className="loading-dots">EXTRACTING</span>
              ) : (
                "EXTRACT DOSSIER (.PPTX)"
              )}
            </button>
            <p className="mt-4 text-xs text-foreground/40 tracking-wider uppercase">
              All Evidence Fabricated // Ready for Export
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
