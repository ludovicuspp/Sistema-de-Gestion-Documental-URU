import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import "./ExpedientSelectCard.css";

export interface ExpedientSelectCardData {
  ci?: string;
  tipo?: string;
  cargado?: string;
  ubicacion?: string;
}

export interface ExpedientSelectCardProps {
  title?: string;
  expedient?: ExpedientSelectCardData | null;
  onMarkUrgent?: () => void;
}

const PLACEHOLDER = "—";

/**
 * ExpedientSelectCard - Organism
 *
 * Card to display selected expedient info (CI, Tipo, Cargado, Ubicación) and "Marcar urgente" action.
 */
export const ExpedientSelectCard = ({
  title = "Seleccione un expediente",
  expedient,
  onMarkUrgent,
}: ExpedientSelectCardProps) => {
  const data = expedient ?? {};
  const ci = data.ci ?? PLACEHOLDER;
  const tipo = data.tipo ?? PLACEHOLDER;
  const cargado = data.cargado ?? PLACEHOLDER;
  const ubicacion = data.ubicacion ?? PLACEHOLDER;

  return (
    <Card variant="elevated" className="expedient-select-card">
      <h3 className="expedient-select-card__title">{title}</h3>
      <div className="expedient-select-card__grid">
        <div className="expedient-select-card__row">
          <span className="expedient-select-card__label">CI:</span>
          <span className="expedient-select-card__value">{ci}</span>
        </div>
        <div className="expedient-select-card__row">
          <span className="expedient-select-card__label">Tipo:</span>
          <span className="expedient-select-card__value">{tipo}</span>
        </div>
        <div className="expedient-select-card__row">
          <span className="expedient-select-card__label">Cargado:</span>
          <span className="expedient-select-card__value">{cargado}</span>
        </div>
        <div className="expedient-select-card__row">
          <span className="expedient-select-card__label">Ubicación:</span>
          <span className="expedient-select-card__value">{ubicacion}</span>
        </div>
      </div>
      <div className="expedient-select-card__actions">
        <Button variant="secondary" size="small" onClick={onMarkUrgent}>
          Marcar urgente
        </Button>
      </div>
    </Card>
  );
};
