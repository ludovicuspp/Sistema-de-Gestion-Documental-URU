import { Button } from "@/components/atoms/Button";
import "./TaskItem.css";

export interface TaskItemProps {
  title: string;
  date: string;
  priority?: "Alta" | "Media" | "Baja";
  assignee?: string;
  actions?: Array<{ label: string; onClick: () => void; variant?: "primary" | "secondary" | "ghost" }>;
}

/**
 * TaskItem - Molecule
 *
 * Task row (title, date, assignee, actions).
 */
export const TaskItem = ({ title, date, priority, assignee, actions }: TaskItemProps) => (
  <div className="task-item">
    <span className="task-item__dot" aria-hidden="true" />
    <div className="task-item__body">
      <div className="task-item__main">
        <span className="task-item__title">{title}</span>
        <span className="task-item__meta">Fecha: {date}{priority ? ` · Prioridad: ${priority}` : ""}</span>
      </div>
      {assignee && <span className="task-item__assignee">Asignado: {assignee}</span>}
    </div>
    {actions && actions.length > 0 && (
      <div className="task-item__actions">
        {actions.map((a, i) => (
          <Button key={i} variant={a.variant ?? "ghost"} size="small" onClick={a.onClick}>
            {a.label}
          </Button>
        ))}
      </div>
    )}
  </div>
);
