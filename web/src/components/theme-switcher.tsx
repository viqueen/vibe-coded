import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useTheme,
  type ColorTheme,
  type Mode,
} from "@/components/theme-provider";

const colorThemes: { value: ColorTheme; label: string; swatch: string }[] = [
  { value: "burgundy", label: "Burgundy", swatch: "oklch(.37 .14 15)" },
  { value: "sage", label: "Sage", swatch: "oklch(.44 .09 155)" },
  { value: "ocean", label: "Ocean", swatch: "oklch(.4 .12 250)" },
  { value: "amethyst", label: "Amethyst", swatch: "oklch(.42 .13 310)" },
];

const modes: { value: Mode; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

export function ThemeSwitcher() {
  const { colorTheme, mode, setColorTheme, setMode } = useTheme();

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1.5">
        {colorThemes.map((t) => (
          <button
            key={t.value}
            onClick={() => setColorTheme(t.value)}
            className="h-5 w-5 rounded-full transition-all duration-200"
            style={{
              backgroundColor: t.swatch,
              opacity: colorTheme === t.value ? 1 : 0.5,
              boxShadow:
                colorTheme === t.value
                  ? `0 0 0 2px var(--sidebar), 0 0 0 4px ${t.swatch}`
                  : "none",
            }}
            aria-label={t.label}
            title={t.label}
          />
        ))}
      </div>

      <div className="mx-1.5 h-4 w-px bg-sidebar-border" />

      <div className="flex items-center">
        {modes.map((m) => (
          <Button
            key={m.value}
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${mode === m.value ? "text-sidebar-foreground" : "text-sidebar-muted-foreground"}`}
            onClick={() => setMode(m.value)}
            aria-label={m.label}
            title={m.label}
          >
            <m.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  );
}
