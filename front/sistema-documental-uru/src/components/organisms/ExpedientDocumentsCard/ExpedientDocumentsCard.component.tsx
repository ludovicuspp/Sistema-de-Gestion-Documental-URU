import { Card } from "@/components/molecules/Card";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { DocumentRow } from "@/components/molecules/DocumentRow";
import type { DocumentRowProps } from "@/components/molecules/DocumentRow";
import "./ExpedientDocumentsCard.css";

export interface ExpedientDocumentItem
  extends Pick<
    DocumentRowProps,
    "id" | "type" | "fileName" | "uploadedBy" | "date" | "validationStatus"
  > {}

export interface ExpedientDocumentsCardProps {
  title?: string;
  generalStatus?: "pending" | "validated" | "partial";
  generalStatusLabel?: string;
  documents: ExpedientDocumentItem[];
  onViewDocument?: (id: string) => void;
  onObservation?: (id: string) => void;
  onDeleteDocument?: (id: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  validated: "Validado",
  partial: "Parcial",
};

/**
 * ExpedientDocumentsCard - Organism
 *
 * Card for expedient documents: general status, PDF viewer placeholder, table of documents.
 * Upload is in a separate UploadDocumentCard.
 */
export const ExpedientDocumentsCard = ({
  title = "Documentos del expediente",
  generalStatus = "pending",
  generalStatusLabel,
  documents,
  onViewDocument,
  onObservation,
  onDeleteDocument,
}: ExpedientDocumentsCardProps) => {
  const label = generalStatusLabel ?? STATUS_LABEL[generalStatus] ?? "Pendiente";
  const badgeVariant = generalStatus === "validated" ? "completed" : "pending";

  return (
    <Card variant="elevated" className="expedient-documents-card">
      <div className="expedient-documents-card__header">
        <h3 className="expedient-documents-card__title">{title}</h3>
        <StatusBadge variant={badgeVariant} className="expedient-documents-card__status">
          Estado general: {label}
        </StatusBadge>
      </div>

      <div className="expedient-documents-card__viewer">
        <p className="expedient-documents-card__viewer-placeholder">
          Visor PDF / Imagen (placeholder). Selecciona &quot;Ver&quot; en un documento para mostrar aquí.
        </p>
      </div>

      <div className="expedient-documents-card__table-wrap">
        <table className="expedient-documents-card__table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Archivo</th>
              <th>Subido por</th>
              <th>Fecha</th>
              <th>Validación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="expedient-documents-card__empty-cell">
                  No hay documentos cargados.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  id={doc.id}
                  type={doc.type}
                  fileName={doc.fileName}
                  uploadedBy={doc.uploadedBy}
                  date={doc.date}
                  validationStatus={doc.validationStatus}
                  onView={onViewDocument}
                  onObservation={onObservation}
                  onDelete={onDeleteDocument}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
