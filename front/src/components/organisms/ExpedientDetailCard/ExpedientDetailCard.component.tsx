import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import "./ExpedientDetailCard.css";

export interface ExpedientDetailData {
  studentId: string;
  studentName: string;
  studentCI: string;
  studentBirthDate?: string;
  studentEmail?: string;
  expedientType?: string;
  expedientCreatedDate?: string;
  expedientLocation?: string;
  expedientStatus?: "pending" | "approved" | "rejected";
}

export interface ExpedientDetailCardProps {
  expedient?: ExpedientDetailData | null;
  onUpdateDocuments?: () => void;
  onUploadExpedient?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

const STATUS_BADGE_VARIANTS: Record<string, "pending" | "completed"> = {
  pending: "pending",
  approved: "completed",
  rejected: "pending",
};

/**
 * ExpedientDetailCard - Organism
 *
 * Student information card with avatar, name, CI, birth date, email, and action buttons.
 * Expedient information card with type, creation date, location, status badge, and Edit/Delete buttons.
 */
export const ExpedientDetailCard = ({
  expedient,
  onUpdateDocuments,
  onUploadExpedient,
  onEdit,
  onDelete,
}: ExpedientDetailCardProps) => {
  if (!expedient) {
    return (
      <Card variant="elevated" className="expedient-detail-card">
        <h2 className="expedient-detail-card__title">Detalle del expediente</h2>
        <p className="expedient-detail-card__subtitle">Busca un estudiante para ver su expediente</p>
        <div className="expedient-detail-card__empty">
          <p>No hay expediente seleccionado.</p>
        </div>
      </Card>
    );
  }

  const display = (value: string | undefined) => value ?? "—";
  const statusLabel = expedient.expedientStatus ? STATUS_LABELS[expedient.expedientStatus] : "—";
  const statusBadgeVariant = expedient.expedientStatus
    ? STATUS_BADGE_VARIANTS[expedient.expedientStatus] ?? "pending"
    : "pending";

  return (
    <>
      <Card variant="elevated" className="expedient-detail-card expedient-detail-card--student">
        <div className="expedient-detail-card__student-info">
          <div className="expedient-detail-card__avatar" aria-hidden>
            {getInitials(expedient.studentName)}
          </div>
          <div className="expedient-detail-card__student-text">
            <h2 className="expedient-detail-card__student-name">{expedient.studentName}</h2>
            <p className="expedient-detail-card__student-meta">
              CI: {expedient.studentCI}
              {expedient.studentBirthDate ? ` Nac: ${expedient.studentBirthDate}` : ""}
            </p>
            <p className="expedient-detail-card__student-meta">Email: {display(expedient.studentEmail)}</p>
          </div>
        </div>
        <div className="expedient-detail-card__student-actions">
          <Button variant="outline" size="small" onClick={onUpdateDocuments}>
            Actualizar Documentos
          </Button>
          <Button variant="primary" size="small" onClick={onUploadExpedient}>
            Cargar Expediente
          </Button>
        </div>
      </Card>

      <Card variant="elevated" className="expedient-detail-card expedient-detail-card--expedient">
        <div className="expedient-detail-card__expedient-header">
          <div>
            <h3 className="expedient-detail-card__expedient-title">
              Expediente - {display(expedient.expedientType)}
            </h3>
            <p className="expedient-detail-card__expedient-meta">
              Creado: {display(expedient.expedientCreatedDate)}
              {expedient.expedientLocation ? ` Ubicación: ${expedient.expedientLocation}` : ""}
            </p>
          </div>
          <StatusBadge variant={statusBadgeVariant} className="expedient-detail-card__status">
            Estado: {statusLabel}
          </StatusBadge>
        </div>
        <div className="expedient-detail-card__expedient-actions">
          <Button variant="primary" size="small" onClick={onEdit}>
            Editar
          </Button>
          <Button variant="danger" size="small" onClick={onDelete}>
            Eliminar
          </Button>
        </div>
      </Card>
    </>
  );
};
