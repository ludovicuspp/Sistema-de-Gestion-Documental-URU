import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import "./RecordDetailCard.css";

export interface RecordDetailData {
  studentId: string;
  studentName: string;
  studentCI: string;
  studentBirthDate?: string;
  studentEmail?: string;
  recordType?: string;
  recordCreatedDate?: string;
  recordLocation?: string;
  recordStatus?: "pending" | "approved" | "rejected";
}

export interface RecordDetailCardProps {
  record?: RecordDetailData | null;
  onUpdateDocuments?: () => void;
  onUploadRecord?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  /** Si es true, muestra el botón "Actualizar Documentos". Default: true */
  showUpdateDocuments?: boolean;
  /** Si es true, muestra los botones Editar/Eliminar. Default: true */
  showEditDelete?: boolean;
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
 * RecordDetailCard - Organism
 *
 * Student information card with avatar, name, CI, birth date, email, and action buttons.
 * Record information card with type, creation date, location, status badge, and Edit/Delete buttons.
 */
export const RecordDetailCard = ({
  record,
  onUpdateDocuments,
  onUploadRecord,
  onEdit,
  onDelete,
  showUpdateDocuments = true,
  showEditDelete = true,
}: RecordDetailCardProps) => {
  if (!record) {
    return (
      <Card variant="elevated" className="record-detail-card">
        <h2 className="record-detail-card__title">Detalle del expediente</h2>
        <p className="record-detail-card__subtitle">Busca un estudiante para ver su expediente</p>
        <div className="record-detail-card__empty">
          <p>No hay expediente seleccionado.</p>
        </div>
      </Card>
    );
  }

  const display = (value: string | undefined) => value ?? "—";
  const statusLabel = record.recordStatus ? STATUS_LABELS[record.recordStatus] : "—";
  const statusBadgeVariant = record.recordStatus
    ? STATUS_BADGE_VARIANTS[record.recordStatus] ?? "pending"
    : "pending";

  return (
    <>
      <Card variant="elevated" className="record-detail-card record-detail-card--student">
        <div className="record-detail-card__student-info">
          <div className="record-detail-card__avatar" aria-hidden>
            {getInitials(record.studentName)}
          </div>
          <div className="record-detail-card__student-text">
            <h2 className="record-detail-card__student-name">{record.studentName}</h2>
            <p className="record-detail-card__student-meta">
              CI: {record.studentCI}
              {record.studentBirthDate ? ` Nac: ${record.studentBirthDate}` : ""}
            </p>
            <p className="record-detail-card__student-meta">Email: {display(record.studentEmail)}</p>
          </div>
        </div>
        <div className="record-detail-card__student-actions">
          {showUpdateDocuments && (
            <Button variant="outline" size="small" onClick={onUpdateDocuments}>
              Actualizar Documentos
            </Button>
          )}
          <Button variant="primary" size="small" onClick={onUploadRecord}>
            Cargar Expediente
          </Button>
        </div>
      </Card>

      <Card variant="elevated" className="record-detail-card record-detail-card--record">
        <div className="record-detail-card__record-header">
          <div>
            <h3 className="record-detail-card__record-title">
              Expediente • {display(record.recordType)}
            </h3>
            <p className="record-detail-card__record-meta">
              Creado: {display(record.recordCreatedDate)}
              {record.recordLocation ? ` Ubicación: ${record.recordLocation}` : ""}
            </p>
          </div>
          <StatusBadge variant={statusBadgeVariant} className="record-detail-card__status">
            Estado: {statusLabel}
          </StatusBadge>
        </div>
        {showEditDelete && (
          <div className="record-detail-card__record-actions">
            <Button variant="primary" size="small" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="danger" size="small" onClick={onDelete}>
              Eliminar
            </Button>
          </div>
        )}
      </Card>
    </>
  );
};
