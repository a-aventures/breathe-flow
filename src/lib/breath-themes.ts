import washedBlue from "@/assets/watercolor-washes/washed-blue.jpg";
import seaGlass from "@/assets/watercolor-washes/sea-glass.jpg";
import heather from "@/assets/watercolor-washes/heather.jpg";
import rosePigment from "@/assets/watercolor-washes/rose-pigment.jpg";
import ochre from "@/assets/watercolor-washes/ochre.jpg";
import sage from "@/assets/watercolor-washes/sage.jpg";

/**
 * BREATH GRADIENTS — the full-screen breathing colors.
 * Each theme has 6 gradients (top color -> bottom color) used in rotation.
 * Edit the hsl(hue, saturation%, lightness%) values to adjust a theme globally.
 * Keep lightness ~50-90% and saturation ~15-35% for a soft, refined look.
 */
export interface BreathTheme {
  id: string;
  name: string;
  description: string;
  gradients: string[];
  gradientNames: string[];
  texture?: "watercolor";
  washImages?: string[];
}

export const BREATH_THEMES: BreathTheme[] = [
  {
    id: "watercolor-paper",
    name: "Watercolor Paper",
    description: "Soft washes with the texture of pigment on paper.",
    texture: "watercolor",
    washImages: [washedBlue, seaGlass, heather, rosePigment, ochre, sage],
    gradients: [
      "linear-gradient(160deg, hsl(204, 28%, 57%) 0%, hsl(213, 27%, 39%) 100%)",
      "linear-gradient(160deg, hsl(174, 25%, 55%) 0%, hsl(185, 24%, 38%) 100%)",
      "linear-gradient(160deg, hsl(268, 23%, 58%) 0%, hsl(278, 22%, 40%) 100%)",
      "linear-gradient(160deg, hsl(341, 26%, 59%) 0%, hsl(350, 25%, 41%) 100%)",
      "linear-gradient(160deg, hsl(32, 29%, 58%) 0%, hsl(20, 27%, 39%) 100%)",
      "linear-gradient(160deg, hsl(144, 23%, 54%) 0%, hsl(155, 23%, 37%) 100%)",
    ],
    gradientNames: ["Washed blue", "Sea glass", "Heather", "Rose pigment", "Ochre", "Sage"],
  },
  {
    id: "nordic-mineral",
    name: "Nordic Mineral",
    description: "Muted stone and sea-glass tones. Calm and refined.",
    gradients: [
      "linear-gradient(160deg, hsl(205, 22%, 48%) 0%, hsl(212, 22%, 33%) 100%)",
      "linear-gradient(160deg, hsl(170, 20%, 46%) 0%, hsl(182, 20%, 31%) 100%)",
      "linear-gradient(160deg, hsl(258, 18%, 49%) 0%, hsl(272, 18%, 34%) 100%)",
      "linear-gradient(160deg, hsl(340, 18%, 49%) 0%, hsl(348, 18%, 34%) 100%)",
      "linear-gradient(160deg, hsl(28, 22%, 48%) 0%, hsl(18, 20%, 33%) 100%)",
      "linear-gradient(160deg, hsl(140, 16%, 46%) 0%, hsl(152, 16%, 31%) 100%)",
    ],
    gradientNames: ["Slate blue", "Sea glass", "Smoky lavender", "Dusty oyster", "Warm clay", "Soft sage"],
  },
  {
    id: "ethereal-mist",
    name: "Ethereal Mist",
    description: "Airy dawn pastels. Light, open and spacious.",
    gradients: [
      "linear-gradient(160deg, hsl(203, 34%, 88%) 0%, hsl(210, 28%, 74%) 100%)",
      "linear-gradient(160deg, hsl(165, 30%, 88%) 0%, hsl(175, 25%, 73%) 100%)",
      "linear-gradient(160deg, hsl(262, 30%, 89%) 0%, hsl(272, 24%, 75%) 100%)",
      "linear-gradient(160deg, hsl(344, 34%, 90%) 0%, hsl(352, 26%, 76%) 100%)",
      "linear-gradient(160deg, hsl(30, 40%, 90%) 0%, hsl(20, 30%, 76%) 100%)",
      "linear-gradient(160deg, hsl(140, 26%, 88%) 0%, hsl(150, 22%, 74%) 100%)",
    ],
    gradientNames: ["Pale sky", "Morning sage", "Airy lilac", "Peach blush", "Warm alabaster", "Mist green"],
  },
  {
    id: "soft-dusk",
    name: "Soft Dusk",
    description: "Evening calm with the shadows lifted. Gentle at night.",
    gradients: [
      "linear-gradient(160deg, hsl(212, 30%, 56%) 0%, hsl(222, 26%, 42%) 100%)",
      "linear-gradient(160deg, hsl(172, 26%, 54%) 0%, hsl(186, 24%, 40%) 100%)",
      "linear-gradient(160deg, hsl(264, 26%, 58%) 0%, hsl(276, 22%, 43%) 100%)",
      "linear-gradient(160deg, hsl(338, 26%, 58%) 0%, hsl(330, 22%, 43%) 100%)",
      "linear-gradient(160deg, hsl(26, 32%, 58%) 0%, hsl(14, 26%, 43%) 100%)",
      "linear-gradient(160deg, hsl(146, 22%, 54%) 0%, hsl(158, 20%, 40%) 100%)",
    ],
    gradientNames: ["Indigo mist", "Quiet pine", "Twilight heather", "Dusk plum", "Muted amber", "Deep fern"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "The original bold, saturated palette.",
    gradients: [
      "linear-gradient(160deg, hsl(200, 60%, 55%) 0%, hsl(220, 50%, 35%) 100%)",
      "linear-gradient(160deg, hsl(165, 55%, 50%) 0%, hsl(185, 45%, 30%) 100%)",
      "linear-gradient(160deg, hsl(270, 45%, 60%) 0%, hsl(290, 35%, 35%) 100%)",
      "linear-gradient(160deg, hsl(345, 50%, 60%) 0%, hsl(320, 40%, 35%) 100%)",
      "linear-gradient(160deg, hsl(25, 60%, 60%) 0%, hsl(10, 50%, 35%) 100%)",
      "linear-gradient(160deg, hsl(145, 45%, 50%) 0%, hsl(160, 35%, 28%) 100%)",
    ],
    gradientNames: ["Ocean depths", "Teal waters", "Lavender dusk", "Soft rose", "Warm sunset", "Forest depths"],
  },
];

export const DEFAULT_THEME_ID = "watercolor-paper";

export const getTheme = (id: string): BreathTheme =>
  BREATH_THEMES.find((t) => t.id === id) ?? BREATH_THEMES.find((t) => t.id === DEFAULT_THEME_ID) ?? BREATH_THEMES[0];
