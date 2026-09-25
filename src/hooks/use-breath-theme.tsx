import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { BREATH_THEMES, DEFAULT_THEME_ID, getTheme, BreathTheme } from "@/lib/breath-themes";

const STORAGE_KEY = "breath-theme";

interface BreathThemeContextValue {
  themeId: string;
  theme: BreathTheme;
  themes: BreathTheme[];
  setThemeId: (id: string) => void;
}

const BreathThemeContext = createContext<BreathThemeContextValue | undefined>(undefined);

export const BreathThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeId, setThemeIdState] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME_ID;
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  const value: BreathThemeContextValue = {
    themeId,
    theme: getTheme(themeId),
    themes: BREATH_THEMES,
    setThemeId: setThemeIdState,
  };

  return <BreathThemeContext.Provider value={value}>{children}</BreathThemeContext.Provider>;
};

export const useBreathTheme = (): BreathThemeContextValue => {
  const ctx = useContext(BreathThemeContext);
  if (!ctx) {
    // Fallback so components can render outside the provider
    return {
      themeId: DEFAULT_THEME_ID,
      theme: getTheme(DEFAULT_THEME_ID),
      themes: BREATH_THEMES,
      setThemeId: () => {},
    };
  }
  return ctx;
};
