import { Play, Pause } from "lucide-react";

interface BreathingControlsProps {
  isActive: boolean;
  onToggle: () => void;
  phase: "inhale" | "exhale" | "hold";
  breathCount: number;
}

export const BreathingControls = ({
  isActive,
  onToggle,
  phase,
  breathCount,
}: BreathingControlsProps) => {
  const phaseText = {
    inhale: "Breathe In",
    exhale: "Breathe Out",
    hold: "Hold",
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between py-16 px-8 pointer-events-none">
      {/* Top section - breath count */}
      <div className="animate-fade-in-up">
        {isActive && breathCount > 0 && (
          <p className="text-foreground/60 text-sm tracking-widest uppercase">
            Breath {breathCount}
          </p>
        )}
      </div>

      {/* Center - phase indicator */}
      <div className="flex flex-col items-center gap-4">
        {isActive ? (
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-foreground breath-text-glow animate-pulse-soft">
            {phaseText[phase]}
          </h1>
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
