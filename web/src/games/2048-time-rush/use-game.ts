import { useCallback, useEffect, useReducer, useRef } from "react";

export type CellValue = number | null;
export type Board = CellValue[][];
export type Direction = "up" | "down" | "left" | "right";

interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  timeLeft: number;
  combo: number;
  lastCombo: number;
  status: "idle" | "playing" | "over";
  mergedCells: Set<string>;
  newCells: Set<string>;
}

type Action =
  | { type: "START" }
  | { type: "MOVE"; direction: Direction }
  | { type: "TICK" };

const SIZE = 4;
const INITIAL_TIME = 60;
const BEST_SCORE_KEY = "2048-time-rush-best";

function createEmptyBoard(): Board {
  return Array.from(
    { length: SIZE },
    () => Array(SIZE).fill(null) as CellValue[],
  );
}

function getEmptyCells(board: Board): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === null) cells.push([r, c]);
    }
  }
  return cells;
}

function spawnTile(board: Board): Board {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = board.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function rotateBoard(board: Board, times: number): Board {
  let b = board;
  for (let t = 0; t < times; t++) {
    const rotated = createEmptyBoard();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        rotated[c][SIZE - 1 - r] = b[r][c];
      }
    }
    b = rotated;
  }
  return b;
}

function slideLeft(board: Board): {
  board: Board;
  scoreGained: number;
  mergeCount: number;
  merged: Set<string>;
} {
  const next = createEmptyBoard();
  let scoreGained = 0;
  let mergeCount = 0;
  const merged = new Set<string>();

  for (let r = 0; r < SIZE; r++) {
    const row = board[r].filter((v) => v !== null) as number[];
    const result: number[] = [];
    let i = 0;
    while (i < row.length) {
      if (i + 1 < row.length && row[i] === row[i + 1]) {
        const val = row[i] * 2;
        result.push(val);
        scoreGained += val;
        mergeCount++;
        merged.add(`${r}-${result.length - 1}`);
        i += 2;
      } else {
        result.push(row[i]);
        i++;
      }
    }
    for (let c = 0; c < result.length; c++) {
      next[r][c] = result[c];
    }
  }
  return { board: next, scoreGained, mergeCount, merged };
}

function moveBoard(
  board: Board,
  direction: Direction,
): {
  board: Board;
  scoreGained: number;
  mergeCount: number;
  merged: Set<string>;
} {
  const rotations: Record<Direction, number> = {
    left: 0,
    down: 1,
    right: 2,
    up: 3,
  };
  const reverseRotations: Record<Direction, number> = {
    left: 0,
    down: 3,
    right: 2,
    up: 1,
  };

  const rotated = rotateBoard(board, rotations[direction]);
  const result = slideLeft(rotated);
  const finalBoard = rotateBoard(result.board, reverseRotations[direction]);

  // Remap merged coordinates back
  const remapped = new Set<string>();
  for (const key of result.merged) {
    const [r, c] = key.split("-").map(Number);
    let nr = r,
      nc = c;
    for (let t = 0; t < reverseRotations[direction]; t++) {
      const tmp = nr;
      nr = nc;
      nc = SIZE - 1 - tmp;
    }
    remapped.add(`${nr}-${nc}`);
  }

  return {
    board: finalBoard,
    scoreGained: result.scoreGained,
    mergeCount: result.mergeCount,
    merged: remapped,
  };
}

function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function hasMovesLeft(board: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === null) return true;
      if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return true;
      if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

function calcTimeBonus(mergeCount: number, scoreGained: number): number {
  if (mergeCount === 0) return 0;
  // Base: 1s per merge + bonus for high-value merges
  return mergeCount + Math.floor(scoreGained / 64);
}

function loadBestScore(): number {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBestScore(score: number) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // ignore
  }
}

function initialState(): GameState {
  return {
    board: createEmptyBoard(),
    score: 0,
    bestScore: loadBestScore(),
    timeLeft: INITIAL_TIME,
    combo: 0,
    lastCombo: 0,
    status: "idle",
    mergedCells: new Set(),
    newCells: new Set(),
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "START": {
      const board = spawnTile(spawnTile(createEmptyBoard()));
      const newCells = new Set<string>();
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c] !== null) newCells.add(`${r}-${c}`);
        }
      }
      return {
        ...initialState(),
        board,
        bestScore: state.bestScore,
        status: "playing",
        newCells,
      };
    }
    case "MOVE": {
      if (state.status !== "playing") return state;

      const { board, scoreGained, mergeCount, merged } = moveBoard(
        state.board,
        action.direction,
      );

      if (boardsEqual(state.board, board)) return state;

      const withSpawn = spawnTile(board);

      // Find the newly spawned cell
      const spawnedCells = new Set<string>();
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c] === null && withSpawn[r][c] !== null) {
            spawnedCells.add(`${r}-${c}`);
          }
        }
      }

      const combo = mergeCount > 1 ? mergeCount : 0;
      const comboMultiplier = combo > 0 ? combo : 1;
      const points = scoreGained * comboMultiplier;
      const timeBonus = calcTimeBonus(mergeCount, scoreGained);
      const newScore = state.score + points;
      const newBest = Math.max(state.bestScore, newScore);

      if (newBest > state.bestScore) saveBestScore(newBest);

      const gameOver = !hasMovesLeft(withSpawn);

      return {
        ...state,
        board: withSpawn,
        score: newScore,
        bestScore: newBest,
        timeLeft: gameOver ? state.timeLeft : state.timeLeft + timeBonus,
        combo,
        lastCombo: combo,
        status: gameOver ? "over" : "playing",
        mergedCells: merged,
        newCells: spawnedCells,
      };
    }
    case "TICK": {
      if (state.status !== "playing") return state;
      const newTime = state.timeLeft - 1;
      if (newTime <= 0) {
        return { ...state, timeLeft: 0, status: "over" };
      }
      return { ...state, timeLeft: newTime };
    }
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = useCallback(() => {
    dispatch({ type: "START" });
  }, []);

  const move = useCallback((direction: Direction) => {
    dispatch({ type: "MOVE", direction });
  }, []);

  // Timer
  useEffect(() => {
    if (state.status === "playing") {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status]);

  return { state, startGame, move };
}
