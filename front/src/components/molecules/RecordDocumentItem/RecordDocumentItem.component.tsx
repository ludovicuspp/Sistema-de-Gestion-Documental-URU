import { Button } from "@/components/atoms/Button";
import "./RecordDocumentItem.css";

export interface RecordDocumentItemProps {
  id: string;
  type: string;
  fileName: string;
  fileSize?: string;
  onView?: (id: string) => void;
  onObservation?: (id: string) => void;
}

/**
 * RecordDocumentItem - Molecule
 *
 * Document item in record document list: PDF icon, type, filename, size, and View/Observation buttons.
 */
export const RecordDocumentItem = ({
  id,
  type,
  fileName,
  fileSize,
  onView,
  onObservation,
}: RecordDocumentItemProps) => {
  return (
    <div className="record-document-item">
      <div className="record-document-item__icon" aria-hidden>
        📄
      </div>
      <div className="record-document-item__info">
        <div className="record-document-item__type">{type}</div>
        <div className="record-document-item__file">
          {fileName}
          {fileSize && <span className="record-document-item__size"> {fileSize}</span>}
        </div>
      </div>
      <div className="record-document-item__actions">
        <Button variant="outline" size="small" onClick={() => onView?.(id)}>
          Ver
        </Button>
        {onObservation && (
          <Button variant="outline" size="small" onClick={() => onObservation(id)}>
            Observación
          </Button>
        )}
      </div>
    </div>
  );
};
