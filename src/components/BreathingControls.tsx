import { Play, Pause } from "lucide-react";
import { useEffect, useState } from "react";

interface BreathingControlsProps {
  isActive: boolean;
  onToggle: () => void;
  phase: "inhale" | "exhale" | "hold";
  breathCount: number;
  patternName: string;
  holdDuration: number;
}

export const BreathingControls = ({
  isActive,
  onToggle,
  phase,
  breathCount,
  patternName,
  holdDuration,
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
      <div className="animate-fade-in-up text-center">
        {isActive ? (
          <>
            <p className="text-foreground/80 text-lg font-medium tracking-wide mb-1">
              {patternName}
            </p>
            {breathCount > 0 && (
              <p className="text-foreground/50 text-sm tracking-widest uppercase">
                Breath {breathCount}
              </p>
            )}
          </>
        ) : (
          <p className="text-foreground/60 text-lg font-medium tracking-wide">
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
              <p className="text-6xl md:text-7xl font-light text-foreground/90 mt-4 tabular-nums">
                {holdCountdown}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-light tracking-wide text-foreground mb-2">
              Breathwork
            </h1>
            <p className="text-foreground/50 text-lg">
              Find your calm
            </p>
          </div>
        )}
      </div>

      {/* Bottom - controls */}
      <div className="pointer-events-auto">
        <button
          onClick={onToggle}
          className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-foreground/10 backdrop-blur-md border border-foreground/20 transition-all duration-300 hover:bg-foreground/20 hover:scale-105 active:scale-95"
          aria-label={isActive ? "Pause" : "Start"}
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isActive ? (
            <Pause className="w-8 h-8 text-foreground" />
          ) : (
            <Play className="w-8 h-8 text-foreground ml-1" />
          )}
        </button>

        {!isActive && (
          <p className="text-foreground/40 text-sm mt-4 text-center">
            Tap to begin
          </p>
        )}
      </div>
    </div>
  );
};
