import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { BreathingControls } from "@/components/BreathingControls";
import { BreathingSettings } from "@/components/BreathingSettings";
import { BreathingVisual } from "@/components/BreathingVisual";
import { useBreathTheme } from "@/hooks/use-breath-theme";

const TOKENS = [
  "background", "foreground", "card", "card-foreground", "primary", "primary-foreground",
  "secondary", "secondary-foreground", "muted", "muted-foreground", "accent",
  "accent-foreground", "destructive", "border", "ring",
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    {children}
  </section>
);

const DesignSystem = () => {
  const [phase, setPhase] = useState<"inhale" | "exhale" | "hold">("inhale");
  const [active, setActive] = useState(false);
  const [times, setTimes] = useState({ inhale: 4000, exhale: 4000, holdIn: 0, holdOut: 0 });
  const { themeId, themes, setThemeId, theme } = useBreathTheme();
  const [previewActive, setPreviewActive] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl space-y-12 px-6 py-10">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-light breath-text-glow">Design System</h1>
            <p className="mt-2 text-muted-foreground">Every color, gradient and building block used in the breathing app.</p>
          </div>
          <Link to="/" className="text-sm text-primary underline-offset-4 hover:underline">Back to app</Link>
        </header>

        <Section title="Colors">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {TOKENS.map((t) => (
              <div key={t} className="overflow-hidden rounded-lg border border-border">
                <div className="h-16" style={{ background: `hsl(var(--${t}))` }} />
                <div className="bg-card p-2 text-xs text-card-foreground">{t}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Breath gradients">
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <Button
                key={t.id}
                size="sm"
                variant={themeId === t.id ? "default" : "outline"}
                onClick={() => setThemeId(t.id)}
              >
                {t.name}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{theme.description}</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
            {theme.gradients.map((g, i) => (
              <div key={i} className="space-y-2">
                <div className="h-40 rounded-xl" style={{ background: g }} />
                <p className="text-xs text-muted-foreground">{theme.gradientNames[i]}</p>
              </div>
            ))}
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border [transform:translateZ(0)]">
            <div className="absolute inset-0 [&>div]:!absolute">
              <BreathingVisual
                isActive={previewActive}
                inhaleTime={4000}
                exhaleTime={4000}
                holdAfterInhale={0}
                holdAfterExhale={0}
              />
            </div>
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <Button onClick={() => setPreviewActive((a) => !a)}>
                {previewActive ? "Pause preview" : "Play breathing preview"}
              </Button>
            </div>
          </div>
        </Section>


        <Section title="Typography">
          <Card>
            <CardContent className="space-y-3 pt-6">
              <p className="text-5xl font-light breath-text-glow">Breathe in</p>
              <p className="text-2xl font-light">Box Breathing</p>
              <p className="text-base">Body text for descriptions and settings.</p>
              <p className="text-sm text-muted-foreground">Muted helper text</p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Buttons & badges">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
        </Section>

        <Section title="Form elements">
          <Card>
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Cards are used for sign-in and settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="ds-email">Email</Label>
                <Input id="ds-email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Inhale duration</Label>
                <Slider defaultValue={[4]} min={1} max={10} step={0.5} />
              </div>
              <div className="flex items-center gap-3">
                <Switch id="ds-switch" />
                <Label htmlFor="ds-switch">Sound cues</Label>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section title="Breathing controls (live)">
          <div className="flex gap-2">
            {(["inhale", "hold", "exhale"] as const).map((p) => (
              <Button key={p} size="sm" variant={phase === p ? "default" : "outline"} onClick={() => setPhase(p)}>
                {p}
              </Button>
            ))}
          </div>
          <div
            className="relative h-[520px] overflow-hidden rounded-2xl border border-border [transform:translateZ(0)]"
            style={{ background: theme.gradients[0] }}
          >
            <BreathingControls
              isActive={active}
              onToggle={() => setActive((a) => !a)}
              phase={phase}
              breathCount={3}
              patternName="Box Breathing"
              holdDuration={phase === "hold" ? 4000 : 0}
            />
            <div className="absolute right-4 top-4 z-50">
              <BreathingSettings
                inhaleTime={times.inhale}
                exhaleTime={times.exhale}
                holdAfterInhale={times.holdIn}
                holdAfterExhale={times.holdOut}
                onSettingsChange={(inhale, exhale, holdIn, holdOut) => setTimes({ inhale, exhale, holdIn, holdOut })}
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default DesignSystem;
