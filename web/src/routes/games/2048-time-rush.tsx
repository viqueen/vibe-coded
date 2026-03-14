import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import Game from "@/games/2048-time-rush";

export const Route = createFileRoute("/games/2048-time-rush")({
  component: GamePage,
});

function GamePage() {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/">&larr; Back to gallery</Link>
      </Button>
      <Game />
    </div>
  );
}
