import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { games } from "@/data/games";

export const Route = createFileRoute("/games/$gameId")({
  component: GamePage,
});

function GamePage() {
  const { gameId } = Route.useParams();
  const game = games.find((g) => g.id === gameId);

  if (!game) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-lg text-muted-foreground">Game not found</p>
        <Button nativeButton={false} render={<Link to="/" />}>
          Back to gallery
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link to="/" />}
      >
        &larr; Back to gallery
      </Button>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <game.icon
            className="h-16 w-16 text-primary"
            aria-label={game.title}
          />
          <h2 className="text-2xl font-bold sm:text-3xl">{game.title}</h2>
          <p className="max-w-md text-muted-foreground">{game.description}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {game.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <Button size="lg" className="mt-4">
            Play now
          </Button>
          <p className="text-xs text-muted-foreground">Coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
