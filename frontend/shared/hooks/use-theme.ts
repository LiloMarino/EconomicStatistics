import { createContext, useContext } from "react";

export const themes = ["light", "dark"] as const;

export type Theme = (typeof themes)[number];

export function isTheme(value: string): value is Theme {
  return themes.some((theme) => theme === value);
}

export interface ThemeState {
  /** O app não segue o tema do sistema, então o escolhido é o que está na tela. */
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeState | null>(null);

export function useTheme(): ThemeState {
  const state = useContext(ThemeContext);
  if (!state) throw new Error("useTheme fora do ThemeProvider");
  return state;
}
