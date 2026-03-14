import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { games } from "@/data/games";

export const Route = createFileRoute("/")({
  component: GalleryPage,
});

function GalleryPage() {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-center">
        <p className="text-lg font-medium text-foreground">No games yet</p>
        <p className="text-sm text-muted-foreground">
          Games will appear here as they are built
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <Link
          key={game.id}
          to="/games/$gameId"
          params={{ gameId: game.id }}
          className="group outline-none"
        >
          <Card className="h-full transition-shadow hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring">
            <CardContent className="flex flex-col gap-3 p-5">
              <game.icon
                className="h-10 w-10 text-primary"
                aria-label={game.title}
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold leading-tight">
                  {game.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {game.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {game.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
