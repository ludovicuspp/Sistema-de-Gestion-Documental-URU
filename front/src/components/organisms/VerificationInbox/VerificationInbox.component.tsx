import { useState } from "react";
import { Card } from "@/components/molecules/Card";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { VerificationItemRow } from "@/components/molecules/VerificationItemRow";
import "./VerificationInbox.css";

export interface VerificationInboxItem {
  id: string;
  name: string;
  details: string;
  date: string;
  missingCount: number;
  urgent?: boolean;
}

export interface VerificationInboxProps {
  title?: string;
  pendingCount?: number;
  approvedToday?: string | number;
  avgValidationTime?: string | number;
  items: VerificationInboxItem[];
  onBack?: () => void;
  onSearch?: (query: string) => void;
  onFilterType?: () => void;
  onFilterUploader?: () => void;
  onExport?: () => void;
  onOpen?: (id: string) => void;
}

type FilterType = "all" | "uploader";

/**
 * VerificationInbox - Organism
 *
 * Bandeja de verificación: back, stats, search, filters, list of verification items.
 */
export const VerificationInbox = ({
  title = "Bandeja de verificación",
  pendingCount = 0,
  approvedToday = "—",
  avgValidationTime = "—",
  items,
  onBack,
  onSearch,
  onFilterType,
  onFilterUploader,
  onExport,
  onOpen,
}: VerificationInboxProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const handleFilterType = () => {
    setActiveFilter("all");
    onFilterType?.();
  };

  const handleFilterUploader = () => {
    setActiveFilter("uploader");
    onFilterUploader?.();
  };

  return (
    <Card variant="elevated" className="verification-inbox">
      <div className="verification-inbox__header">
        <h3 className="verification-inbox__title">{title}</h3>
        {onBack && (
          <Button variant="ghost" size="small" onClick={onBack} className="verification-inbox__back">
            ← Volver
          </Button>
        )}
      </div>
      <div className="verification-inbox__stats">
        <div className="verification-inbox__stat-card verification-inbox__stat-card--highlight">
          <span className="verification-inbox__stat-value">{pendingCount}</span>
          <span className="verification-inbox__stat-label">Pendientes</span>
        </div>
        <div className="verification-inbox__stat-card">
          <span className="verification-inbox__stat-value">{String(approvedToday)}</span>
          <span className="verification-inbox__stat-label">Aprobados hoy</span>
        </div>
        <div className="verification-inbox__stat-card">
          <span className="verification-inbox__stat-value">{String(avgValidationTime)}</span>
          <span className="verification-inbox__stat-label">T. medio validación</span>
        </div>
      </div>
      <div className="verification-inbox__toolbar">
        <div className="verification-inbox__search-wrap">
          <Input
            placeholder="Buscar por cédula o nombre"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              onSearch?.(e.target.value);
            }}
            fullWidth
          />
        </div>
        <div className="verification-inbox__filters">
          <Button
            variant={activeFilter === "all" ? "primary" : "outline"}
            size="small"
            onClick={handleFilterType}
          >
            Todos los tipos
          </Button>
          <Button
            variant={activeFilter === "uploader" ? "primary" : "outline"}
            size="small"
            onClick={handleFilterUploader}
          >
            Cargador
          </Button>
        </div>
        <Button variant="outline" size="small" onClick={onExport}>
          Exportar
        </Button>
      </div>
      <div className="verification-inbox__list">
        {items.length === 0 ? (
          <p className="verification-inbox__empty">No hay elementos para mostrar.</p>
        ) : (
          items.map((item) => (
            <VerificationItemRow
              key={item.id}
              id={item.id}
              name={item.name}
              details={item.details}
              date={item.date}
              missingCount={item.missingCount}
              urgent={item.urgent}
              onOpen={onOpen}
            />
          ))
        )}
      </div>
    </Card>
  );
};
