import { useState, useCallback } from "react";
import { BreathingVisual } from "@/components/BreathingVisual";
import { BreathingControls } from "@/components/BreathingControls";

const INHALE_TIME = 4000; // 4 seconds
const EXHALE_TIME = 4000; // 4 seconds

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "exhale" | "hold">("inhale");
  const [breathCount, setBreathCount] = useState(0);

  const handleToggle = () => {
    if (!isActive) {
      setBreathCount(1);
    } else {
      setBreathCount(0);
    }
    setIsActive(!isActive);
    setPhase("inhale");
  };

  const handlePhaseChange = useCallback((newPhase: "inhale" | "exhale" | "hold") => {
    setPhase(newPhase);
    if (newPhase === "inhale") {
      setBreathCount((prev) => prev + 1);
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Breathing visualization */}
      <BreathingVisual
        isActive={isActive}
        inhaleTime={INHALE_TIME}
        exhaleTime={EXHALE_TIME}
        onPhaseChange={handlePhaseChange}
      />

      {/* Overlay controls */}
      <BreathingControls
        isActive={isActive}
        onToggle={handleToggle}
        phase={phase}
        breathCount={breathCount}
      />
    </div>
  );
};

export default Index;
