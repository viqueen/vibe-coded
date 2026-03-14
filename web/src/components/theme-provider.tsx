import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ColorTheme = "burgundy" | "sage" | "ocean" | "amethyst";
export type Mode = "light" | "dark" | "system";

interface ThemeContextValue {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "game-gallery-theme";
const MODE_KEY = "game-gallery-mode";

function applyMode(mode: Mode) {
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const isDark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem(THEME_KEY) as ColorTheme) || "burgundy";
  });
  const [mode, setModeState] = useState<Mode>(() => {
    return (localStorage.getItem(MODE_KEY) as Mode) || "system";
  });

  const setColorTheme = useCallback((theme: ColorTheme) => {
    localStorage.setItem(THEME_KEY, theme);
    setColorThemeState(theme);
  }, []);

  const setMode = useCallback((m: Mode) => {
    localStorage.setItem(MODE_KEY, m);
    setModeState(m);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    applyMode(mode);
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyMode("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  return (
    <ThemeContext value={{ colorTheme, mode, setColorTheme, setMode }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
