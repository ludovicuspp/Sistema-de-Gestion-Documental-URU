import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import "./DocumentRow.css";

export type DocumentValidationStatus = "pending" | "validated";

export interface DocumentRowProps {
  id: string;
  type: string;
  fileName: string;
  uploadedBy: string;
  date: string;
  validationStatus: DocumentValidationStatus;
  onView?: (id: string) => void;
  onObservation?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const LABEL_MAP: Record<DocumentValidationStatus, string> = {
  pending: "Pendiente",
  validated: "Validado",
};

/**
 * DocumentRow - Molecule
 *
 * Table row for expedient document: type, file, uploaded by, date, validation badge, View/Observation/Delete.
 */
export const DocumentRow = ({
  id,
  type,
  fileName,
  uploadedBy,
  date,
  validationStatus,
  onView,
  onObservation,
  onDelete,
}: DocumentRowProps) => {
  const badgeVariant = validationStatus === "validated" ? "completed" : "pending";

  return (
    <tr className="document-row">
      <td className="document-row__cell document-row__type">{type}</td>
      <td className="document-row__cell document-row__file">{fileName}</td>
      <td className="document-row__cell document-row__uploaded">{uploadedBy}</td>
      <td className="document-row__cell document-row__date">{date}</td>
      <td className="document-row__cell document-row__validation">
        <StatusBadge variant={badgeVariant}>{LABEL_MAP[validationStatus]}</StatusBadge>
      </td>
      <td className="document-row__cell document-row__actions">
        <Button variant="outline" size="small" onClick={() => onView?.(id)}>
          Ver
        </Button>
        <Button variant="outline" size="small" onClick={() => onObservation?.(id)}>
          Observación
        </Button>
        <Button variant="danger" size="small" onClick={() => onDelete?.(id)}>
          Eliminar
        </Button>
      </td>
    </tr>
  );
};
