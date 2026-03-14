export interface Game {
  id: string;
  title: string;
  description: string;
  emoji: string;
  tags: string[];
}

export const games: Game[] = [];

export const allTags = Array.from(
  new Set(games.flatMap((g) => g.tags)),
).sort();
