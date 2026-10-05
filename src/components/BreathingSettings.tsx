import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Check, LogOut, Crown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { useBreathTheme } from "@/hooks/use-breath-theme";
import { Button } from "@/components/ui/button";

interface BreathingSettingsProps {
  inhaleTime: number;
  exhaleTime: number;
  holdAfterInhale: number;
  holdAfterExhale: number;
  onSettingsChange: (inhale: number, exhale: number, holdIn: number, holdOut: number) => void;
}

interface BreathPattern {
  name: string;
  description: string;
  inhale: number;
  exhale: number;
  holdAfterInhale: number;
  holdAfterExhale: number;
}

// Common breathwork patterns from "Breath" by James Nestor
const BREATH_PATTERNS: BreathPattern[] = [
  {
    name: "Resonant Breathing",
    description: "5.5 seconds each — optimal for heart rate variability",
    inhale: 5500,
    exhale: 5500,
    holdAfterInhale: 0,
    holdAfterExhale: 0,
  },
  {
    name: "Relaxing Breath",
    description: "4 in, 6 out — activates parasympathetic system",
    inhale: 4000,
    exhale: 6000,
    holdAfterInhale: 0,
    holdAfterExhale: 0,
  },
  {
    name: "Box Breathing",
    description: "4-4-4-4 — used by Navy SEALs for focus",
    inhale: 4000,
    exhale: 4000,
    holdAfterInhale: 4000,
    holdAfterExhale: 4000,
  },
  {
    name: "4-7-8 Breath",
    description: "4 in, 7 hold, 8 out — Dr. Andrew Weil's calming breath",
    inhale: 4000,
    exhale: 8000,
    holdAfterInhale: 7000,
    holdAfterExhale: 0,
  },
  {
    name: "Energizing Breath",
    description: "Fast and equal — increases alertness",
    inhale: 2000,
    exhale: 2000,
    holdAfterInhale: 0,
    holdAfterExhale: 0,
  },
];

export const BreathingSettings = ({
  inhaleTime,
  exhaleTime,
  holdAfterInhale,
  holdAfterExhale,
  onSettingsChange,
}: BreathingSettingsProps) => {
  const [customInhale, setCustomInhale] = useState(inhaleTime / 1000);
  const [customExhale, setCustomExhale] = useState(exhaleTime / 1000);
  const [customHoldIn, setCustomHoldIn] = useState(holdAfterInhale / 1000);
  const [customHoldOut, setCustomHoldOut] = useState(holdAfterExhale / 1000);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { isSubscribed } = useSubscription();
  const { toast } = useToast();
  const { themeId, themes, setThemeId } = useBreathTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handlePatternSelect = (pattern: BreathPattern) => {
    onSettingsChange(pattern.inhale, pattern.exhale, pattern.holdAfterInhale, pattern.holdAfterExhale);
    setCustomInhale(pattern.inhale / 1000);
    setCustomExhale(pattern.exhale / 1000);
    setCustomHoldIn(pattern.holdAfterInhale / 1000);
    setCustomHoldOut(pattern.holdAfterExhale / 1000);
    setOpen(false);
  };

  const handleCustomApply = () => {
    onSettingsChange(customInhale * 1000, customExhale * 1000, customHoldIn * 1000, customHoldOut * 1000);
    setOpen(false);
  };

  const isPatternActive = (pattern: BreathPattern) =>
    pattern.inhale === inhaleTime && 
    pattern.exhale === exhaleTime && 
    pattern.holdAfterInhale === holdAfterInhale && 
    pattern.holdAfterExhale === holdAfterExhale;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="button-clear absolute top-6 right-6 z-50 h-11 w-11 border-foreground/40"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="glass-surface bg-transparent h-[85vh] rounded-t-[2rem] border-t"
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
            <div className="divide-y divide-foreground/10">
              {BREATH_PATTERNS.map((pattern) => (
                <Button
                  variant="editorial"
                  key={pattern.name}
                  onClick={() => handlePatternSelect(pattern)}
                  aria-pressed={isPatternActive(pattern)}
                  className="w-full h-auto min-h-16 px-0 py-4 text-left whitespace-normal justify-start"
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-xl text-foreground">{pattern.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                        {pattern.description}
                      </p>
                    </div>
                    {isPatternActive(pattern) && (
                      <Check className="w-4 h-4 text-foreground shrink-0" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Visual Theme */}
          <div className="space-y-3 pt-4 border-t border-foreground/10">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Visual Theme
            </h3>
            <div className="divide-y divide-foreground/10">
              {themes.map((t) => (
                <Button
                  variant="editorial"
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  aria-pressed={themeId === t.id}
                  className="w-full h-auto px-0 py-4 text-left whitespace-normal flex-col items-stretch"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-display text-xl text-foreground">{t.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 font-normal">{t.description}</p>
                    </div>
                    {themeId === t.id && <Check className="w-4 h-4 text-foreground shrink-0" />}
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    {t.gradients.map((g, i) => (
                      <div
                        key={i}
                        className="h-5 flex-1 overflow-hidden rounded-sm"
                        style={{ background: t.washImages?.[i] ? `center / cover no-repeat url("${t.washImages[i]}")` : g }}
                      />
                    ))}
                  </div>
                </Button>
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
                  <label className="text-foreground">Hold after inhale</label>
                  <span className="text-primary font-medium">{customHoldIn}s</span>
                </div>
                <Slider
                  value={[customHoldIn]}
                  onValueChange={([value]) => setCustomHoldIn(value)}
                  min={0}
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

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-foreground">Hold after exhale</label>
                  <span className="text-primary font-medium">{customHoldOut}s</span>
                </div>
                <Slider
                  value={[customHoldOut]}
                  onValueChange={([value]) => setCustomHoldOut(value)}
                  min={0}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleCustomApply}
                className="w-full h-12 font-medium"
              >
                Apply Custom Timing
              </Button>
            </div>
          </div>

          {/* Account Section */}
          <div className="pt-4 border-t border-foreground/10 space-y-3">
            <div className="text-xs text-muted-foreground">
              Signed in as {user?.email}
            </div>
            
            {/* Subscription Status / Settings Link */}
            <Button
              variant="editorial"
              onClick={() => {
                setOpen(false);
                navigate('/settings');
              }}
              className="w-full h-12 px-0 justify-start border-b border-foreground/10"
            >
              <Crown className="w-4 h-4" />
              {isSubscribed ? 'Premium Member' : 'Account Settings'}
            </Button>

            <Button
              variant="editorial"
              onClick={handleSignOut}
              className="w-full h-12 px-0 justify-start text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
