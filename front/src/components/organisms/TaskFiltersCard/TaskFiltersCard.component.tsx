import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import "./TaskFiltersCard.css";

export type TaskFilterTab = "pending" | "assigned-to-me" | "completed";

export interface TaskFiltersCardProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  activeTab?: TaskFilterTab;
  onTabChange?: (tab: TaskFilterTab) => void;
  onCreateTask?: () => void;
}

const TABS: { key: TaskFilterTab; label: string }[] = [
  { key: "pending", label: "Pendientes" },
  { key: "assigned-to-me", label: "Asignadas a mi" },
  { key: "completed", label: "Finalizadas" },
];

/**
 * TaskFiltersCard - Organism
 *
 * Task filters: title, Create task button, search input, filter tabs.
 */
export const TaskFiltersCard = ({
  searchValue = "",
  onSearchChange,
  activeTab = "pending",
  onTabChange,
  onCreateTask,
}: TaskFiltersCardProps) => (
  <Card variant="elevated" className="task-filters-card">
    <div className="task-filters-card__header">
      <h2 className="task-filters-card__title">Tareas</h2>
      <Button variant="primary" size="small" onClick={onCreateTask} className="task-filters-card__create">
        Crear tarea
      </Button>
    </div>
    <div className="task-filters-card__search">
      <Input
        placeholder="Buscar tarea, destinatario o cédula"
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        fullWidth
        size="small"
      />
    </div>
    <div className="task-filters-card__tabs" role="tablist">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={activeTab === key}
          className={`task-filters-card__tab ${activeTab === key ? "task-filters-card__tab--active" : ""}`}
          onClick={() => onTabChange?.(key)}
        >
          {label}
        </button>
      ))}
    </div>
  </Card>
);
