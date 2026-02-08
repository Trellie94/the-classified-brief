export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10">
      {/* Watermark stamps scattered */}
      <div className="fixed top-10 right-10 stamp text-6xl opacity-5 rotate-12 pointer-events-none select-none">
        CLASSIFIED
      </div>
      <div className="fixed bottom-10 left-10 stamp text-5xl opacity-5 -rotate-12 pointer-events-none select-none">
        TOP SECRET
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl space-y-8 pinned">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="font-impact text-7xl md:text-8xl tracking-tight uppercase text-accent-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
            THE CLASSIFIED
            <br />
            <span className="text-accent-red drop-shadow-[0_0_10px_rgba(255,49,49,0.5)]">
              BRIEF
            </span>
          </h1>

          <div className="flex items-center justify-center gap-4 text-accent-yellow">
            <div className="h-px w-16 bg-accent-yellow/40"></div>
            <span className="stamp text-xs">███████ // LEVEL 5 // ███████</span>
            <div className="h-px w-16 bg-accent-yellow/40"></div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-foreground/80 font-bold tracking-wide">
          They don&apos;t want you to present this.
        </p>

        {/* Description */}
        <div className="max-w-2xl mx-auto space-y-3 text-foreground/70 text-sm md:text-base leading-relaxed">
          <p>
            A preparation toolkit for your conspiracy comedy night. Browse absurd theories,
            workshop your 5-minute presentation with an AI coach, and fabricate convincing
            &quot;evidence&quot; to support your claims.
          </p>
          <p className="text-accent-green/80">
            Deliver it with a completely straight face. That&apos;s the mission.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <button className="group relative px-12 py-5 bg-accent-red hover:bg-accent-red/80 text-background font-impact text-2xl tracking-widest uppercase transition-all duration-200 border-4 border-accent-red hover:border-accent-yellow glitch">
            <span className="relative z-10">ACCEPT YOUR MISSION</span>

            {/* Glitch overlay */}
            <div className="absolute inset-0 bg-accent-yellow opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
          </button>

          <p className="mt-4 text-xs text-foreground/40 tracking-wider uppercase">
            ⚠️ Clearance Level: UNHINGED
          </p>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-foreground/30 tracking-widest uppercase">
          Nothing to see here. Exactly what they want you to think.
        </p>
      </div>
    </main>
  );
}
