# @labset/vibe-coded

A curated gallery of browser games, built with modern React and designed with care. Each game is crafted through AI-assisted development using [Claude Code](https://claude.com/claude-code) — exploring what's possible when taste meets tooling.

## Tech stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Routing | TanStack Router |
| Styling | Tailwind CSS 4 |
| UI | shadcn components + lucide-react icons |
| Build | Vite 8 |
| Font | DM Sans |

## Getting started

```bash
npm install
npm run dev -w web
```

Open [http://localhost:5173](http://localhost:5173) to view the gallery.

## Project structure

```
web/src/
├── routes/             # file-based routing (TanStack Router)
│   ├── __root.tsx      # app shell — header, theme switcher, layout
│   ├── index.tsx       # gallery grid
│   └── games/          # one route per game
├── games/              # game implementations
│   └── <game-id>/      # self-contained game module
│       ├── index.tsx    # React component (default export)
│       └── ...          # hooks, utils, sub-components
├── data/
│   └── games.ts        # game registry
├── components/
│   ├── app-layout.tsx   # sticky header + content area
│   ├── theme-provider.tsx
│   ├── theme-switcher.tsx
│   └── ui/             # shadcn primitives
└── index.css           # theme definitions (4 palettes x light/dark)
```

## Themes

Four color themes — **Burgundy**, **Sage**, **Ocean**, **Amethyst** — each with light and dark mode. All defined in OKLCh color space and exposed as CSS custom properties so every game automatically adapts.

## Games

| Game | Description |
|---|---|
| **2048 Time Rush** | Classic 4x4 sliding puzzle with a countdown timer. Merge tiles to earn points and extra seconds. Chain merges for combo multipliers. |

## Adding a game

Games are added through the `/new-game` Claude Code skill, which walks through design and implementation:

```
/new-game <game-name>
```

Each game lives in `web/src/games/<game-id>/` and must:

- Use only existing project dependencies
- Respect the active theme via CSS variables
- Support both keyboard and touch input
- Work responsively across screen sizes

## Scripts

```bash
npm run dev -w web        # start dev server
npm run build             # type-check + production build
npm run lint              # eslint
npm run format            # prettier
```

## License

Apache-2.0
