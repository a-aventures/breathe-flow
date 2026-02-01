import { useEffect, useState } from "react";

interface BreathingVisualProps {
  isActive: boolean;
  inhaleTime: number;
  exhaleTime: number;
  onPhaseChange?: (phase: "inhale" | "exhale" | "hold") => void;
}

const BREATH_GRADIENTS = [
  "linear-gradient(180deg, hsl(200, 60%, 55%) 0%, hsl(220, 50%, 35%) 100%)",   // Ocean depths
  "linear-gradient(180deg, hsl(165, 55%, 50%) 0%, hsl(185, 45%, 30%) 100%)",   // Teal waters
  "linear-gradient(180deg, hsl(270, 45%, 60%) 0%, hsl(290, 35%, 35%) 100%)",   // Lavender dusk
  "linear-gradient(180deg, hsl(345, 50%, 60%) 0%, hsl(320, 40%, 35%) 100%)",   // Soft rose
  "linear-gradient(180deg, hsl(25, 60%, 60%) 0%, hsl(10, 50%, 35%) 100%)",     // Warm sunset
  "linear-gradient(180deg, hsl(145, 45%, 50%) 0%, hsl(160, 35%, 28%) 100%)",   // Forest depths
];

export const BreathingVisual = ({
  isActive,
  inhaleTime,
  exhaleTime,
  onPhaseChange,
}: BreathingVisualProps) => {
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const [colorIndex, setColorIndex] = useState(0);
  const [fillPercent, setFillPercent] = useState(0);

  const currentGradient = BREATH_GRADIENTS[colorIndex];
  const nextGradient = BREATH_GRADIENTS[(colorIndex + 1) % BREATH_GRADIENTS.length];

  useEffect(() => {
    if (!isActive) {
      setFillPercent(0);
      setPhase("inhale");
      return;
    }

    let animationFrame: number;
    let startTime = Date.now();
    const currentPhaseTime = phase === "inhale" ? inhaleTime : exhaleTime;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / currentPhaseTime, 1);

      if (phase === "inhale") {
        setFillPercent(progress * 100);
      } else {
        setFillPercent((1 - progress) * 100);
      }

      if (progress >= 1) {
        if (phase === "inhale") {
          setPhase("exhale");
          onPhaseChange?.("exhale");
        } else {
          // Exhale complete - cycle to next color
          setColorIndex((prev) => (prev + 1) % BREATH_GRADIENTS.length);
          setPhase("inhale");
          onPhaseChange?.("inhale");
        }
        startTime = Date.now();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    onPhaseChange?.(phase);

    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, phase, inhaleTime, exhaleTime, onPhaseChange]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Background - the NEXT gradient, revealed as exhale drains the fill */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: nextGradient,
        }}
      />

      {/* Foreground fill - current gradient that fills from bottom to top on inhale */}
      <div
        className="absolute left-0 right-0 bottom-0 w-full"
        style={{
          height: `${fillPercent}%`,
          background: currentGradient,
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
