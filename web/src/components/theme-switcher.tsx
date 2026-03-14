import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useTheme,
  type ColorTheme,
  type Mode,
} from "@/components/theme-provider";
import { useState, useRef, useEffect } from "react";

const colorThemes: { value: ColorTheme; label: string; swatch: string }[] = [
  { value: "burgundy", label: "Burgundy", swatch: "oklch(.37 .14 15)" },
  { value: "sage", label: "Sage", swatch: "oklch(.44 .09 155)" },
  { value: "ocean", label: "Ocean", swatch: "oklch(.4 .12 250)" },
  { value: "amethyst", label: "Amethyst", swatch: "oklch(.42 .13 310)" },
];

const modes: { value: Mode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSwitcher() {
  const { colorTheme, mode, setColorTheme, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Theme settings"
      >
        <Palette className="h-5 w-5" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-popover p-3 shadow-lg z-50">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Color theme
          </p>
          <div className="flex gap-2 mb-3">
            {colorThemes.map((t) => (
              <button
                key={t.value}
                onClick={() => setColorTheme(t.value)}
                className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  colorTheme === t.value
                    ? "border-foreground scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: t.swatch }}
                aria-label={t.label}
                title={t.label}
              />
            ))}
          </div>

          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Mode
          </p>
          <div className="flex gap-1">
            {modes.map((m) => (
              <Button
                key={m.value}
                variant={mode === m.value ? "secondary" : "ghost"}
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => setMode(m.value)}
              >
                <m.icon className="h-3.5 w-3.5" />
                <span className="text-xs">{m.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
