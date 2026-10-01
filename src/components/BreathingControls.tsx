import { Play, Pause } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BreathingControlsProps {
  isActive: boolean;
  onToggle: () => void;
  phase: "inhale" | "exhale" | "hold";
  breathCount: number;
  patternName: string;
  holdDuration: number;
  freeSessionsRemaining?: number;
}

export const BreathingControls = ({
  isActive,
  onToggle,
  phase,
  breathCount,
  patternName,
  holdDuration,
  freeSessionsRemaining = 0,
}: BreathingControlsProps) => {

  const [holdCountdown, setHoldCountdown] = useState(0);

  useEffect(() => {
    if (phase !== "hold" || holdDuration === 0) {
      setHoldCountdown(0);
      return;
    }

    // Start countdown from hold duration
    setHoldCountdown(Math.ceil(holdDuration / 1000));
    
    const interval = setInterval(() => {
      setHoldCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, holdDuration]);

  const phaseText = {
    inhale: "Breathe In",
    exhale: "Breathe Out",
    hold: "Hold",
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between py-16 px-8 pointer-events-none">
      {/* Top section - pattern name and breath count */}
      <div className="animate-fade-in-up text-center breath-text-legible">
        {isActive ? (
          <>
            <p className="text-foreground/90 text-lg font-medium tracking-wide mb-1">
              {patternName}
            </p>
            {breathCount > 0 && (
              <p className="text-foreground/75 text-sm tracking-widest uppercase">
                Breath {breathCount}
              </p>
            )}
          </>
        ) : (
          <p className="text-foreground/80 text-lg font-medium tracking-wide">
            {patternName}
          </p>
        )}
      </div>

      {/* Center - phase indicator */}
      <div className="flex flex-col items-center gap-4">
        {isActive ? (
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light tracking-wide text-foreground breath-text-glow animate-pulse-soft">
              {phaseText[phase]}
            </h1>
            {phase === "hold" && holdCountdown > 0 && (
              <p className="text-foreground text-6xl md:text-7xl font-light mt-4 tabular-nums breath-text-glow">
                {holdCountdown}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center breath-text-legible">
            <h1 className="text-6xl md:text-7xl font-light tracking-wide text-foreground mb-2">
              Breathwork
            </h1>
            <p className="text-foreground/75 text-lg">
              Find your calm
            </p>
            {freeSessionsRemaining > 0 && (
              <p className="mt-3 inline-block text-xs text-foreground/70 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full breath-text-legible">
                {freeSessionsRemaining} free session{freeSessionsRemaining !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>

        )}
      </div>

      {/* Bottom - controls */}
      <div className="pointer-events-auto">
        <Button
          onClick={onToggle}
          size="icon"
          className="w-20 h-20 border-foreground/40 transition-transform duration-300 hover:scale-105 active:scale-95"
          aria-label={isActive ? "Pause" : "Start"}
        >
          {isActive ? (
            <Pause className="w-8 h-8 text-foreground" />
          ) : (
            <Play className="w-8 h-8 text-foreground ml-1" />
          )}
        </Button>

        {!isActive && (
          <p className="text-foreground/65 text-sm mt-4 text-center breath-text-legible">
            Tap to begin
          </p>
        )}
      </div>
    </div>
  );
};
