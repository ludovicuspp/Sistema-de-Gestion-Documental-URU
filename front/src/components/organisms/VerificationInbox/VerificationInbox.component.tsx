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

  return (
    <Card variant="elevated" className="verification-inbox">
      <div className="verification-inbox__header">
        {onBack && (
          <Button variant="ghost" size="small" onClick={onBack} className="verification-inbox__back">
            ← Volver
          </Button>
        )}
        <h3 className="verification-inbox__title">{title}</h3>
      </div>
      <div className="verification-inbox__stats">
        <span className="verification-inbox__stat verification-inbox__stat--highlight">
          {pendingCount} Pendientes
        </span>
        <span className="verification-inbox__stat">Aprobados hoy: {String(approvedToday)}</span>
        <span className="verification-inbox__stat">T. medio validación: {String(avgValidationTime)}</span>
      </div>
      <div className="verification-inbox__search-row">
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
        <Button variant="outline" size="small" onClick={onFilterType}>
          Todos los tipos
        </Button>
        <Button variant="primary" size="small" onClick={onFilterUploader}>
          Cargador
        </Button>
      </div>
      <div className="verification-inbox__actions">
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
