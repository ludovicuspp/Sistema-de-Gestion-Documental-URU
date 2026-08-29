import { Button } from "@/components/atoms/Button";
import "./VerificationItemRow.css";

export interface VerificationItemRowProps {
  id: string;
  name: string;
  details: string;
  date: string;
  missingCount: number;
  urgent?: boolean;
  onOpen?: (id: string) => void;
}

/**
 * VerificationItemRow - Molecule
 *
 * Row for verification inbox: name, details, date, missing count, optional urgent tag, Open button.
 */
const getMissingBadgeVariant = (count: number): "complete" | "warning" | "danger" => {
  if (count === 0) return "complete";
  if (count === 1) return "warning";
  return "danger";
};

export const VerificationItemRow = ({
  id,
  name,
  details,
  date,
  missingCount,
  urgent,
  onOpen,
}: VerificationItemRowProps) => {
  const badgeVariant = getMissingBadgeVariant(missingCount);

  return (
    <div className="verification-item-row">
      <div className="verification-item-row__info">
        <div className="verification-item-row__header">
          <span className="verification-item-row__name">{name}</span>
          {urgent && <span className="verification-item-row__urgent">URGENT</span>}
        </div>
        <span className="verification-item-row__details">{details}</span>
      </div>
      <span className="verification-item-row__date">{date}</span>
      <span
        className={`verification-item-row__missing verification-item-row__missing--${badgeVariant}`}
        title="Documentos faltantes"
      >
        {missingCount} faltan
      </span>
      <Button variant="primary" size="small" onClick={() => onOpen?.(id)} className="verification-item-row__btn">
        Abrir
      </Button>
    </div>
  );
};
