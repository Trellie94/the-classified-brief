"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Conspiracy } from "@/types/conspiracy";
import ChatWorkshop from "@/components/ChatWorkshop";
import ProgressBanner from "@/components/ProgressBanner";
import SlidePreview from "@/components/SlidePreview";
import {
  getConspiracy,
  saveSlides,
  getSlides,
  Slide,
} from "@/lib/localStorage";

export default function WorkshopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conspiracy, setConspiracy] = useState<Conspiracy | null>(null);
  const [workshopStarted, setWorkshopStarted] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [slides, setSlides] = useState<Slide[] | null>(null);

  // Load conspiracy from localStorage on mount
  useEffect(() => {
    const savedConspiracy = getConspiracy();
    if (!savedConspiracy) {
      // Redirect to briefing if no conspiracy selected
      router.push("/briefing");
      return;
    }

    setConspiracy(savedConspiracy);

    // Check if slides already exist
    const savedSlides = getSlides();
    if (savedSlides) {
      setSlides(savedSlides);
      setWorkshopStarted(true);
    }
  }, [router]);

  const handleStartWorkshop = () => {
    setWorkshopStarted(true);
  };

  const handleAutoGenerate = async () => {
    if (!conspiracy) return;

    setIsAutoGenerating(true);
    setWorkshopStarted(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content:
                "Generate a complete presentation framework immediately. Create the JSON slide structure now.",
            },
          ],
          conspiracy,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate slides");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullResponse += parsed.text;
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }

        // Extract JSON from the response
        const jsonMatch = fullResponse.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          try {
            const slideData = JSON.parse(jsonMatch[1]);
            if (slideData.slides && Array.isArray(slideData.slides)) {
              setSlides(slideData.slides);
              saveSlides(slideData.slides);
            }
          } catch (e) {
            console.error("Failed to parse slide JSON:", e);
            alert(
              "Failed to parse slides. Please try the manual workshop option."
            );
          }
        } else {
          alert("No slides found in response. Please try the manual workshop option.");
        }
      }
    } catch (error) {
      console.error("Auto-generate error:", error);
      alert("Failed to auto-generate slides. Please try the manual workshop option.");
    } finally {
      setIsAutoGenerating(false);
    }
  };

  const handleSlidesGenerated = (generatedSlides: Slide[]) => {
    setSlides(generatedSlides);
    saveSlides(generatedSlides);
  };

  const handleProceedToEvidence = () => {
    if (conspiracy) {
      router.push(`/evidence?id=${conspiracy.id}`);
    }
  };

  if (!conspiracy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/60 font-mono text-sm uppercase tracking-wider">
          Loading classified file...
        </p>
      </div>
    );
  }

  return (
    <>
      <ProgressBanner currentStep="workshop" />

      {/* Watermark stamps scattered */}
      <div className="fixed top-10 right-10 stamp text-6xl opacity-5 rotate-12 pointer-events-none select-none z-40">
        CLASSIFIED
      </div>
      <div className="fixed bottom-10 left-10 stamp text-5xl opacity-5 -rotate-12 pointer-events-none select-none z-40">
        TOP SECRET
      </div>

      <main className="min-h-screen py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-6">
            <h1 className="font-impact text-6xl md:text-7xl uppercase text-accent-green tracking-wide">
              Interrogation Room
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Workshop your conspiracy with <span className="text-accent-yellow font-mono">Alexjones_bot</span>
            </p>
            <div className="mt-4 inline-block px-6 py-3 border-2 border-accent-yellow/50 bg-accent-yellow/10">
              <p className="text-sm font-mono uppercase text-accent-yellow">
                Active File: {conspiracy.title}
              </p>
            </div>
          </div>

          {/* Alex Jones Meme Image */}
          {!workshopStarted && (
            <div className="mb-12 flex justify-center">
              <div className="relative max-w-md border-4 border-accent-red/30 p-2 bg-background/80">
                <img
                  src="/alex-jones-meme.jpg"
                  alt="Alex Jones"
                  className="w-full h-auto grayscale"
                  onError={(e) => {
                    // Hide image if it doesn't exist yet
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute top-2 right-2 stamp text-xs text-accent-red rotate-12 bg-background/80 px-2 py-1">
                  THEY DON&apos;T WANT YOU TO KNOW
                </div>
              </div>
            </div>
          )}

          {/* Two Workshop Options */}
          {!workshopStarted && !isAutoGenerating && (
            <div className="max-w-3xl mx-auto mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option 1: Manual Workshop */}
                <button
                  onClick={handleStartWorkshop}
                  className="group relative p-8 border-2 border-accent-green/50 hover:border-accent-green bg-background/80 hover:bg-accent-green/5 transition-all duration-300"
                >
                  <div className="text-center space-y-4">
                    <div className="text-4xl">🎭</div>
                    <h3 className="font-impact text-xl uppercase text-accent-green">
                      Workshop Mode
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      Work with Alexjones_bot to craft your presentation. Chat,
                      refine, and iterate until it&apos;s perfect.
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-accent-green/0 group-hover:bg-accent-green transition-all duration-300"></div>
                </button>

                {/* Option 2: Auto-Generate */}
                <button
                  onClick={handleAutoGenerate}
                  className="group relative p-8 border-2 border-accent-yellow/50 hover:border-accent-yellow bg-background/80 hover:bg-accent-yellow/5 transition-all duration-300"
                >
                  <div className="text-center space-y-4">
                    <div className="text-4xl">⚡</div>
                    <h3 className="font-impact text-xl uppercase text-accent-yellow">
                      Auto-Generate
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      Let Alexjones_bot create a complete presentation framework
                      instantly. Fast-track your mission.
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-accent-yellow/0 group-hover:bg-accent-yellow transition-all duration-300"></div>
                </button>
              </div>

              <p className="text-center mt-6 text-xs text-foreground/40 uppercase tracking-wider">
                Choose your approach, Agent
              </p>
            </div>
          )}

          {/* Auto-generating Loading State */}
          {isAutoGenerating && (
            <div className="max-w-3xl mx-auto mb-12 text-center py-20">
              <div className="text-accent-yellow mb-6">
                <div className="text-6xl mb-4 animate-pulse">⚡</div>
                <p className="font-mono text-lg uppercase tracking-wider loading-dots">
                  Generating presentation framework
                </p>
                <p className="text-xs text-foreground/40 mt-2">
                  Alexjones_bot is analyzing your conspiracy...
                </p>
              </div>
            </div>
          )}

          {/* Chat Workshop */}
          {workshopStarted && !isAutoGenerating && !slides && (
            <div className="mb-12">
              <ChatWorkshop
                conspiracy={conspiracy}
                onSlidesGenerated={handleSlidesGenerated}
              />
            </div>
          )}

          {/* Slides Preview (shown after generation) */}
          {slides && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="font-impact text-3xl uppercase text-accent-yellow mb-2">
                  Presentation Framework Generated
                </h3>
                <p className="text-sm text-foreground/60">
                  {slides.length} slides ready for evidence fabrication
                </p>
              </div>

              <div className="space-y-6">
                {slides.map((slide) => (
                  <SlidePreview key={slide.slide_number} slide={slide} />
                ))}
              </div>
            </div>
          )}

          {/* Fabricate Evidence Button */}
          {slides && (
            <div className="text-center mt-12">
              <button
                onClick={handleProceedToEvidence}
                className="px-12 py-5 bg-accent-red hover:bg-accent-red/80 text-background font-impact text-2xl tracking-widest uppercase transition-all duration-200 border-4 border-accent-red hover:border-accent-yellow glitch"
              >
                Fabricate Evidence
              </button>
              <p className="mt-4 text-xs text-foreground/40 tracking-wider uppercase">
                Proceed to evidence generation
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
