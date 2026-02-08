"use client";

interface Slide {
  slide_number: number;
  title: string;
  talking_points: string[];
  speaker_notes: string;
  suggested_image: string;
}

interface SlidePreviewProps {
  slides: Slide[];
  onProceed: () => void;
}

export default function SlidePreview({ slides, onProceed }: SlidePreviewProps) {
  return (
    <div className="mt-8 border-2 border-accent-yellow/50 bg-accent-yellow/5 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="font-impact text-2xl md:text-3xl uppercase text-accent-yellow mb-2">
          PRESENTATION OUTLINE GENERATED
        </h3>
        <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider">
          {slides.length} Slides // Classified Material Ready for Fabrication
        </p>
      </div>

      {/* Slide Cards */}
      <div className="space-y-4 mb-6">
        {slides.map((slide) => (
          <div
            key={slide.slide_number}
            className="bg-background/50 border border-foreground/20 p-4"
          >
            <div className="flex items-start gap-3">
              {/* Slide Number */}
              <div className="flex-shrink-0 w-8 h-8 border-2 border-accent-green/60 bg-accent-green/15 flex items-center justify-center text-accent-green font-mono font-bold text-sm">
                {slide.slide_number}
              </div>

              {/* Slide Content */}
              <div className="flex-1">
                <h4 className="font-impact text-lg uppercase text-foreground mb-2">
                  {slide.title}
                </h4>
                <ul className="text-xs text-foreground/70 space-y-1 mb-2">
                  {slide.talking_points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-accent-green">▸</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {slide.suggested_image && (
                  <p className="text-[10px] text-accent-yellow/80 uppercase tracking-wide">
                    📷 Image: {slide.suggested_image}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proceed Button */}
      <div className="text-center">
        <button
          onClick={onProceed}
          className="px-12 py-4 bg-accent-red hover:bg-accent-red/80 text-background font-impact text-xl tracking-widest uppercase transition-all duration-200 border-4 border-accent-red hover:border-accent-yellow glitch"
        >
          FABRICATE EVIDENCE
        </button>
        <p className="mt-3 text-[10px] text-foreground/40 tracking-wider uppercase">
          Proceed to Image Generation // Step 4
        </p>
      </div>
    </div>
  );
}
