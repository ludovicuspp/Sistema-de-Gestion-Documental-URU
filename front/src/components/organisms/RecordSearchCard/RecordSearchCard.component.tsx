import { useState } from "react";
import { Card } from "@/components/molecules/Card";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import "./RecordSearchCard.css";

export type RecordStatusFilter = "pending" | "approved" | "rejected" | "without-documents";

export interface RecordSearchCardProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  activeFilter?: RecordStatusFilter;
  onFilterChange?: (filter: RecordStatusFilter) => void;
  onNewRecord?: () => void;
}

/**
 * RecordSearchCard - Organism
 *
 * Search section for students by CI or name, with status filter buttons and "Nuevo Expediente" button.
 */
export const RecordSearchCard = ({
  searchValue = "",
  onSearchChange,
  activeFilter = "pending",
  onFilterChange,
  onNewRecord,
}: RecordSearchCardProps) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    onSearchChange?.(value);
  };

  const handleClearSearch = () => {
    setLocalSearchValue("");
    onSearchChange?.("");
  };

  const filters: { key: RecordStatusFilter; label: string }[] = [
    { key: "pending", label: "Pendiente" },
    { key: "approved", label: "Aprobado" },
    { key: "rejected", label: "Rechazado" },
    { key: "without-documents", label: "Sin documentos" },
  ];

  return (
    <Card variant="elevated" className="record-search-card">
      <div className="record-search-card__header">
        <div>
          <h2 className="record-search-card__title">Buscar estudiante</h2>
          <p className="record-search-card__subtitle">Por cédula o nombre</p>
        </div>
        <Button variant="primary" size="small" onClick={onNewRecord}>
          Nuevo Expediente
        </Button>
      </div>
      <div className="record-search-card__search-row">
        <Input
          placeholder="Ej: 12345678"
          value={localSearchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          fullWidth
          endIcon={
            localSearchValue ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Limpiar búsqueda"
                className="record-search-card__clear-btn"
              >
                <span aria-hidden>×</span>
              </button>
            ) : undefined
          }
        />
      </div>
      <div className="record-search-card__filters">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`record-search-card__filter record-search-card__filter--${key} ${
              activeFilter === key ? "record-search-card__filter--active" : ""
            }`}
            onClick={() => onFilterChange?.(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
};
