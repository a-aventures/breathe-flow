import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { FONT_PAIRS, DEFAULT_FONT_PAIR_ID, getFontPair, FontPair } from "@/lib/typography";

const STORAGE_KEY = "font-pair";

interface FontPairContextValue {
  fontPairId: string;
  fontPair: FontPair;
  fontPairs: FontPair[];
  setFontPairId: (id: string) => void;
}

const FontPairContext = createContext<FontPairContextValue | undefined>(undefined);

export const FontPairProvider = ({ children }: { children: ReactNode }) => {
  const [fontPairId, setPairIdState] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_FONT_PAIR_ID;
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_FONT_PAIR_ID;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, fontPairId);
  }, [fontPairId]);

  useEffect(() => {
    const pair = getFontPair(fontPairId);
    const root = document.documentElement;
    if (pair.id === "default") {
      root.style.removeProperty("--font-display");
      root.style.removeProperty("--font-sans");
      root.style.removeProperty("--font-weight-display");
    } else {
      root.style.setProperty("--font-display", pair.displayFont);
      root.style.setProperty("--font-sans", pair.bodyFont);
      root.style.setProperty("--font-weight-display", pair.displayWeight);
    }
  }, [fontPairId]);

  const value: FontPairContextValue = {
    fontPairId,
    fontPair: getFontPair(fontPairId),
    fontPairs: FONT_PAIRS,
    setFontPairId: setPairIdState,
  };

  return <FontPairContext.Provider value={value}>{children}</FontPairContext.Provider>;
};

export const useFontPair = (): FontPairContextValue => {
  const ctx = useContext(FontPairContext);
  if (!ctx) {
    return {
      fontPairId: DEFAULT_FONT_PAIR_ID,
      fontPair: getFontPair(DEFAULT_FONT_PAIR_ID),
      fontPairs: FONT_PAIRS,
      setFontPairId: () => {},
    };
  }
  return ctx;
};
