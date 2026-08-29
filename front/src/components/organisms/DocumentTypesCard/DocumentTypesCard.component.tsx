import { useState } from "react";
import { Card } from "@/components/molecules/Card";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { DocumentTypeRow } from "@/components/molecules/DocumentTypeRow";
import "./DocumentTypesCard.css";

export interface DocumentTypeItem {
  id: string;
  name: string;
  description: string;
}

export interface DocumentTypesCardProps {
  title?: string;
  types: DocumentTypeItem[];
  onNewType?: () => void;
  onSearch?: (query: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * DocumentTypesCard - Organism
 *
 * Card for document types: New type button, search, list with Edit/Delete.
 */
export const DocumentTypesCard = ({
  title = "Tipos de documento",
  types,
  onNewType,
  onSearch,
  onEdit,
  onDelete,
}: DocumentTypesCardProps) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredTypes = searchValue.trim()
    ? types.filter(
        (t) =>
          t.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          t.description.toLowerCase().includes(searchValue.toLowerCase())
      )
    : types;

  return (
    <Card variant="elevated" className="document-types-card">
      <div className="document-types-card__header">
        <h3 className="document-types-card__title">{title}</h3>
        <Button variant="primary" size="small" onClick={onNewType}>
          Nuevo tipo
        </Button>
      </div>
      <div className="document-types-card__search">
        <Input
          placeholder="Buscar tipo de documento"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            onSearch?.(e.target.value);
          }}
          fullWidth
        />
      </div>
      <div className="document-types-card__list">
        {filteredTypes.length === 0 ? (
          <p className="document-types-card__empty">No hay tipos de documento.</p>
        ) : (
          filteredTypes.map((t) => (
            <DocumentTypeRow
              key={t.id}
              id={t.id}
              name={t.name}
              description={t.description}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </Card>
  );
};
