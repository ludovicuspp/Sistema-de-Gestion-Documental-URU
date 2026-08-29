import { Button } from "@/components/atoms/Button";
import "./ExpedientDocumentItem.css";

export interface ExpedientDocumentItemProps {
  id: string;
  type: string;
  fileName: string;
  fileSize?: string;
  onView?: (id: string) => void;
  onObservation?: (id: string) => void;
}

/**
 * ExpedientDocumentItem - Molecule
 *
 * Document item in expedient document list: PDF icon, type, filename, size, and View/Observation buttons.
 */
export const ExpedientDocumentItem = ({
  id,
  type,
  fileName,
  fileSize,
  onView,
  onObservation,
}: ExpedientDocumentItemProps) => {
  return (
    <div className="expedient-document-item">
      <div className="expedient-document-item__icon" aria-hidden>
        📄
      </div>
      <div className="expedient-document-item__info">
        <div className="expedient-document-item__type">{type}</div>
        <div className="expedient-document-item__file">
          {fileName}
          {fileSize && <span className="expedient-document-item__size"> {fileSize}</span>}
        </div>
      </div>
      <div className="expedient-document-item__actions">
        <Button variant="outline" size="small" onClick={() => onView?.(id)}>
          Ver
        </Button>
        <Button variant="outline" size="small" onClick={() => onObservation?.(id)}>
          Observación
        </Button>
      </div>
    </div>
  );
};
