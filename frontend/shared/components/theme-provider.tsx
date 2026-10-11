import { type ReactNode, useMemo, useState } from "react";

import { isTheme, type Theme, ThemeContext } from "@/shared/hooks/use-theme";

// A mesma chave que o index.html lê antes da primeira pintura
const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "dark";

function storedTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value !== null && isTheme(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/** Troca a classe do `<html>` com as transições desligadas por um quadro, para a tela
não animar cada cor ao mesmo tempo. */
function applyTheme(theme: Theme) {
  const pause = document.createElement("style");
  pause.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(pause);
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  window.getComputedStyle(document.body);
  setTimeout(() => pause.remove(), 1);
}

/** O tema da tela, guardado no navegador. O index.html já aplicou o tema salvo antes
de o React montar, então o estado só nasce dele. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState(storedTheme);

  const state = useMemo(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme: (value: string) => {
        if (!isTheme(value)) return;
        try {
          localStorage.setItem(STORAGE_KEY, value);
        } catch {
          // Sem armazenamento, o tema vale até recarregar
        }
        applyTheme(value);
        setThemeState(value);
      },
    }),
    [theme],
  );

  return <ThemeContext value={state}>{children}</ThemeContext>;
}
