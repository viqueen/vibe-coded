import { createRootRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";

function RootComponent() {
  const matchRoute = useMatchRoute();
  const isGameRoute =
    matchRoute({ to: "/games/$gameId", fuzzy: true }) ||
    matchRoute({ to: "/games/2048-time-rush" });

  if (isGameRoute) {
    return <Outlet />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
