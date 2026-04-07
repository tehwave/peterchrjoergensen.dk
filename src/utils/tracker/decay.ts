import { DECAY_THRESHOLDS, type DecayLevel, type Task } from "../../types/tracker";

export function getTaskDecayLevel(task: Task): DecayLevel {
  if (task.completedAt) return "fresh";

  const age = Date.now() - task.createdAt;
  const thresholds = DECAY_THRESHOLDS[task.type];

  if (age >= thresholds.rotten) return "rotten";
  if (age >= thresholds.stale) return "stale";

  return "fresh";
}

export function getTaskDecayProgress(task: Task): number {
  if (task.completedAt) return 0;

  const age = Date.now() - task.createdAt;
  const thresholds = DECAY_THRESHOLDS[task.type];

  return Math.min(100, (age / thresholds.rotten) * 100);
}
