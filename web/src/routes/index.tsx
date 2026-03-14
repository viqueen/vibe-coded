import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { games, allTags } from "@/data/games";

export const Route = createFileRoute("/")({
  component: GalleryPage,
});

function GalleryPage() {
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? games.filter((g) => g.tags.includes(filter))
    : games;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Pick a game
        </h2>
        <p className="mt-1 text-muted-foreground">
          Choose from the collection and start playing
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(null)}
        >
          All
        </Button>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={filter === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filter === tag ? null : tag)}
          >
            {tag}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((game) => (
          <Link
            key={game.id}
            to="/games/$gameId"
            params={{ gameId: game.id }}
            className="group outline-none"
          >
            <Card className="h-full transition-shadow hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring">
              <CardContent className="flex flex-col gap-3 p-5">
                <span className="text-4xl" role="img" aria-label={game.title}>
                  {game.emoji}
                </span>
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
    </div>
  );
}
