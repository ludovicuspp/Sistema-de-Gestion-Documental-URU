import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import "./RequestRow.css";

export type RequestStatus = "pending" | "validated" | "rejected";

export interface RequestRowProps {
  id: string;
  studentName: string;
  studentCI: string;
  level: string;
  date: string;
  status: RequestStatus;
  onOpen?: (id: string) => void;
}

const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pendiente",
  validated: "Validado",
  rejected: "Rechazado",
};

const STATUS_BADGE_VARIANTS: Record<RequestStatus, "pending" | "completed"> = {
  pending: "pending",
  validated: "completed",
  rejected: "pending",
};

/**
 * RequestRow - Molecule
 *
 * Row for request list: student name, CI, level, date, status badge, and Open button.
 */
export const RequestRow = ({
  id,
  studentName,
  studentCI,
  level,
  date,
  status,
  onOpen,
}: RequestRowProps) => {
  const badgeVariant = STATUS_BADGE_VARIANTS[status];

  return (
    <div className="request-row">
      <div className="request-row__info">
        <span className="request-row__name">{studentName}</span>
        <span className="request-row__meta">
          {studentCI} {level} · {date}
        </span>
      </div>
      <StatusBadge variant={badgeVariant} className="request-row__status">
        {STATUS_LABELS[status]}
      </StatusBadge>
      <Button variant="outline" size="small" onClick={() => onOpen?.(id)} className="request-row__btn-open">
        Abrir
      </Button>
    </div>
  );
};
