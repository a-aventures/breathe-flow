import { useEffect, useRef, useState } from "react";
import { useBreathTheme } from "@/hooks/use-breath-theme";
import { getTheme } from "@/lib/breath-themes";

interface BreathingVisualProps {
  isActive: boolean;
  inhaleTime: number;
  exhaleTime: number;
  holdAfterInhale: number;
  holdAfterExhale: number;
  onPhaseChange?: (phase: "inhale" | "exhale" | "hold", holdDuration?: number) => void;
  /** Optional override, used by the design system preview */
  themeId?: string;
}

export const BREATH_GRADIENTS = getTheme("classic").gradients;

type Phase = "inhale" | "holdIn" | "exhale" | "holdOut";

export const BreathingVisual = ({
  isActive,
  inhaleTime,
  exhaleTime,
  holdAfterInhale,
  holdAfterExhale,
  onPhaseChange,
  themeId,
}: BreathingVisualProps) => {
  const { theme } = useBreathTheme();
  const gradients = themeId ? getTheme(themeId).gradients : theme.gradients;

  const [phase, setPhase] = useState<Phase>("inhale");
  const [foregroundColorIndex, setForegroundColorIndex] = useState(0);
  const [backgroundColorIndex, setBackgroundColorIndex] = useState(1);
  const [fillPercent, setFillPercent] = useState(0);
  const wasActiveRef = useRef(false);

  const foregroundGradient = gradients[foregroundColorIndex % gradients.length];
  const backgroundGradient = gradients[backgroundColorIndex % gradients.length];

  useEffect(() => {
    if (!isActive) {
      wasActiveRef.current = false;
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
    
    // Initial phase notification — only when a session starts, not on every
    // phase change (the transition above already notifies, so re-notifying
    // here would double-count breaths)
    if (!wasActiveRef.current) {
      wasActiveRef.current = true;
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
