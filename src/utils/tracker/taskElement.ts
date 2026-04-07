export type TaskType = "short" | "medium" | "long";
export type DecayLevel = "fresh" | "stale" | "rotten";

interface TaskData {
  id: string;
  title: string;
  type: TaskType;
  createdAt: number;
  completedAt: number | null;
}

interface TaskRenderContext {
  getDraggedTaskId: () => string | null;
  setDraggedTaskId: (id: string | null) => void;
}

export class Task {
  private static readonly XP_VALUES: Record<TaskType, number> = {
    short: 10,
    medium: 25,
    long: 50,
  };

  private static readonly DECAY_THRESHOLDS: Record<TaskType, { stale: number; rotten: number }> = {
    short: { stale: 3 * 86400000, rotten: 5 * 86400000 },
    medium: { stale: 14 * 86400000, rotten: 21 * 86400000 },
    long: { stale: 42 * 86400000, rotten: 63 * 86400000 },
  };

  constructor(
    private readonly task: TaskData,
    private readonly context: TaskRenderContext,
  ) {}

  private getXp(): number {
    return Task.XP_VALUES[this.task.type];
  }

  private getDecayLevel(): DecayLevel {
    if (this.task.completedAt) return "fresh";
    const age = Date.now() - this.task.createdAt;
    const thresholds = Task.DECAY_THRESHOLDS[this.task.type];
    if (age >= thresholds.rotten) return "rotten";
    if (age >= thresholds.stale) return "stale";
    return "fresh";
  }

  private getDecayProgress(): number {
    if (this.task.completedAt) return 0;
    const age = Date.now() - this.task.createdAt;
    const thresholds = Task.DECAY_THRESHOLDS[this.task.type];
    return Math.min(100, (age / thresholds.rotten) * 100);
  }

  render(): HTMLElement {
    const { task, context } = this;
    const { getDraggedTaskId, setDraggedTaskId } = context;
    const decay = this.getDecayLevel();
    const decayPct = this.getDecayProgress();
    const xp = this.getXp();

    const el = document.createElement("div");
    el.className = `task-card task-card--${decay}`;
    el.setAttribute("role", "listitem");
    el.setAttribute("draggable", "true");
    el.dataset.id = task.id;

    const title = document.createElement("p");
    title.className = "task-card__title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-card__meta";

    const xpBadge = document.createElement("span");
    xpBadge.className = "task-card__xp";
    xpBadge.textContent = `+${xp} XP`;
    meta.appendChild(xpBadge);

    const actions = document.createElement("div");
    actions.className = "task-card__actions";

    const doneBtn = document.createElement("button");
    doneBtn.className = "btn btn--complete btn--sm";
    doneBtn.dataset.action = "complete";
    doneBtn.dataset.id = task.id;
    doneBtn.setAttribute("aria-label", "Complete task");
    doneBtn.textContent = "Done";

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn--ghost btn--sm";
    editBtn.dataset.action = "edit";
    editBtn.dataset.id = task.id;
    editBtn.setAttribute("aria-label", "Edit task");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn--danger btn--sm";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = task.id;
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.textContent = "Delete";

    actions.append(doneBtn, editBtn, deleteBtn);
    el.append(title, meta, actions);

    if (decay !== "fresh") {
      const decayBar = document.createElement("div");
      decayBar.className = "task-card__decay-bar";
      decayBar.style.width = `${decayPct}%`;
      el.appendChild(decayBar);
    }

    if (decay === "rotten") {
      const particles = document.createElement("div");
      particles.className = "stink-particles";

      for (let i = 0; i < 6; i++) {
        const p = document.createElement("span");
        p.className = "stink-particle";
        p.style.setProperty("--duration", `${2 + Math.random() * 2}s`);
        p.style.setProperty("--delay", `${Math.random() * 2}s`);
        p.style.left = `${10 + Math.random() * 80}%`;
        p.style.setProperty("--size", `${8 + Math.random() * 8}px`);
        particles.appendChild(p);
      }

      el.appendChild(particles);
    }

    el.addEventListener("dragstart", (e) => {
      setDraggedTaskId(task.id);
      el.classList.add("task-card--dragging");
      e.dataTransfer!.effectAllowed = "move";
      e.dataTransfer!.setData("text/plain", task.id);
    });

    el.addEventListener("dragend", () => {
      el.classList.remove("task-card--dragging");
      setDraggedTaskId(null);
      document.querySelectorAll(".task-grid.drag-over").forEach((g) => g.classList.remove("drag-over"));
      document.querySelectorAll(".task-card--drop-target").forEach((c) => c.classList.remove("task-card--drop-target"));
    });

    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = "move";
      document.querySelectorAll(".task-card--drop-target").forEach((c) => {
        if (c !== el) c.classList.remove("task-card--drop-target");
      });
      if (el.dataset.id !== getDraggedTaskId()) {
        el.classList.add("task-card--drop-target");
      }
    });

    return el;
  }
}
