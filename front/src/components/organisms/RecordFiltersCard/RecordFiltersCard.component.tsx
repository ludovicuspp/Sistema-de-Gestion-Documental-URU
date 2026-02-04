import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import "./RecordFiltersCard.css";

export type RecordFilterTab = "pending" | "approved" | "rejected" | "no-documents";

export interface RecordFiltersCardProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  activeTab?: RecordFilterTab;
  onTabChange?: (tab: RecordFilterTab) => void;
  onCreateRecord?: () => void;
}

const TABS: { key: RecordFilterTab; label: string }[] = [
  { key: "pending", label: "Pendiente" },
  { key: "approved", label: "Aprobado" },
  { key: "rejected", label: "Rechazado" },
  { key: "no-documents", label: "Sin documentos" },
];

/**
 * RecordFiltersCard - Organism
 *
 * Record filters: search student, Create record button, status filter tabs.
 */
export const RecordFiltersCard = ({
  searchValue = "",
  onSearchChange,
  activeTab = "pending",
  onTabChange,
  onCreateRecord,
}: RecordFiltersCardProps) => (
  <Card variant="elevated" className="record-filters-card">
    <div className="record-filters-card__row">
      <div className="record-filters-card__search">
        <Input
          placeholder="Por cédula o nombre"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          fullWidth
          size="small"
        />
      </div>
      <Button variant="primary" size="small" onClick={onCreateRecord} className="record-filters-card__create">
        Nuevo Expediente
      </Button>
    </div>
    <div className="record-filters-card__tabs" role="tablist">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={activeTab === key}
          className={`record-filters-card__tab ${activeTab === key ? "record-filters-card__tab--active" : ""}`}
          onClick={() => onTabChange?.(key)}
        >
          {label}
        </button>
      ))}
    </div>
  </Card>
);
