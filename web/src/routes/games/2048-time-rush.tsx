import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Game from "@/games/2048-time-rush";

export const Route = createFileRoute("/games/2048-time-rush")({
  component: GamePage,
});

function GamePage() {
  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden">
      <div className="shrink-0 px-3 pt-3 sm:px-6 sm:pt-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Gallery
          </Link>
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6">
        <Game />
      </div>
    </div>
  );
}
