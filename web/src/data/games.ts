export interface Game {
  id: string;
  title: string;
  description: string;
  emoji: string;
  tags: string[];
}

export const games: Game[] = [
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Flip cards and find matching pairs before time runs out",
    emoji: "🃏",
    tags: ["puzzle", "memory"],
  },
  {
    id: "snake",
    title: "Snake",
    description: "Guide the snake to eat food and grow without hitting walls",
    emoji: "🐍",
    tags: ["arcade", "classic"],
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic X and O game — play against a friend",
    emoji: "❌",
    tags: ["strategy", "2-player"],
  },
  {
    id: "breakout",
    title: "Breakout",
    description: "Smash bricks with a bouncing ball and paddle",
    emoji: "🧱",
    tags: ["arcade", "action"],
  },
  {
    id: "2048",
    title: "2048",
    description: "Slide tiles and combine numbers to reach 2048",
    emoji: "🔢",
    tags: ["puzzle", "math"],
  },
  {
    id: "whack-a-mole",
    title: "Whack-a-Mole",
    description: "Tap the moles as fast as you can before they hide",
    emoji: "🔨",
    tags: ["arcade", "reflex"],
  },
  {
    id: "word-guess",
    title: "Word Guess",
    description: "Guess the five-letter word in six attempts",
    emoji: "📝",
    tags: ["word", "puzzle"],
  },
  {
    id: "block-drop",
    title: "Block Drop",
    description: "Stack falling blocks and clear complete rows",
    emoji: "🟦",
    tags: ["arcade", "classic"],
  },
  {
    id: "simon-says",
    title: "Simon Says",
    description: "Repeat the growing sequence of colors and sounds",
    emoji: "🎵",
    tags: ["memory", "reflex"],
  },
];

export const allTags = Array.from(
  new Set(games.flatMap((g) => g.tags)),
).sort();
