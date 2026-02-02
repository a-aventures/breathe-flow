import { useEffect, useState } from "react";

interface BreathingVisualProps {
  isActive: boolean;
  inhaleTime: number;
  exhaleTime: number;
  holdAfterInhale: number;
  holdAfterExhale: number;
  onPhaseChange?: (phase: "inhale" | "exhale" | "hold", holdDuration?: number) => void;
}

const BREATH_GRADIENTS = [
  "linear-gradient(180deg, hsl(200, 60%, 55%) 0%, hsl(220, 50%, 35%) 100%)",   // Ocean depths
  "linear-gradient(180deg, hsl(165, 55%, 50%) 0%, hsl(185, 45%, 30%) 100%)",   // Teal waters
  "linear-gradient(180deg, hsl(270, 45%, 60%) 0%, hsl(290, 35%, 35%) 100%)",   // Lavender dusk
  "linear-gradient(180deg, hsl(345, 50%, 60%) 0%, hsl(320, 40%, 35%) 100%)",   // Soft rose
  "linear-gradient(180deg, hsl(25, 60%, 60%) 0%, hsl(10, 50%, 35%) 100%)",     // Warm sunset
  "linear-gradient(180deg, hsl(145, 45%, 50%) 0%, hsl(160, 35%, 28%) 100%)",   // Forest depths
];

type Phase = "inhale" | "holdIn" | "exhale" | "holdOut";

export const BreathingVisual = ({
  isActive,
  inhaleTime,
  exhaleTime,
  holdAfterInhale,
  holdAfterExhale,
  onPhaseChange,
}: BreathingVisualProps) => {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [foregroundColorIndex, setForegroundColorIndex] = useState(0);
  const [backgroundColorIndex, setBackgroundColorIndex] = useState(1);
  const [fillPercent, setFillPercent] = useState(0);

  const foregroundGradient = BREATH_GRADIENTS[foregroundColorIndex];
  const backgroundGradient = BREATH_GRADIENTS[backgroundColorIndex];

  useEffect(() => {
    if (!isActive) {
      setFillPercent(0);
      setPhase("inhale");
      return;
    }

    let animationFrame: number;
    let startTime = Date.now();

    const getPhaseTime = (p: Phase) => {
      switch (p) {
        case "inhale": return inhaleTime;
        case "holdIn": return holdAfterInhale;
        case "exhale": return exhaleTime;
        case "holdOut": return holdAfterExhale;
      }
    };

    const getNextPhase = (p: Phase): Phase => {
      switch (p) {
        case "inhale": return holdAfterInhale > 0 ? "holdIn" : "exhale";
        case "holdIn": return "exhale";
        case "exhale": return holdAfterExhale > 0 ? "holdOut" : "inhale";
        case "holdOut": return "inhale";
      }
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const currentPhaseTime = getPhaseTime(phase);
      const progress = currentPhaseTime > 0 ? Math.min(elapsed / currentPhaseTime, 1) : 1;

      // Update fill based on phase
      if (phase === "inhale") {
        setFillPercent(progress * 100);
      } else if (phase === "exhale") {
        setFillPercent((1 - progress) * 100);
      }
      // During hold phases, fillPercent stays constant

      if (progress >= 1) {
        const nextPhase = getNextPhase(phase);
        
        // Change foreground color when transitioning to inhale (foreground is hidden at 0%)
        if (nextPhase === "inhale" && (phase === "exhale" || phase === "holdOut")) {
          setForegroundColorIndex((prev) => (prev + 1) % BREATH_GRADIENTS.length);
        }
        
        // Change background color when transitioning to exhale (background is hidden at 100% fill)
        if (nextPhase === "exhale" && (phase === "inhale" || phase === "holdIn")) {
          setBackgroundColorIndex((prev) => (prev + 1) % BREATH_GRADIENTS.length);
        }

        setPhase(nextPhase);
        
        // Notify parent with simplified phase and hold duration
        if (nextPhase === "inhale") {
          onPhaseChange?.("inhale");
        } else if (nextPhase === "exhale") {
          onPhaseChange?.("exhale");
        } else if (nextPhase === "holdIn") {
          onPhaseChange?.("hold", holdAfterInhale);
        } else if (nextPhase === "holdOut") {
          onPhaseChange?.("hold", holdAfterExhale);
        }
        
        startTime = Date.now();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    
    // Initial phase notification
    if (phase === "inhale") {
      onPhaseChange?.("inhale");
    } else if (phase === "exhale") {
      onPhaseChange?.("exhale");
    } else if (phase === "holdIn") {
      onPhaseChange?.("hold", holdAfterInhale);
    } else if (phase === "holdOut") {
      onPhaseChange?.("hold", holdAfterExhale);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, phase, inhaleTime, exhaleTime, holdAfterInhale, holdAfterExhale, onPhaseChange]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Background - revealed as exhale drains the fill */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: backgroundGradient,
        }}
      />

      {/* Foreground fill - fills from bottom to top on inhale */}
      <div
        className="absolute left-0 right-0 bottom-0 w-full"
        style={{
          height: `${fillPercent}%`,
          background: foregroundGradient,
        }}
      />

      {/* Soft glowing edge at the transition line */}
      <div
        className="absolute left-0 right-0 h-40 pointer-events-none"
        style={{
          bottom: `calc(${fillPercent}% - 5rem)`,
          background: `linear-gradient(to top, hsla(0, 0%, 100%, 0.08), transparent)`,
          filter: "blur(24px)",
          opacity: 0.6,
        }}
      />
    </div>
  );
};
