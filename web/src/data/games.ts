import { type LucideIcon, Grid2x2 } from "lucide-react";

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
}

export const games: Game[] = [
  {
    id: "2048-time-rush",
    title: "2048 Time Rush",
    description:
      "Slide and merge tiles against the clock. Chain combos for bonus points and extra time.",
    icon: Grid2x2,
    tags: ["puzzle", "classic", "strategy"],
  },
];

export const allTags = Array.from(new Set(games.flatMap((g) => g.tags))).sort();
