import { useState } from "react";
import { Settings, X, Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

interface BreathingSettingsProps {
  inhaleTime: number;
  exhaleTime: number;
  onSettingsChange: (inhale: number, exhale: number) => void;
}

interface BreathPattern {
  name: string;
  description: string;
  inhale: number;
  exhale: number;
}

// Common breathwork patterns from "Breath" by James Nestor
const BREATH_PATTERNS: BreathPattern[] = [
  {
    name: "Resonant Breathing",
    description: "5.5 seconds each — optimal for heart rate variability",
    inhale: 5500,
    exhale: 5500,
  },
  {
    name: "Relaxing Breath",
    description: "4 in, 6 out — activates parasympathetic system",
    inhale: 4000,
    exhale: 6000,
  },
  {
    name: "Box Breathing",
    description: "4 seconds each — used by Navy SEALs",
    inhale: 4000,
    exhale: 4000,
  },
  {
    name: "4-7-8 Breath",
    description: "4 in, 8 out — Dr. Andrew Weil's calming breath",
    inhale: 4000,
    exhale: 8000,
  },
  {
    name: "Energizing Breath",
    description: "Fast and equal — increases alertness",
    inhale: 2000,
    exhale: 2000,
  },
];

export const BreathingSettings = ({
  inhaleTime,
  exhaleTime,
  onSettingsChange,
}: BreathingSettingsProps) => {
  const [customInhale, setCustomInhale] = useState(inhaleTime / 1000);
  const [customExhale, setCustomExhale] = useState(exhaleTime / 1000);
  const [open, setOpen] = useState(false);

  const handlePatternSelect = (pattern: BreathPattern) => {
    onSettingsChange(pattern.inhale, pattern.exhale);
    setCustomInhale(pattern.inhale / 1000);
    setCustomExhale(pattern.exhale / 1000);
    setOpen(false);
  };

  const handleCustomApply = () => {
    onSettingsChange(customInhale * 1000, customExhale * 1000);
    setOpen(false);
  };

  const isPatternActive = (pattern: BreathPattern) =>
    pattern.inhale === inhaleTime && pattern.exhale === exhaleTime;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-foreground/10 backdrop-blur-md border border-foreground/20 transition-all duration-300 hover:bg-foreground/20"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-foreground" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-3xl bg-card border-foreground/10"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground text-xl">Breathing Patterns</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(85vh-8rem)] pb-8">
          {/* Preset Patterns */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              From "Breath" by James Nestor
            </h3>
            <div className="space-y-2">
              {BREATH_PATTERNS.map((pattern) => (
                <button
                  key={pattern.name}
                  onClick={() => handlePatternSelect(pattern)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 border ${
                    isPatternActive(pattern)
                      ? "bg-primary/20 border-primary/40"
                      : "bg-secondary/50 border-transparent hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{pattern.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pattern.description}
                      </p>
                    </div>
                    {isPatternActive(pattern) && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Duration */}
          <div className="space-y-4 pt-4 border-t border-foreground/10">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Custom Duration
            </h3>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-foreground">Inhale</label>
                  <span className="text-primary font-medium">{customInhale}s</span>
                </div>
                <Slider
                  value={[customInhale]}
                  onValueChange={([value]) => setCustomInhale(value)}
                  min={1}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-foreground">Exhale</label>
                  <span className="text-primary font-medium">{customExhale}s</span>
                </div>
                <Slider
                  value={[customExhale]}
                  onValueChange={([value]) => setCustomExhale(value)}
                  min={1}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleCustomApply}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all duration-200 hover:opacity-90 active:scale-98"
              >
                Apply Custom Timing
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
