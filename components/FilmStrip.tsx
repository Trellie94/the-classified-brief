"use client";

export interface GeneratedImage {
  slideNumber: number;
  imageUrl: string;
  style: string;
  prompt: string;
}

interface FilmStripProps {
  images: GeneratedImage[];
}

export default function FilmStrip({ images }: FilmStripProps) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-foreground/30 text-center p-4">
          <p className="stamp text-xs uppercase tracking-wider">
            Evidence Roll
            <br />
            Empty
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Film strip container */}
      <div className="relative bg-gradient-to-b from-zinc-900 to-zinc-800 p-3 rounded-lg border-2 border-foreground/20 shadow-2xl">
        {/* Film strip holes decoration - Left side */}
        <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around py-3">
          {Array.from({ length: Math.max(8, images.length * 2) }).map((_, i) => (
            <div
              key={`hole-left-${i}`}
              className="w-2 h-2 rounded-full bg-background border border-foreground/30"
            ></div>
          ))}
        </div>

        {/* Film strip holes decoration - Right side */}
        <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around py-3">
          {Array.from({ length: Math.max(8, images.length * 2) }).map((_, i) => (
            <div
              key={`hole-right-${i}`}
              className="w-2 h-2 rounded-full bg-background border border-foreground/30"
            ></div>
          ))}
        </div>

        {/* Images */}
        <div className="relative flex flex-col gap-3 px-4">
          {/* Title label */}
          <div className="text-center py-2 border-b border-foreground/20">
            <p className="stamp text-[10px] text-accent-yellow uppercase tracking-widest">
              Evidence Roll
            </p>
          </div>

          {/* Image thumbnails */}
          {images.map((image, index) => (
            <div
              key={`${image.slideNumber}-${index}`}
              className="relative group animate-fadeIn"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Frame */}
              <div className="relative bg-background p-2 border border-accent-green/30 hover:border-accent-green transition-colors duration-200">
                {/* Slide number label */}
                <div className="absolute -top-2 -left-2 bg-accent-red text-background stamp text-[10px] px-2 py-0.5 z-10 rotate-[-5deg]">
                  #{image.slideNumber}
                </div>

                {/* Image */}
                <img
                  src={image.imageUrl}
                  alt={`Evidence ${image.slideNumber}`}
                  className="w-[140px] h-[140px] object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />

                {/* Style badge */}
                <div className="absolute -bottom-2 -right-2 bg-accent-yellow text-background stamp text-[8px] px-1.5 py-0.5 rotate-[3deg]">
                  {image.style}
                </div>

                {/* Hover overlay with prompt */}
                <div className="absolute inset-0 bg-background/95 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 flex items-center justify-center">
                  <p className="text-[9px] text-foreground/80 text-center leading-tight">
                    {image.prompt.substring(0, 80)}
                    {image.prompt.length > 80 ? "..." : ""}
                  </p>
                </div>
              </div>

              {/* Film frame line */}
              {index < images.length - 1 && (
                <div className="h-1 w-full bg-foreground/10 my-1"></div>
              )}
            </div>
          ))}

          {/* Bottom label */}
          <div className="text-center py-2 border-t border-foreground/20">
            <p className="stamp text-[10px] text-foreground/40 uppercase tracking-widest">
              {images.length} / {images.length} Exposed
            </p>
          </div>
        </div>

        {/* Classified stamp */}
        <div className="absolute -rotate-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-5">
          <span className="stamp text-4xl text-accent-red">CLASSIFIED</span>
        </div>
      </div>

      {/* Shadow effect */}
      <div className="absolute inset-0 -z-10 bg-accent-green/5 blur-xl rounded-lg translate-y-1"></div>
    </div>
  );
}
