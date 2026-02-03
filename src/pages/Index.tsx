import { useState, useCallback } from "react";
import { BreathingVisual } from "@/components/BreathingVisual";
import { BreathingControls } from "@/components/BreathingControls";
import { BreathingSettings } from "@/components/BreathingSettings";
import { PaywallModal } from "@/components/PaywallModal";
import { useSessionCounter } from "@/hooks/use-session-counter";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { trackEvent } from "@/lib/posthog";

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
  const [showPaywall, setShowPaywall] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const { sessionCount, incrementSessionCount, hasReachedFreeLimit, remainingFreeSessions } = useSessionCounter();
  const { isSubscribed } = useSubscription();

  // Track minimum session duration (e.g., 1 minute) to count as a "session"
  const MIN_SESSION_DURATION = 60 * 1000; // 1 minute in ms

  const handleToggle = () => {
    if (!isActive) {
      // Starting a session
      setBreathCount(1);
      setSessionStartTime(Date.now());
      trackEvent('session_started', {
        pattern: patternName,
        sessionCount: sessionCount + 1,
        isSubscribed,
      });
    } else {
      // Stopping a session
      if (sessionStartTime) {
        const duration = Date.now() - sessionStartTime;
        
        // Only count as a completed session if it was at least MIN_SESSION_DURATION
        if (duration >= MIN_SESSION_DURATION) {
          const newCount = incrementSessionCount();
          trackEvent('session_completed', {
            pattern: patternName,
            durationSeconds: Math.round(duration / 1000),
            breathCount,
            sessionCount: newCount,
            isSubscribed,
          });

          // Show paywall after completing a session if limit reached and not subscribed
          if (!isSubscribed && newCount >= 3) {
            setTimeout(() => setShowPaywall(true), 500);
          }
        }
      }
      setBreathCount(0);
      setSessionStartTime(null);
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

      {/* Free session indicator (only shown before limit reached) */}
      {!isSubscribed && !hasReachedFreeLimit && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {remainingFreeSessions} free session{remainingFreeSessions !== 1 ? 's' : ''} remaining
        </div>
      )}

      {/* Paywall Modal */}
      <PaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
      />
    </div>
  );
};

export default Index;
