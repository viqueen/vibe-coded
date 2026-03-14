import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight">Game Gallery</h1>
          <ThemeSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  ),
});
