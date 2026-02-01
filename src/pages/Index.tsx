import { useState, useCallback } from "react";
import { BreathingVisual } from "@/components/BreathingVisual";
import { BreathingControls } from "@/components/BreathingControls";
import { BreathingSettings } from "@/components/BreathingSettings";

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "exhale" | "hold">("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [inhaleTime, setInhaleTime] = useState(4000);
  const [exhaleTime, setExhaleTime] = useState(4000);
  const [holdAfterInhale, setHoldAfterInhale] = useState(0);
  const [holdAfterExhale, setHoldAfterExhale] = useState(0);

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

  const handleSettingsChange = (inhale: number, exhale: number, holdIn: number, holdOut: number) => {
    setInhaleTime(inhale);
    setExhaleTime(exhale);
    setHoldAfterInhale(holdIn);
    setHoldAfterExhale(holdOut);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Settings button */}
      <BreathingSettings
        inhaleTime={inhaleTime}
        exhaleTime={exhaleTime}
        holdAfterInhale={holdAfterInhale}
        holdAfterExhale={holdAfterExhale}
        onSettingsChange={handleSettingsChange}
      />

      {/* Breathing visualization */}
      <BreathingVisual
        isActive={isActive}
        inhaleTime={inhaleTime}
        exhaleTime={exhaleTime}
        holdAfterInhale={holdAfterInhale}
        holdAfterExhale={holdAfterExhale}
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
