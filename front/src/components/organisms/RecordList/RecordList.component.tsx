import { Card } from "@/components/molecules/Card";
import { RecordRow } from "@/components/molecules/RecordRow";
import type { RecordStatusType } from "@/components/molecules/RecordRow";
import "./RecordList.css";

export interface RecordListItem {
  id: string;
  name: string;
  ci: string;
  recordType: string;
  statusLabel: string;
  statusType?: RecordStatusType;
}

export interface RecordListProps {
  title?: string;
  records: RecordListItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

/**
 * RecordList - Organism
 *
 * List of expedients/records: click to select and view detail.
 */
export const RecordList = ({
  title = "Expedientes",
  records,
  selectedId,
  onSelect,
}: RecordListProps) => (
  <Card variant="elevated" className="record-list">
    <h3 className="record-list__title">{title}</h3>
    <div className="record-list__list">
      {records.length === 0 ? (
        <p className="record-list__empty">No hay expedientes para mostrar con este filtro.</p>
      ) : (
        records.map((r) => (
          <div
            key={r.id}
            className={`record-list__item ${selectedId === r.id ? "record-list__item--selected" : ""}`}
          >
            <RecordRow
              id={r.id}
              name={r.name}
              ci={r.ci}
              recordType={r.recordType}
              statusLabel={r.statusLabel}
              statusType={r.statusType}
              onView={onSelect}
            />
          </div>
        ))
      )}
    </div>
  </Card>
);
