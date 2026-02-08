"use client";

import { useState, useMemo } from "react";
import { Conspiracy } from "@/types/conspiracy";
import ConspiracyCard from "./ConspiracyCard";
import conspiraciesData from "@/data/conspiracies.json";

interface ConspiracySelectorProps {
  onSelect: (conspiracy: Conspiracy) => void;
}

export default function ConspiracySelector({ onSelect }: ConspiracySelectorProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const conspiracies = conspiraciesData as Conspiracy[];

  const handleSelectFile = () => {
    const selected = conspiracies.find((c) => c.id === selectedId);
    if (selected) {
      onSelect(selected);
    }
  };

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
    <div className="relative">
      {/* Search and Filter Controls */}
      <div className="mb-8">
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
                onProceed={handleSelectFile}
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
    </div>
  );
}
