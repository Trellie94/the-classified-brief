"use client";

import { Conspiracy } from "@/types/conspiracy";

interface ConspiracyCardProps {
  conspiracy: Conspiracy;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ConspiracyCard({
  conspiracy,
  isSelected,
  onSelect,
}: ConspiracyCardProps) {
  const difficultyColors = {
    "Beginner Agent": "text-accent-green",
    "Field Operative": "text-accent-yellow",
    "Deep State": "text-accent-red",
  };

  const tinfoilHats = "🎩".repeat(conspiracy.absurdity);

  return (
    <button
      onClick={onSelect}
      className={`
        relative w-full text-left p-6 border-2 transition-all duration-300
        ${
          isSelected
            ? "border-accent-yellow bg-accent-yellow/10 scale-105"
            : "border-foreground/20 bg-background/80 hover:border-accent-green/50 hover:bg-accent-green/5"
        }
        group
      `}
    >
      {/* Case Number */}
      <div className="absolute top-2 right-2 text-[10px] text-foreground/30 font-mono">
        CASE #{conspiracy.id.toString().padStart(3, "0")}
      </div>

      {/* Declassified Stamp - only shows when selected */}
      {isSelected && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-6xl font-impact text-accent-yellow/20 rotate-12 stamp">
            DECLASSIFIED
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="font-impact text-xl md:text-2xl mb-3 text-foreground uppercase tracking-wide leading-tight">
        {conspiracy.title}
      </h3>

      {/* Teaser */}
      <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
        {conspiracy.teaser}
      </p>

      {/* Footer: Absurdity + Difficulty */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-foreground/10">
        {/* Absurdity Rating */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-foreground/40 uppercase tracking-wider">
            Absurdity Level
          </span>
          <div className="text-lg" title={`${conspiracy.absurdity}/5`}>
            {tinfoilHats}
          </div>
        </div>

        {/* Difficulty Tag */}
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] text-foreground/40 uppercase tracking-wider">
            Clearance
          </span>
          <span
            className={`text-xs font-mono font-bold uppercase tracking-wider ${
              difficultyColors[conspiracy.difficulty]
            }`}
          >
            {conspiracy.difficulty}
          </span>
        </div>
      </div>

      {/* Hover effect stripe */}
      <div
        className={`
        absolute bottom-0 left-0 w-full h-1 transition-all duration-300
        ${isSelected ? "bg-accent-yellow" : "bg-accent-green/0 group-hover:bg-accent-green"}
      `}
      />
    </button>
  );
}
