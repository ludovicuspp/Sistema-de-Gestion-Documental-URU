import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import "./RequestDetailCard.css";

export interface RequestDetailData {
  id: string;
  studentName: string;
  studentSurname: string;
  studentCI: string;
  level: string;
  email: string;
  comment: string;
  requestedDocuments: string[];
  status: "not-validated" | "validated" | "rejected";
}

export interface RequestDetailCardProps {
  request?: RequestDetailData | null;
  onExport?: () => void;
}

const getInitials = (name: string, surname: string) => {
  const first = name?.[0]?.toUpperCase() ?? "";
  const second = surname?.[0]?.toUpperCase() ?? "";
  return `${first}${second}`;
};

/**
 * RequestDetailCard - Organism
 *
 * Selected request detail card with student data and requested documents.
 */
export const RequestDetailCard = ({ request, onExport }: RequestDetailCardProps) => {
  if (!request) {
    return (
      <Card variant="elevated" className="request-detail-card">
        <h2 className="request-detail-card__title">Solicitud seleccionada</h2>
        <p className="request-detail-card__subtitle">Selecciona una solicitud para ver sus detalles</p>
        <div className="request-detail-card__empty">
          <p>No hay solicitud seleccionada.</p>
        </div>
      </Card>
    );
  }

  const display = (value: string | undefined) => (value && value.trim() ? value : "—");
  const initials = getInitials(request.studentName, request.studentSurname);

  return (
    <Card variant="elevated" className="request-detail-card">
      <h2 className="request-detail-card__title">(Solicitud seleccionada)</h2>
      <div className="request-detail-card__header">
        <div className="request-detail-card__avatar" aria-hidden>
          {initials}
        </div>
        <div className="request-detail-card__header-right">
          <StatusBadge variant={request.status === "validated" ? "completed" : "pending"} className="request-detail-card__status">
            {request.status === "validated" ? "Validado" : request.status === "rejected" ? "Rechazado" : "No validado"}
          </StatusBadge>
          <Button variant="outline" size="small" onClick={onExport}>
            Exportar
          </Button>
        </div>
      </div>

      <div className="request-detail-card__section">
        <h3 className="request-detail-card__section-title">Datos proporcionados por el estudiante</h3>
        <div className="request-detail-card__fields">
          <div className="request-detail-card__field">
            <label className="request-detail-card__label">Nombres</label>
            <p className="request-detail-card__value">{display(request.studentName)}</p>
          </div>
          <div className="request-detail-card__field">
            <label className="request-detail-card__label">Apellidos</label>
            <p className="request-detail-card__value">{display(request.studentSurname)}</p>
          </div>
          <div className="request-detail-card__field">
            <label className="request-detail-card__label">Cédula</label>
            <p className="request-detail-card__value">{display(request.studentCI)}</p>
          </div>
          <div className="request-detail-card__field">
            <label className="request-detail-card__label">Nivel</label>
            <p className="request-detail-card__value">{display(request.level)}</p>
          </div>
          <div className="request-detail-card__field">
            <label className="request-detail-card__label">Correo electrónico</label>
            <p className="request-detail-card__value">{display(request.email)}</p>
          </div>
          <div className="request-detail-card__field">
            <label className="request-detail-card__label">Comentario</label>
            <p className="request-detail-card__value">{display(request.comment)}</p>
          </div>
        </div>
      </div>

      <div className="request-detail-card__section">
        <h3 className="request-detail-card__section-title">Documentos solicitados</h3>
        <ul className="request-detail-card__documents-list">
          {request.requestedDocuments.length === 0 ? (
            <li className="request-detail-card__document-item">—</li>
          ) : (
            request.requestedDocuments.map((doc, index) => (
              <li key={index} className="request-detail-card__document-item">
                {doc}
              </li>
            ))
          )}
        </ul>
      </div>
    </Card>
  );
};
