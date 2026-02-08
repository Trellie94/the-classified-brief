"use client";

import { useRouter } from "next/navigation";

interface ProgressBannerProps {
  currentStep: "briefing" | "workshop" | "evidence" | "complete";
}

const steps = [
  { id: "briefing", label: "Briefing", path: "/briefing" },
  { id: "workshop", label: "Workshop", path: "/workshop" },
  { id: "evidence", label: "Evidence", path: "/evidence" },
  { id: "complete", label: "Deploy", path: "/complete" },
] as const;

export default function ProgressBanner({ currentStep }: ProgressBannerProps) {
  const router = useRouter();

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  const handleStepClick = (stepId: string, stepIndex: number) => {
    // Only allow clicking on completed steps (previous steps)
    if (stepIndex < currentStepIndex) {
      const step = steps.find((s) => s.id === stepId);
      if (step) {
        router.push(step.path);
      }
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-accent-green/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        {/* Progress Timeline */}
        <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isFuture = index > currentStepIndex;
            const isClickable = isCompleted;

            return (
              <div key={step.id} className="flex items-center gap-2">
                {/* Step */}
                <button
                  onClick={() => handleStepClick(step.id, index)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center gap-3 px-4 py-2 rounded transition-all duration-200
                    ${
                      isCurrent
                        ? "bg-accent-green/20 border-2 border-accent-green text-accent-green scale-105"
                        : ""
                    }
                    ${
                      isCompleted
                        ? "text-accent-green/60 hover:text-accent-green cursor-pointer hover:bg-accent-green/10"
                        : ""
                    }
                    ${isFuture ? "text-foreground/30 cursor-not-allowed" : ""}
                  `}
                >
                  {/* Step Number */}
                  <div
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-sm
                      ${
                        isCurrent
                          ? "border-accent-green bg-accent-green text-background animate-pulse"
                          : ""
                      }
                      ${isCompleted ? "border-accent-green/60 bg-accent-green/20" : ""}
                      ${isFuture ? "border-foreground/30 bg-transparent" : ""}
                    `}
                  >
                    {isCompleted ? (
                      <span className="text-accent-green">✓</span>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`
                      stamp text-xs uppercase tracking-wider hidden sm:inline
                      ${isCurrent ? "font-bold" : ""}
                    `}
                  >
                    {step.label}
                  </span>

                  {/* Current step indicator */}
                  {isCurrent && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-0.5 w-8 md:w-16 transition-all duration-500
                      ${isCompleted ? "bg-accent-green/60" : "bg-foreground/20"}
                    `}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step Description (Mobile) */}
        <div className="sm:hidden mt-3 text-center">
          <span className="stamp text-xs text-accent-green uppercase tracking-widest">
            {steps[currentStepIndex].label}
          </span>
        </div>

        {/* Classified Banner */}
        <div className="absolute top-0 right-4 text-accent-red/20 stamp text-xs rotate-12 pointer-events-none select-none">
          CLASSIFIED
        </div>
      </div>
    </div>
  );
}
