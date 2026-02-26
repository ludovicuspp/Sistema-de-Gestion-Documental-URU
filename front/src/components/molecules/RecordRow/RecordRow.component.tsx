import { Button } from "@/components/atoms/Button";
import "./RecordRow.css";

export type RecordStatusType = "pending" | "approved" | "rejected" | "without-documents";

export interface RecordRowProps {
  id: string;
  name: string;
  ci: string;
  recordType: string;
  statusLabel: string;
  statusType?: RecordStatusType;
  onView?: (id: string) => void;
}

/**
 * RecordRow - Molecule
 *
 * Row for record/expedient list: name, CI, type, status and Ver button.
 */
export const RecordRow = ({
  id,
  name,
  ci,
  recordType,
  statusLabel,
  statusType = "pending",
  onView,
}: RecordRowProps) => (
  <div className="record-row">
    <div className="record-row__info">
      <span className="record-row__name">{name}</span>
      <span className="record-row__meta">
        {ci} · {recordType}
      </span>
    </div>
    <span className={`record-row__status record-row__status--${statusType}`}>{statusLabel}</span>
    <Button variant="outline" size="small" onClick={() => onView?.(id)} className="record-row__btn">
      Ver
    </Button>
  </div>
);
