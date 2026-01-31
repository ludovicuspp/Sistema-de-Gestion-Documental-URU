import { Card } from "@/components/molecules/Card";
import { TaskItem } from "@/components/molecules/TaskItem";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import "./RecentTasks.css";

export interface Task {
  id: string;
  title: string;
  date: string;
  priority?: "Alta" | "Media" | "Baja";
  assignee?: string;
  actions?: Array<{ label: string; onClick: () => void; variant?: "primary" | "secondary" | "ghost" }>;
}

export interface RecentTasksProps {
  tasks: Task[];
  onViewAll?: () => void;
  onCreateTask?: () => void;
}

/**
 * RecentTasks - Organism
 *
 * Block of recent tasks (pending and assigned).
 */
export const RecentTasks = ({ tasks, onViewAll, onCreateTask }: RecentTasksProps) => (
  <Card variant="elevated" className="recent-tasks">
    <div className="recent-tasks__header">
      <div>
        <h3 className="recent-tasks__title">Tareas recientes</h3>
        <p className="recent-tasks__subtitle">Pendientes y asignaciones</p>
      </div>
      <div className="recent-tasks__actions">
        <Link href="#" onClick={(e) => { e.preventDefault(); onViewAll?.(); }} className="recent-tasks__link">
          Ver todo
        </Link>
        <Button variant="primary" size="small" onClick={onCreateTask}>
          Crear tarea
        </Button>
      </div>
    </div>
    <div className="recent-tasks__list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          title={t.title}
          date={t.date}
          priority={t.priority}
          assignee={t.assignee}
          actions={t.actions}
        />
      ))}
    </div>
  </Card>
);
