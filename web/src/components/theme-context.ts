import { createContext } from "react";
import type { ColorTheme, Mode } from "./theme-provider";

interface ThemeContextValue {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
