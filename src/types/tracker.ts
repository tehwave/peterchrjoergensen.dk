export type TaskType = "short" | "medium" | "long";

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  createdAt: number;
  dueDate: string | null;
  completedAt: number | null;
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
  version: number;
}
