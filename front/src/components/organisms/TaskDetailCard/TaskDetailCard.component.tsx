import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import "./TaskDetailCard.css";

export interface TaskDetail {
  id: string;
  title: string;
  assignee: string;
  assignmentDate: string;
  dueDate?: string;
  status: "Pendiente" | "Finalizada";
  description: string;
  workDetail: string[];
  historyCount: number;
  historyResponsible: string;
  total?: number;
}

export interface TaskDetailCardProps {
  task: TaskDetail | null;
  onMarkPending?: () => void;
  onNotifyAssigned?: () => void;
  onMarkCompleted?: () => void;
  variant?: "admin" | "verifier";
  subtitle?: string;
}

const DEFAULT_SUBTITLE = "Selecciona una tarea para ver el detalle o crear una nueva";

/**
 * TaskDetailCard - Organism
 *
 * Task detail card: empty state or selected task (metadata, description, work detail, actions, history).
 */
export const TaskDetailCard = ({
  task,
  onMarkPending,
  onNotifyAssigned,
  onMarkCompleted,
  variant = "admin",
  subtitle = DEFAULT_SUBTITLE,
}: TaskDetailCardProps) => {
  const isVerifier = variant === "verifier";

  return (
    <Card variant="elevated" className="task-detail-card">
      <div className="task-detail-card__header">
        <div>
          <h3 className="task-detail-card__title">Detalle de la tarea</h3>
          <p className="task-detail-card__subtitle">{subtitle}</p>
        </div>
        {task?.total != null && (
          <span className="task-detail-card__total">Total: {task.total}</span>
        )}
      </div>

      {task == null ? (
        <div className="task-detail-card__empty">Ninguna tarea seleccionada.</div>
      ) : (
        <div className={`task-detail-card__body ${isVerifier ? "task-detail-card__body--verifier" : ""}`}>
          <div className="task-detail-card__meta-row">
            <h4 className="task-detail-card__task-title">{task.title}</h4>
            <div className="task-detail-card__actions">
              {isVerifier ? (
                task.status === "Finalizada" ? (
                  <Button variant="secondary" size="small" onClick={onMarkPending} className="task-detail-card__btn-pending">
                    Marcar como pendiente
                  </Button>
                ) : (
                  <Button variant="outline" size="small" onClick={onMarkCompleted} className="task-detail-card__btn-complete">
                    Marcar como completada
                  </Button>
                )
              ) : (
                <>
                  <Button variant="secondary" size="small" onClick={onMarkPending}>
                    Marcar como pendiente
                  </Button>
                  <Button variant="primary" size="small" onClick={onNotifyAssigned}>
                    Notificar asignado
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className={`task-detail-card__meta ${isVerifier ? "task-detail-card__meta--verifier" : ""}`}>
            <span>Asignada a: {task.assignee}</span>
            <span>Fecha asignación: {task.assignmentDate}</span>
            {task.dueDate && <span>Fecha limite: {task.dueDate}</span>}
            <span>Estado: <StatusBadge variant={task.status === "Finalizada" ? "completed" : "pending"}>{task.status}</StatusBadge></span>
          </div>

          <section className="task-detail-card__section">
            <h4 className="task-detail-card__section-title">Descripción</h4>
            <p className="task-detail-card__section-content">{task.description}</p>
          </section>

          <section className="task-detail-card__section">
            <h4 className="task-detail-card__section-title">Detalle de trabajo</h4>
            <ul className="task-detail-card__list">
              {task.workDetail.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          {!isVerifier && (
            <p className="task-detail-card__history">
              Historial: {task.historyCount} eventos - Responsable: {task.historyResponsible}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
