export interface BreathTheme {
  id: string;
  name: string;
  description: string;
  gradients: string[];
  gradientNames: string[];
}

export const BREATH_THEMES: BreathTheme[] = [
  {
    id: "nordic-mineral",
    name: "Nordic Mineral",
    description: "Muted stone and sea-glass tones. Calm and refined.",
    gradients: [
      "linear-gradient(180deg, hsl(205, 24%, 68%) 0%, hsl(212, 22%, 52%) 100%)",
      "linear-gradient(180deg, hsl(170, 22%, 68%) 0%, hsl(182, 20%, 52%) 100%)",
      "linear-gradient(180deg, hsl(258, 20%, 70%) 0%, hsl(272, 18%, 54%) 100%)",
      "linear-gradient(180deg, hsl(340, 20%, 72%) 0%, hsl(348, 18%, 56%) 100%)",
      "linear-gradient(180deg, hsl(28, 26%, 72%) 0%, hsl(18, 22%, 56%) 100%)",
      "linear-gradient(180deg, hsl(140, 18%, 68%) 0%, hsl(152, 17%, 52%) 100%)",
    ],
    gradientNames: ["Slate blue", "Sea glass", "Smoky lavender", "Dusty oyster", "Warm clay", "Soft sage"],
  },
  {
    id: "ethereal-mist",
    name: "Ethereal Mist",
    description: "Airy dawn pastels. Light, open and spacious.",
    gradients: [
      "linear-gradient(180deg, hsl(203, 34%, 88%) 0%, hsl(210, 28%, 74%) 100%)",
      "linear-gradient(180deg, hsl(165, 30%, 88%) 0%, hsl(175, 25%, 73%) 100%)",
      "linear-gradient(180deg, hsl(262, 30%, 89%) 0%, hsl(272, 24%, 75%) 100%)",
      "linear-gradient(180deg, hsl(344, 34%, 90%) 0%, hsl(352, 26%, 76%) 100%)",
      "linear-gradient(180deg, hsl(30, 40%, 90%) 0%, hsl(20, 30%, 76%) 100%)",
      "linear-gradient(180deg, hsl(140, 26%, 88%) 0%, hsl(150, 22%, 74%) 100%)",
    ],
    gradientNames: ["Pale sky", "Morning sage", "Airy lilac", "Peach blush", "Warm alabaster", "Mist green"],
  },
  {
    id: "soft-dusk",
    name: "Soft Dusk",
    description: "Evening calm with the shadows lifted. Gentle at night.",
    gradients: [
      "linear-gradient(180deg, hsl(212, 30%, 56%) 0%, hsl(222, 26%, 42%) 100%)",
      "linear-gradient(180deg, hsl(172, 26%, 54%) 0%, hsl(186, 24%, 40%) 100%)",
      "linear-gradient(180deg, hsl(264, 26%, 58%) 0%, hsl(276, 22%, 43%) 100%)",
      "linear-gradient(180deg, hsl(338, 26%, 58%) 0%, hsl(330, 22%, 43%) 100%)",
      "linear-gradient(180deg, hsl(26, 32%, 58%) 0%, hsl(14, 26%, 43%) 100%)",
      "linear-gradient(180deg, hsl(146, 22%, 54%) 0%, hsl(158, 20%, 40%) 100%)",
    ],
    gradientNames: ["Indigo mist", "Quiet pine", "Twilight heather", "Dusk plum", "Muted amber", "Deep fern"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "The original bold, saturated palette.",
    gradients: [
      "linear-gradient(180deg, hsl(200, 60%, 55%) 0%, hsl(220, 50%, 35%) 100%)",
      "linear-gradient(180deg, hsl(165, 55%, 50%) 0%, hsl(185, 45%, 30%) 100%)",
      "linear-gradient(180deg, hsl(270, 45%, 60%) 0%, hsl(290, 35%, 35%) 100%)",
      "linear-gradient(180deg, hsl(345, 50%, 60%) 0%, hsl(320, 40%, 35%) 100%)",
      "linear-gradient(180deg, hsl(25, 60%, 60%) 0%, hsl(10, 50%, 35%) 100%)",
      "linear-gradient(180deg, hsl(145, 45%, 50%) 0%, hsl(160, 35%, 28%) 100%)",
    ],
    gradientNames: ["Ocean depths", "Teal waters", "Lavender dusk", "Soft rose", "Warm sunset", "Forest depths"],
  },
];

export const DEFAULT_THEME_ID = "nordic-mineral";

export const getTheme = (id: string): BreathTheme =>
  BREATH_THEMES.find((t) => t.id === id) ?? BREATH_THEMES[0];
