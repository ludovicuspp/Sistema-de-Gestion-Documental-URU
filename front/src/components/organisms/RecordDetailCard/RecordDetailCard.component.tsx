import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import type { StatusBadgeVariant } from "@/components/atoms/StatusBadge";
import "./RecordDetailCard.css";

export interface RecordDocumentItem {
  id: string;
  label: string;
  fileName: string;
  size: string;
  onView?: () => void;
  onObservation?: () => void;
}

export interface RecordObservationItem {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface RecordDetail {
  id: string;
  type: string;
  createdAt: string;
  location: string;
  status: string;
  statusVariant: StatusBadgeVariant;
  documents: RecordDocumentItem[];
  observations: RecordObservationItem[];
}

export interface RecordDetailCardProps {
  record: RecordDetail | null;
  onEdit?: (recordId: string) => void;
  onDelete?: (recordId: string) => void;
  onViewHistory?: () => void;
}

const IconPdf = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M10 12v4" />
    <path d="M14 12v4" />
    <path d="M8 16h8" />
    <path d="M8 11h8" />
  </svg>
);

/**
 * RecordDetailCard - Organism
 *
 * Record detail: type, metadata, location, status, actions, document list, observations.
 */
export const RecordDetailCard = ({
  record,
  onEdit,
  onDelete,
  onViewHistory,
}: RecordDetailCardProps) => {
  if (record == null) {
    return (
      <Card variant="elevated" className="record-detail-card">
        <div className="record-detail-card__empty">
          Selecciona un estudiante para ver el detalle del expediente.
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="record-detail-card">
      <div className="record-detail-card__meta-row">
        <div className="record-detail-card__meta">
          <span className="record-detail-card__type">{record.type}</span>
          <span className="record-detail-card__created">Creado: {record.createdAt}</span>
          <span className="record-detail-card__location">Ubicación: {record.location}</span>
        </div>
        <div className="record-detail-card__meta-right">
          <StatusBadge variant={record.statusVariant}>Estado: {record.status}</StatusBadge>
          <div className="record-detail-card__actions">
            <Button variant="outline" size="small" onClick={() => onEdit?.(record.id)}>
              Editar
            </Button>
            <Button variant="danger" size="small" onClick={() => onDelete?.(record.id)}>
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <section className="record-detail-card__section">
        <h4 className="record-detail-card__section-title">Documentos</h4>
        <ul className="record-detail-card__doc-list">
          {record.documents.length === 0 ? (
            <li className="record-detail-card__doc-empty">Sin documentos cargados.</li>
          ) : (
            record.documents.map((doc) => (
              <li key={doc.id} className="record-detail-card__doc-item">
                <span className="record-detail-card__doc-icon" aria-hidden="true">
                  <IconPdf />
                </span>
                <div className="record-detail-card__doc-info">
                  <span className="record-detail-card__doc-label">{doc.label}</span>
                  <span className="record-detail-card__doc-meta">
                    {doc.fileName} · {doc.size}
                  </span>
                </div>
                <div className="record-detail-card__doc-actions">
                  <Button variant="ghost" size="small" onClick={doc.onView}>
                    Ver
                  </Button>
                  <Button variant="ghost" size="small" onClick={doc.onObservation}>
                    Observación
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="record-detail-card__section">
        <div className="record-detail-card__observations-header">
          <h4 className="record-detail-card__section-title">Observaciones</h4>
          <Button variant="ghost" size="small" onClick={onViewHistory}>
            Ver historial
          </Button>
        </div>
        <ul className="record-detail-card__obs-list">
          {record.observations.length === 0 ? (
            <li className="record-detail-card__obs-empty">Sin observaciones.</li>
          ) : (
            record.observations.map((obs) => (
              <li key={obs.id} className="record-detail-card__obs-item">
                <span className="record-detail-card__obs-meta">
                  {obs.date} {obs.author}:
                </span>{" "}
                {obs.text}
              </li>
            ))
          )}
        </ul>
      </section>
    </Card>
  );
};
