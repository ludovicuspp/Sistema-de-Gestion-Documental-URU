import { Card } from "@/components/molecules/Card";
import { RecordDocumentItem } from "@/components/molecules/RecordDocumentItem";
import type { RecordDocumentItemProps } from "@/components/molecules/RecordDocumentItem";
import "./RecordDocumentsList.css";

export interface RecordDocumentListItem
  extends Pick<RecordDocumentItemProps, "id" | "type" | "fileName" | "fileSize"> {}

export interface RecordDocumentsListProps {
  title?: string;
  documents: RecordDocumentListItem[];
  onViewDocument?: (id: string) => void;
  onObservation?: (id: string) => void;
  /** Si es true, muestra el botón "Observación" en cada documento. Default: true */
  showObservation?: boolean;
}

/**
 * RecordDocumentsList - Organism
 *
 * List of documents in a record: simple list format with PDF icon, type, filename, size, and action buttons.
 */
export const RecordDocumentsList = ({
  title = "Documentos",
  documents,
  onViewDocument,
  onObservation,
  showObservation = true,
}: RecordDocumentsListProps) => {
  return (
    <Card variant="elevated" className="record-documents-list">
      <h3 className="record-documents-list__title">{title}</h3>
      <div className="record-documents-list__list">
        {documents.length === 0 ? (
          <p className="record-documents-list__empty">No hay documentos cargados.</p>
        ) : (
          documents.map((doc) => (
            <RecordDocumentItem
              key={doc.id}
              id={doc.id}
              type={doc.type}
              fileName={doc.fileName}
              fileSize={doc.fileSize}
              onView={onViewDocument}
              onObservation={showObservation ? onObservation : undefined}
            />
          ))
        )}
      </div>
    </Card>
  );
};
