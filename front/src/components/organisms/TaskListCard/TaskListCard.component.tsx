import { Card } from "@/components/molecules/Card";
import { TaskItem } from "@/components/molecules/TaskItem";
import "./TaskListCard.css";

export interface TaskListItem {
  id: string;
  title: string;
  assignee: string;
  assignmentDate: string;
  dueDate?: string;
  status: "Pendiente" | "Finalizada";
}

export type TaskListCardVariant = "admin" | "assistant";

export interface TaskListCardProps {
  title?: string;
  items: TaskListItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStartTask?: (id: string) => void;
  variant?: TaskListCardVariant;
  showTotal?: boolean;
}

const NOTE =
  "Nota: solo Administrador puede crear o eliminar tareas. El sistema audita fecha, creador y destinatario.";

/**
 * TaskListCard - Organism
 *
 * Task list card: title, rows, footer note. Assistant variant shows "Comenzar" and total.
 */
export const TaskListCard = ({
  title = "Lista de tareas",
  items,
  selectedId,
  onSelect,
  onDelete,
  onStartTask,
  variant = "admin",
  showTotal = false,
}: TaskListCardProps) => {
  const isAssistant = variant === "assistant";
  const taskVariant = isAssistant ? "assistant" : "management";
  const displayTotal = showTotal || isAssistant;

  return (
    <Card variant="elevated" className="task-list-card">
      <div className="task-list-card__header">
        <h3 className="task-list-card__title">{title}</h3>
        {displayTotal && (
          <span className="task-list-card__total">Total: {items.length}</span>
        )}
      </div>
      <div className="task-list-card__list">
        {items.map((t) => (
          <TaskItem
            key={t.id}
            variant={taskVariant}
            title={t.title}
            date={t.assignmentDate}
            dueDate={t.dueDate}
            assignee={t.assignee}
            status={t.status}
            selected={selectedId === t.id}
            onSelect={() => onSelect?.(t.id)}
            onDelete={!isAssistant && onDelete ? () => onDelete(t.id) : undefined}
            onStart={isAssistant ? () => onStartTask?.(t.id) : undefined}
          />
        ))}
      </div>
      {!isAssistant && <p className="task-list-card__note">{NOTE}</p>}
    </Card>
  );
};
