"use client";

import { useState, useMemo } from "react";
import { Conspiracy } from "@/types/conspiracy";
import ConspiracyCard from "./ConspiracyCard";
import conspiraciesData from "@/data/conspiracies.json";

export default function ConspiracySelector() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const conspiracies: Conspiracy[] = conspiraciesData;

  // Filter conspiracies based on search and difficulty
  const filteredConspiracies = useMemo(() => {
    return conspiracies.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.teaser.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === "all" || c.difficulty === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  }, [searchQuery, difficultyFilter, conspiracies]);

  return (
    <section
      id="conspiracy-selector"
      className="min-h-screen py-20 px-6 relative z-10"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h2 className="font-impact text-5xl md:text-6xl uppercase text-accent-green mb-4 tracking-wide">
            Choose Your Truth
          </h2>
          <p className="text-foreground/60 text-sm md:text-base max-w-2xl mx-auto">
            Select your conspiracy theory from the classified archives below.
            Remember: the more absurd, the more convincing.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="SEARCH CLASSIFIED FILES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-background border-2 border-foreground/20 text-foreground font-mono text-sm focus:border-accent-green focus:outline-none transition-colors placeholder:text-foreground/30 uppercase tracking-wider"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2">
            {["all", "Beginner Agent", "Field Operative", "Deep State"].map(
              (level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`
                    px-4 py-3 text-xs font-mono uppercase tracking-wider border-2 transition-all
                    ${
                      difficultyFilter === level
                        ? "border-accent-yellow bg-accent-yellow/20 text-accent-yellow"
                        : "border-foreground/20 text-foreground/60 hover:border-accent-green/50 hover:text-accent-green"
                    }
                  `}
                >
                  {level === "all" ? "All" : level.split(" ")[0]}
                </button>
              )
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-xs text-foreground/40 font-mono uppercase tracking-widest">
            {filteredConspiracies.length} CLASSIFIED FILE
            {filteredConspiracies.length !== 1 ? "S" : ""} FOUND
            {selectedId && (
              <>
                {" "}
                <span className="text-accent-yellow">
                  // 1 SELECTED
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Conspiracy Cards Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredConspiracies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConspiracies.map((conspiracy) => (
              <ConspiracyCard
                key={conspiracy.id}
                conspiracy={conspiracy}
                isSelected={selectedId === conspiracy.id}
                onSelect={() => setSelectedId(conspiracy.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground/40 font-mono text-sm uppercase tracking-wider">
              No classified files match your search criteria.
              <br />
              <span className="text-accent-red">
                ⚠️ Access Denied
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Continue Button - only shows when conspiracy is selected */}
      {selectedId && (
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <button className="px-12 py-5 bg-accent-red hover:bg-accent-red/80 text-background font-impact text-2xl tracking-widest uppercase transition-all duration-200 border-4 border-accent-red hover:border-accent-yellow glitch">
            PROCEED TO BRIEFING
          </button>
          <p className="mt-4 text-xs text-foreground/40 tracking-wider uppercase">
            Selected: {conspiracies.find((c) => c.id === selectedId)?.title}
          </p>
        </div>
      )}
    </section>
  );
}
