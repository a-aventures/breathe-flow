import { useEffect, useState } from "react";

interface BreathingVisualProps {
  isActive: boolean;
  inhaleTime: number;
  exhaleTime: number;
  onPhaseChange?: (phase: "inhale" | "exhale" | "hold") => void;
}

const BREATH_COLORS = [
  "hsl(200, 60%, 50%)",   // Ocean blue
  "hsl(165, 55%, 45%)",   // Teal
  "hsl(270, 45%, 55%)",   // Lavender
  "hsl(345, 50%, 55%)",   // Soft rose
  "hsl(25, 60%, 55%)",    // Warm coral
  "hsl(145, 45%, 45%)",   // Sage green
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

  const currentColor = BREATH_COLORS[colorIndex];
  const nextColor = BREATH_COLORS[(colorIndex + 1) % BREATH_COLORS.length];

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
          setColorIndex((prev) => (prev + 1) % BREATH_COLORS.length);
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
    <div className="absolute inset-0 overflow-hidden">
      {/* Background - the NEXT color, revealed as exhale drains the fill */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: nextColor,
        }}
      />

      {/* Foreground fill - current color that fills up on inhale, drains on exhale */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: `${fillPercent}%`,
          backgroundColor: currentColor,
          transition: "height 16ms linear",
        }}
      />

      {/* Soft glowing edge at the transition line */}
      <div
        className="absolute inset-x-0 h-24 pointer-events-none"
        style={{
          bottom: `calc(${fillPercent}% - 3rem)`,
          background: `linear-gradient(to top, ${currentColor}, transparent)`,
          filter: "blur(16px)",
          opacity: 0.7,
        }}
      />
    </div>
  );
};
