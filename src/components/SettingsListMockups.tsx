import { useState } from "react";
import { Check } from "lucide-react";
import { useBreathTheme } from "@/hooks/use-breath-theme";
import { cn } from "@/lib/utils";

const PATTERNS = [
  { name: "Resonant Breathing", description: "5.5 seconds each — optimal for heart rate variability" },
  { name: "Relaxing Breath", description: "4 in, 6 out — activates parasympathetic system" },
  { name: "Box Breathing", description: "4-4-4-4 — used by Navy SEALs for focus" },
  { name: "4-7-8 Breath", description: "4 in, 7 hold, 8 out — calming breath" },
];

type Props = { selected: number; onSelect: (i: number) => void };

const Label = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</h3>
);

/** 1. Editorial hairline list — no boxes, only thin dividers */
const EditorialList = ({ selected, onSelect }: Props) => (
  <div>
    <Label>From "Breath" by James Nestor</Label>
    <ul className="divide-y divide-foreground/10">
      {PATTERNS.map((p, i) => (
        <li key={p.name}>
          <button
            onClick={() => onSelect(i)}
            className="flex w-full items-center justify-between gap-3 py-4 text-left transition-opacity active:opacity-60"
          >
            <div>
              <p className={cn("font-display text-lg text-foreground", selected === i && "font-semibold")}>{p.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{p.description}</p>
            </div>
            {selected === i && <Check className="h-4 w-4 shrink-0 text-foreground" />}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

/** 2. Grouped inset card — one soft container, inner dividers */
const GroupedCard = ({ selected, onSelect }: Props) => (
  <div>
    <Label>From "Breath" by James Nestor</Label>
    <div className="overflow-hidden rounded-2xl bg-foreground/5 ring-1 ring-foreground/10">
      {PATTERNS.map((p, i) => (
        <button
          key={p.name}
          onClick={() => onSelect(i)}
          className={cn(
            "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-foreground/5",
            i > 0 && "border-t border-foreground/10",
            selected === i && "bg-foreground/[0.07]"
          )}
        >
          <div>
            <p className="text-foreground">{p.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{p.description}</p>
          </div>
          {selected === i && <Check className="h-4 w-4 shrink-0 text-primary" />}
        </button>
      ))}
    </div>
  </div>
);

/** 3. Typographic minimalist — open rows, a quiet dot marks the active one */
const MinimalList = ({ selected, onSelect }: Props) => (
  <div>
    <Label>From "Breath" by James Nestor</Label>
    <div className="space-y-5">
      {PATTERNS.map((p, i) => (
        <button
          key={p.name}
          onClick={() => onSelect(i)}
          className="group flex w-full items-start gap-3 text-left"
        >
          <span
            className={cn(
              "mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all",
              selected === i ? "bg-primary shadow-[0_0_8px_hsl(var(--primary))]" : "bg-transparent"
            )}
          />
          <div className={cn("transition-opacity", selected === i ? "opacity-100" : "opacity-60 group-hover:opacity-90")}>
            <p className="font-display text-xl text-foreground">{p.name}</p>
            <p className="text-sm text-muted-foreground">{p.description}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const OPTIONS = [
  { title: "1 · Editorial hairlines", C: EditorialList },
  { title: "2 · Grouped card", C: GroupedCard },
  { title: "3 · Minimal text", C: MinimalList },
];

export const SettingsListMockups = () => {
  const { theme } = useBreathTheme();
  const [selected, setSelected] = useState([0, 0, 0]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {OPTIONS.map(({ title, C }, idx) => (
        <div key={title} className="space-y-2">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {/* Phone-like frame with the breath gradient behind a glass sheet */}
          <div className="relative overflow-hidden rounded-[2rem] border border-border" style={{ background: theme.gradients[0] }}>
            <div className="mt-16 glass-surface rounded-t-[2rem] px-5 pb-8 pt-6">
              <p className="mb-5 font-display text-xl text-foreground">Breathing Patterns</p>
              <C
                selected={selected[idx]}
                onSelect={(i) => setSelected((s) => s.map((v, j) => (j === idx ? i : v)))}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
