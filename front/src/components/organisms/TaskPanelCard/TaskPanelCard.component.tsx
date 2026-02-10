import { Card } from "@/components/molecules/Card";
import "./TaskPanelCard.css";

export interface TaskPanelCardProps {
  /** Task titles for the first column. */
  todo: string[];
  /** Task titles for the second column. */
  inProgress: string[];
  /** Task titles for the third column. */
  completed: string[];
  /** Card title. Default: "Panel de tareas". */
  title?: string;
  /** Label for the first column. Default: "Por hacer". */
  todoLabel?: string;
  /** Label for the second column. Default: "En proceso". */
  inProgressLabel?: string;
  /** Label for the third column. Default: "Completadas". */
  completedLabel?: string;
}

/**
 * TaskPanelCard - Organism
 *
 * Kanban-style task panel: three columns (To do, In progress, Completed).
 * Labels can be overridden for i18n.
 */
export const TaskPanelCard = ({
  todo,
  inProgress,
  completed,
  title = "Panel de tareas",
  todoLabel = "Por hacer",
  inProgressLabel = "En proceso",
  completedLabel = "Completadas",
}: TaskPanelCardProps) => (
  <Card variant="elevated" className="task-panel-card">
    <h3 className="task-panel-card__title">{title}</h3>
    <div className="task-panel-card__columns">
      <div className="task-panel-card__column">
        <h4 className="task-panel-card__column-title">{todoLabel}</h4>
        <ul className="task-panel-card__list">
          {todo.map((text, i) => (
            <li key={i} className="task-panel-card__item">
              {text}
            </li>
          ))}
        </ul>
      </div>
      <div className="task-panel-card__column">
        <h4 className="task-panel-card__column-title">{inProgressLabel}</h4>
        <ul className="task-panel-card__list">
          {inProgress.map((text, i) => (
            <li key={i} className="task-panel-card__item">
              {text}
            </li>
          ))}
        </ul>
      </div>
      <div className="task-panel-card__column">
        <h4 className="task-panel-card__column-title">{completedLabel}</h4>
        <ul className="task-panel-card__list">
          {completed.map((text, i) => (
            <li key={i} className="task-panel-card__item">
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Card>
);
