import { Button } from "@/components/atoms/Button";
import "./DocumentTypeRow.css";

export interface DocumentTypeRowProps {
  id: string;
  name: string;
  description: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * DocumentTypeRow - Molecule
 *
 * Row for document type list: name, description, Edit and Delete buttons.
 */
export const DocumentTypeRow = ({
  id,
  name,
  description,
  onEdit,
  onDelete,
}: DocumentTypeRowProps) => {
  return (
    <div className="document-type-row">
      <div className="document-type-row__info">
        <span className="document-type-row__name">{name}</span>
        <span className="document-type-row__description">{description}</span>
      </div>
      <div className="document-type-row__actions">
        <Button variant="outline" size="small" onClick={() => onEdit?.(id)}>
          Editar
        </Button>
        <Button variant="danger" size="small" onClick={() => onDelete?.(id)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
};
