import { useEffect, useState } from "react";

interface BreathingVisualProps {
  isActive: boolean;
  inhaleTime: number;
  exhaleTime: number;
  onPhaseChange?: (phase: "inhale" | "exhale" | "hold") => void;
}

const BREATH_COLORS = [
  "hsl(200, 60%, 45%)",   // Ocean blue
  "hsl(170, 50%, 50%)",   // Teal
  "hsl(280, 40%, 55%)",   // Lavender
  "hsl(340, 45%, 55%)",   // Soft rose
  "hsl(30, 55%, 55%)",    // Warm coral
  "hsl(150, 40%, 45%)",   // Sage green
];

const BG_COLORS = [
  "linear-gradient(180deg, hsl(220, 35%, 12%) 0%, hsl(200, 40%, 15%) 100%)",
  "linear-gradient(180deg, hsl(200, 40%, 15%) 0%, hsl(170, 35%, 12%) 100%)",
  "linear-gradient(180deg, hsl(170, 35%, 12%) 0%, hsl(280, 30%, 15%) 100%)",
  "linear-gradient(180deg, hsl(280, 30%, 15%) 0%, hsl(340, 30%, 12%) 100%)",
  "linear-gradient(180deg, hsl(340, 30%, 12%) 0%, hsl(30, 35%, 12%) 100%)",
  "linear-gradient(180deg, hsl(30, 35%, 12%) 0%, hsl(150, 30%, 12%) 100%)",
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
  const [nextColorIndex, setNextColorIndex] = useState(1);

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
        // Phase complete
        if (phase === "inhale") {
          setPhase("exhale");
          // Prepare next color for when exhale completes
          setNextColorIndex((colorIndex + 1) % BREATH_COLORS.length);
          onPhaseChange?.("exhale");
        } else {
          // Exhale complete - cycle to next color
          setColorIndex(nextColorIndex);
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
  }, [isActive, phase, inhaleTime, exhaleTime, colorIndex, nextColorIndex, onPhaseChange]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background - next color revealed on exhale */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: BG_COLORS[nextColorIndex],
        }}
      />

      {/* Foreground fill - the breathing layer */}
      <div
        className="absolute inset-x-0 bottom-0 transition-none"
        style={{
          height: `${fillPercent}%`,
          background: BREATH_COLORS[colorIndex],
          boxShadow: `0 -20px 60px ${BREATH_COLORS[colorIndex]}40`,
        }}
      />

      {/* Soft glow at the edge */}
      <div
        className="absolute inset-x-0 h-32 pointer-events-none transition-none"
        style={{
          bottom: `calc(${fillPercent}% - 4rem)`,
          background: `linear-gradient(to top, ${BREATH_COLORS[colorIndex]}60, transparent)`,
          filter: "blur(20px)",
        }}
      />
    </div>
  );
};
