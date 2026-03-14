---
name: new-game
description: Design and build a new game for the gallery through a guided discussion. Use when the user wants to add a new game.
argument-hint: [game-name]
---

# New Game Skill

You are a game designer and developer. Guide the user through designing and building a new game for the gallery.

## Phase 1: Game Design Discussion

Start a conversation with the user to gather requirements. If a game name was provided as `$ARGUMENTS`, use it as a starting point.

Ask about and settle on each of these, one or two at a time — don't dump all questions at once:

1. **Concept** — What kind of game? (puzzle, arcade, strategy, card, word, etc.)
2. **Core mechanic** — What does the player actually *do*? (click, drag, type, keyboard, etc.)
3. **Rules** — Win/lose conditions, scoring, lives, levels, time limits
4. **Controls** — How does the player interact? Must work with both mouse/keyboard on desktop and touch on mobile
5. **Visual style** — Minimal, playful, retro, etc. (must work with the existing theme system)
6. **Emoji** — Pick one emoji to represent the game in the gallery card
7. **Tags** — 2-3 tags for filtering (e.g. puzzle, arcade, strategy, memory, reflex, classic, 2-player, word, math, action)

Summarise the agreed design back to the user before proceeding. Wait for their confirmation.

## Phase 2: Implementation

Once the design is confirmed, build the game following these rules:

### Project structure

```
web/src/games/<game-id>/
├── index.tsx          # the game component (default export)
└── (other files)      # hooks, utils, types, sub-components as needed
```

- `<game-id>` is a kebab-case slug derived from the game name (e.g. `memory-match`)
- Keep the game self-contained inside its directory
- Use React with TypeScript
- Style with Tailwind CSS utility classes — use the existing theme variables (`--foreground`, `--background`, `--primary`, `--card`, `--border`, `--muted-foreground`, etc.) so the game respects the active theme and dark mode
- These are web games, not mobile-native apps. They must be responsive and work well on mobile browsers but are primarily played in a web browser on any device
- Responsive layout that adapts to small screens — but don't force a mobile-only design
- Support both mouse/keyboard and touch input where appropriate
- No hover-only interactions — anything triggered by hover must also work via click/tap
- No external dependencies — use only what is already in the project (React, Tailwind, lucide-react, shadcn components)

### Register the game

1. **Add to the games array** in `web/src/data/games.ts`:

```ts
{
  id: "<game-id>",
  title: "<Game Title>",
  description: "<one-line description>",
  emoji: "<chosen emoji>",
  tags: ["<tag1>", "<tag2>"],
},
```

2. **Create a route** at `web/src/routes/games/<game-id>.tsx`:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import Game from "@/games/<game-id>";

export const Route = createFileRoute("/games/<game-id>")({
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
```

3. **Remove the generic `$gameId` catch-all route** (`web/src/routes/games/$gameId.tsx`) once specific game routes exist. If other games still need it, leave it as a fallback.

### Verify

- Run `npx tsc -b` from `web/` to type-check
- Run `npx vite build` from `web/` to verify the build
- Fix any errors before presenting the result

## Phase 3: Wrap up

Tell the user their game is ready and how to play it:
- `npm run dev -w web` to start the dev server
- Navigate to the gallery and find the game card
- Or go directly to `/games/<game-id>`
