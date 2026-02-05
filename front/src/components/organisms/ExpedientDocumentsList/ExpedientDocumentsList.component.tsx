import { Card } from "@/components/molecules/Card";
import { ExpedientDocumentItem } from "@/components/molecules/ExpedientDocumentItem";
import type { ExpedientDocumentItemProps } from "@/components/molecules/ExpedientDocumentItem";
import "./ExpedientDocumentsList.css";

export interface ExpedientDocumentListItem
  extends Pick<ExpedientDocumentItemProps, "id" | "type" | "fileName" | "fileSize"> {}

export interface ExpedientDocumentsListProps {
  title?: string;
  documents: ExpedientDocumentListItem[];
  onViewDocument?: (id: string) => void;
  onObservation?: (id: string) => void;
}

/**
 * ExpedientDocumentsList - Organism
 *
 * List of documents in an expedient: simple list format with PDF icon, type, filename, size, and action buttons.
 */
export const ExpedientDocumentsList = ({
  title = "Documentos",
  documents,
  onViewDocument,
  onObservation,
}: ExpedientDocumentsListProps) => {
  return (
    <Card variant="elevated" className="expedient-documents-list">
      <h3 className="expedient-documents-list__title">{title}</h3>
      <div className="expedient-documents-list__list">
        {documents.length === 0 ? (
          <p className="expedient-documents-list__empty">No hay documentos cargados.</p>
        ) : (
          documents.map((doc) => (
            <ExpedientDocumentItem
              key={doc.id}
              id={doc.id}
              type={doc.type}
              fileName={doc.fileName}
              fileSize={doc.fileSize}
              onView={onViewDocument}
              onObservation={onObservation}
            />
          ))
        )}
      </div>
    </Card>
  );
};
