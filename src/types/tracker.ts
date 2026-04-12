export type TaskType = "short" | "medium" | "long";
export type DecayLevel = "fresh" | "stale" | "rotten";

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  createdAt: number;
  dueDate: string | null;
  completedAt: number | null;
  archivedAt: number | null;
  order: number;
}

export type CompletedTask = Task & { completedAt: number };

export interface GameState {
  level: number;
  xp: number;
  totalXP: number;
  completedThisMonth: number;
  completedThisYear: number;
  streak: number;
  lastActivityDate: string;
  monthKey: string;
  yearKey: string;
}

export interface AppState {
  tasks: Task[];
  game: GameState;
}

export const XP_VALUES: Record<TaskType, number> = {
  short: 10,
  medium: 25,
  long: 50,
};

export const DECAY_THRESHOLDS: Record<TaskType, { stale: number; rotten: number }> = {
  short: { stale: 3 * 86400000, rotten: 5 * 86400000 },
  medium: { stale: 14 * 86400000, rotten: 21 * 86400000 },
  long: { stale: 42 * 86400000, rotten: 63 * 86400000 },
};
