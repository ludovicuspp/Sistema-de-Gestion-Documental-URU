import { Button } from "@/components/atoms/Button";
import { StatusBadge, type StatusBadgeVariant } from "@/components/atoms/StatusBadge";
import "./TaskItem.css";

export type TaskItemVariant = "dashboard" | "management";

export interface TaskItemProps {
  title: string;
  date: string;
  dueDate?: string;
  variant?: TaskItemVariant;
  /** Dashboard: optional. Management: required. */
  assignee?: string;
  priority?: "Alta" | "Media" | "Baja";
  status?: "Pendiente" | "Finalizada";
  selected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  actions?: Array<{ label: string; onClick: () => void; variant?: "primary" | "secondary" | "ghost" }>;
}

/**
 * TaskItem - Molecule
 *
 * Reusable task row. Dashboard: dot, date, priority, assignee, custom actions.
 * Management: "Asignada a" / "Fecha asignación", status badge, Eliminar, clickable row.
 */
export const TaskItem = ({
  title,
  date,
  dueDate,
  variant = "dashboard",
  assignee,
  priority,
  status,
  selected = false,
  onSelect,
  onDelete,
  actions,
}: TaskItemProps) => {
  const isManagement = variant === "management";
  let statusVariant: StatusBadgeVariant | undefined;
  if (status === "Finalizada") statusVariant = "completed";
  else if (status === "Pendiente") statusVariant = "pending";

  if (isManagement) {
    const rowClasses = ["task-item", "task-item--management", selected && "task-item--selected"]
      .filter(Boolean)
      .join(" ");
    return (
      <div
        className={rowClasses}
        tabIndex={onSelect ? 0 : undefined}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.();
          }
        }}
      >
        <div className="task-item__info">
          <div className="task-item__title">{title}</div>
          <div className="task-item__meta">
            {dueDate
              ? `${date} hasta ${dueDate}`
              : `Asignada a: ${assignee ?? ""}. Fecha asignación: ${date}`}
          </div>
        </div>
        <div className="task-item__actions">
          {status != null && statusVariant != null && (
            <StatusBadge variant={statusVariant}>{status}</StatusBadge>
          )}
          {onDelete != null && (
            <Button
              variant="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Eliminar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="task-item">
      <span className="task-item__dot" aria-hidden="true" />
      <div className="task-item__body">
        <div className="task-item__main">
          <span className="task-item__title">{title}</span>
          <span className="task-item__meta">
            Fecha: {date}
            {priority == null ? "" : ` · Prioridad: ${priority}`}
          </span>
        </div>
        {assignee == null ? null : <span className="task-item__assignee">Asignado: {assignee}</span>}
      </div>
      {actions != null && actions.length > 0 && (
        <div className="task-item__actions">
          {actions.map((a, idx) => (
            <Button key={`${a.label}-${idx}`} variant={a.variant ?? "ghost"} size="small" onClick={a.onClick}>
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
