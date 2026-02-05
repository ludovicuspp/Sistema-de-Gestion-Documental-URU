import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import "./TaskDetailCard.css";

export interface TaskDetail {
  id: string;
  title: string;
  assignee: string;
  assignmentDate: string;
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
}

const SUBTITLE = "Selecciona una tarea para ver el detalle o crear una nueva";

/**
 * TaskDetailCard - Organism
 *
 * Task detail card: empty state or selected task (metadata, description, work detail, actions, history).
 */
export const TaskDetailCard = ({
  task,
  onMarkPending,
  onNotifyAssigned,
}: TaskDetailCardProps) => (
  <Card variant="elevated" className="task-detail-card">
    <div className="task-detail-card__header">
      <div>
        <h3 className="task-detail-card__title">Detalle de la tarea</h3>
        <p className="task-detail-card__subtitle">{SUBTITLE}</p>
      </div>
      {task?.total != null && (
        <span className="task-detail-card__total">Total: {task.total}</span>
      )}
    </div>

    {task == null ? (
      <div className="task-detail-card__empty">Ninguna tarea seleccionada.</div>
    ) : (
      <>
        <div className="task-detail-card__meta-row">
          <span className="task-detail-card__task-title">{task.title}</span>
          <div className="task-detail-card__actions">
            <Button variant="secondary" size="small" onClick={onMarkPending}>
              Marcar como pendiente
            </Button>
            <Button variant="primary" size="small" onClick={onNotifyAssigned}>
              Notificar asignado
            </Button>
          </div>
        </div>
        <p className="task-detail-card__meta">
          Asignada a: {task.assignee} - Fecha asignación: {task.assignmentDate} - Estado:{" "}
          <StatusBadge variant={task.status === "Finalizada" ? "completed" : "pending"}>
            {task.status}
          </StatusBadge>
        </p>

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

        <p className="task-detail-card__history">
          Historial: {task.historyCount} eventos - Responsable: {task.historyResponsible}
        </p>
      </>
    )}
  </Card>
);
