import type { ReactNode } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-svh bg-sidebar text-sidebar-foreground">
      <header className="sticky top-0 z-30 h-14 border-b border-sidebar-border bg-sidebar">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <h1 className="text-lg font-semibold tracking-tight">Game Gallery</h1>
          <ThemeSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
