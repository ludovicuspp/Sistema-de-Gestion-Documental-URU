import { Card } from "@/components/molecules/Card";
import { TaskItem } from "@/components/molecules/TaskItem";
import { Link } from "@/components/atoms/Link";
import type { TaskListItem } from "@/components/organisms/TaskListCard";
import "./TaskRecentCard.css";

export interface TaskRecentCardProps {
  items: TaskListItem[];
  selectedId?: string | null;
  onViewAll?: () => void;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * TaskRecentCard - Organism
 *
 * Recent tasks block: title, Ver todo link, task rows.
 */
export const TaskRecentCard = ({
  items,
  selectedId,
  onViewAll,
  onSelect,
  onDelete,
}: TaskRecentCardProps) => (
  <Card variant="elevated" className="task-recent-card">
    <div className="task-recent-card__header">
      <h3 className="task-recent-card__title">Tareas recientes</h3>
      <Link href="#" onClick={(e) => { e.preventDefault(); onViewAll?.(); }} className="task-recent-card__link">
        Ver todo
      </Link>
    </div>
    <div className="task-recent-card__list">
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
  </Card>
);
