import { useState, useCallback } from "react";
import { BreathingVisual } from "@/components/BreathingVisual";
import { BreathingControls } from "@/components/BreathingControls";
import { BreathingSettings } from "@/components/BreathingSettings";

const getPatternName = (inhale: number, exhale: number, holdIn: number, holdOut: number): string => {
  // Check for known patterns
  if (inhale === 5500 && exhale === 5500 && holdIn === 0 && holdOut === 0) return "Resonant Breathing";
  if (inhale === 4000 && exhale === 6000 && holdIn === 0 && holdOut === 0) return "Relaxing Breath";
  if (inhale === 4000 && exhale === 4000 && holdIn === 4000 && holdOut === 4000) return "Box Breathing";
  if (inhale === 4000 && exhale === 8000 && holdIn === 7000 && holdOut === 0) return "4-7-8 Breath";
  if (inhale === 2000 && exhale === 2000 && holdIn === 0 && holdOut === 0) return "Energizing Breath";
  
  // Custom pattern - show timing
  const parts = [];
  parts.push(`${inhale / 1000}`);
  if (holdIn > 0) parts.push(`${holdIn / 1000}`);
  parts.push(`${exhale / 1000}`);
  if (holdOut > 0) parts.push(`${holdOut / 1000}`);
  return parts.join("-") + " Breath";
};

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "exhale" | "hold">("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [inhaleTime, setInhaleTime] = useState(4000);
  const [exhaleTime, setExhaleTime] = useState(4000);
  const [holdAfterInhale, setHoldAfterInhale] = useState(0);
  const [holdAfterExhale, setHoldAfterExhale] = useState(0);

  const [currentHoldDuration, setCurrentHoldDuration] = useState(0);

  const handleToggle = () => {
    if (!isActive) {
      setBreathCount(1);
    } else {
      setBreathCount(0);
    }
    setIsActive(!isActive);
    setPhase("inhale");
    setCurrentHoldDuration(0);
  };

  const handlePhaseChange = useCallback((newPhase: "inhale" | "exhale" | "hold", holdDuration?: number) => {
    setPhase(newPhase);
    setCurrentHoldDuration(holdDuration || 0);
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

  const patternName = getPatternName(inhaleTime, exhaleTime, holdAfterInhale, holdAfterExhale);

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
        patternName={patternName}
        holdDuration={currentHoldDuration}
      />
    </div>
  );
};

export default Index;
