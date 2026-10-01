export interface FontPair {
  id: string;
  name: string;
  description: string;
  displayFontName: string; // human name for headings
  bodyFontName: string;    // human name for body
  displayFont: string;     // CSS font-family for headings
  bodyFont: string;        // CSS font-family for body
  displayWeight: string;   // heading thickness that suits this pairing
}

export const DEFAULT_FONT_PAIR_ID = "cormorant-karla";

export const FONT_PAIRS: FontPair[] = [
  {
    id: "default",
    name: "Inter (current)",
    description: "The neutral sans-serif used today. Clean and invisible, but generic.",
    displayFontName: "Inter",
    bodyFontName: "Inter",
    displayFont: "'Inter', system-ui, sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    displayWeight: "300",
  },
  {
    id: "cormorant-karla",
    name: "Cormorant + Karla",
    description: "Elegant high-contrast serif headings with a clean, friendly body font. Luxury-spa, editorial calm.",
    displayFontName: "Cormorant Garamond",
    bodyFontName: "Karla",
    displayFont: "'Cormorant Garamond', serif",
    bodyFont: "'Karla', sans-serif",
    displayWeight: "400",
  },
  {
    id: "instrument-work",
    name: "Instrument Serif + Work Sans",
    description: "Sharp, stylish serif headings with a neutral geometric body. Reads like a premium print publication.",
    displayFontName: "Instrument Serif",
    bodyFontName: "Work Sans",
    displayFont: "'Instrument Serif', serif",
    bodyFont: "'Work Sans', sans-serif",
    displayWeight: "400",
  },
  {
    id: "dmserif-fira",
    name: "DM Serif Display + Fira Sans",
    description: "Warm, rounded display serif with a humanist body font. Soft, inviting, slightly traditional.",
    displayFontName: "DM Serif Display",
    bodyFontName: "Fira Sans",
    displayFont: "'DM Serif Display', serif",
    bodyFont: "'Fira Sans', sans-serif",
    displayWeight: "400",
  },
  {
    id: "lora-nunito",
    name: "Lora + Nunito Sans",
    description: "Literary and gentle — book-like serif headings with a soft rounded body. The subtlest option.",
    displayFontName: "Lora",
    bodyFontName: "Nunito Sans",
    displayFont: "'Lora', serif",
    bodyFont: "'Nunito Sans', sans-serif",
    displayWeight: "400",
  },
];

export const getFontPair = (id: string): FontPair =>
  FONT_PAIRS.find((p) => p.id === id) ?? FONT_PAIRS[0];
