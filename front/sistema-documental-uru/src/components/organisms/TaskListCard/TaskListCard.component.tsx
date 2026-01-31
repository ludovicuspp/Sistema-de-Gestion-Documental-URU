import { Card } from "@/components/molecules/Card";
import { TaskItem } from "@/components/molecules/TaskItem";
import "./TaskListCard.css";

export interface TaskListItem {
  id: string;
  title: string;
  assignee: string;
  assignmentDate: string;
  status: "Pendiente" | "Finalizada";
}

export interface TaskListCardProps {
  title?: string;
  items: TaskListItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NOTE =
  "Nota: solo Administrador puede crear o eliminar tareas. El sistema audita fecha, creador y destinatario.";

/**
 * TaskListCard - Organism
 *
 * Task list card: title, rows, footer note.
 */
export const TaskListCard = ({
  title = "Lista de tareas",
  items,
  selectedId,
  onSelect,
  onDelete,
}: TaskListCardProps) => (
  <Card variant="elevated" className="task-list-card">
    <h3 className="task-list-card__title">{title}</h3>
    <div className="task-list-card__list">
      {items.map((t) => (
        <TaskItem
          key={t.id}
          variant="management"
          title={t.title}
          date={t.assignmentDate}
          assignee={t.assignee}
          status={t.status}
          selected={selectedId === t.id}
          onSelect={() => onSelect?.(t.id)}
          onDelete={() => onDelete?.(t.id)}
        />
      ))}
    </div>
    <p className="task-list-card__note">{NOTE}</p>
  </Card>
);
