import { useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame, type Direction } from "./use-game";

const TILE_COLORS: Record<number, string> = {
  2: "bg-primary/10 text-foreground",
  4: "bg-primary/18 text-foreground",
  8: "bg-primary/28 text-foreground",
  16: "bg-primary/38 text-foreground",
  32: "bg-primary/48 text-foreground",
  64: "bg-primary/58 text-primary-foreground",
  128: "bg-primary/68 text-primary-foreground",
  256: "bg-primary/78 text-primary-foreground",
  512: "bg-primary/85 text-primary-foreground",
  1024: "bg-primary/92 text-primary-foreground",
  2048: "bg-primary text-primary-foreground",
};

function getTileClass(value: number): string {
  return TILE_COLORS[value] ?? "bg-primary text-primary-foreground";
}

function getTileFontSize(value: number): string {
  if (value >= 1024) return "text-lg sm:text-xl";
  if (value >= 128) return "text-xl sm:text-2xl";
  return "text-2xl sm:text-3xl";
}

const SWIPE_THRESHOLD = 30;

export default function Game() {
  const { state, startGame, move } = useGame();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const map: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  // Prevent page scroll while touching the game board
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    function preventScroll(e: TouchEvent) {
      e.preventDefault();
    }
    el.addEventListener("touchmove", preventScroll, { passive: false });
    return () => el.removeEventListener("touchmove", preventScroll);
  }, []);

  // Touch controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD)
        return;

      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? "right" : "left");
      } else {
        move(dy > 0 ? "down" : "up");
      }
    },
    [move],
  );

  const timePercent = (state.timeLeft / 60) * 100;
  const timeUrgent = state.timeLeft <= 10;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold sm:text-2xl">2048 Time Rush</h2>
          <p className="text-sm text-muted-foreground">
            Swipe or use arrow keys. Chain merges for combos!
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-4">
            <div>
              <span className="text-muted-foreground">Score </span>
              <span className="font-bold">{state.score}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Best </span>
              <span className="font-bold">{state.bestScore}</span>
            </div>
          </div>
          {state.lastCombo > 1 && state.status === "playing" && (
            <span className="font-bold text-primary">
              {state.lastCombo}x combo!
            </span>
          )}
        </div>

        {/* Timer bar */}
        {state.status === "playing" && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeUrgent ? "bg-destructive" : "bg-primary"
              }`}
              style={{ width: `${Math.min(timePercent, 100)}%` }}
            />
          </div>
        )}
        {state.status === "playing" && (
          <p
            className={`text-center text-sm font-medium ${timeUrgent ? "text-destructive" : "text-muted-foreground"}`}
          >
            {state.timeLeft}s
          </p>
        )}

        {/* Board */}
        <div
          ref={boardRef}
          className="relative aspect-square w-full select-none rounded-lg bg-muted p-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-1.5 sm:gap-2">
            {state.board.flat().map((value, i) => {
              const r = Math.floor(i / 4);
              const c = i % 4;
              const key = `${r}-${c}`;
              const isMerged = state.mergedCells.has(key);
              const isNew = state.newCells.has(key);
              return (
                <div
                  key={key}
                  className={`flex items-center justify-center rounded-md font-bold transition-all duration-150 ${
                    value !== null
                      ? `${getTileClass(value)} ${getTileFontSize(value)} ${
                          isMerged
                            ? "animate-[merge-pop_150ms_ease-out]"
                            : isNew
                              ? "animate-[pop_200ms_ease-out_forwards]"
                              : ""
                        }`
                      : "bg-muted-foreground/10"
                  }`}
                >
                  {value}
                </div>
              );
            })}
          </div>

          {/* Game over / idle overlay */}
          {state.status !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/80 backdrop-blur-sm">
              {state.status === "over" && (
                <>
                  <p className="text-xl font-bold">Game Over</p>
                  <p className="text-muted-foreground">
                    Final score:{" "}
                    <span className="font-bold text-foreground">
                      {state.score}
                    </span>
                  </p>
                </>
              )}
              <Button size="lg" onClick={startGame}>
                {state.status === "idle" ? "Start Game" : "Play Again"}
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Merge tiles to earn points &amp; extra time. Multiple merges in one
          swipe = combo multiplier!
        </p>
      </CardContent>
    </Card>
  );
}
