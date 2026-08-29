import { Card } from "@/components/molecules/Card";
import "./IndicatorsStatusCard.css";

export interface IndicatorsStatusCardProps {
  title?: string;
  subtitle?: string;
  items: string[];
}

/**
 * IndicatorsStatusCard - Organism
 *
 * Single card: indicators, current status, 2x2 metrics grid.
 */
export const IndicatorsStatusCard = ({
  title = "Indicadores",
  subtitle = "Estado actual",
  items,
}: IndicatorsStatusCardProps) => (
  <Card variant="elevated" className="indicators-status-card">
    <h4 className="indicators-status-card__title">{title}</h4>
    <p className="indicators-status-card__subtitle">{subtitle}</p>
    <ul className="indicators-status-card__grid">
      {items.map((text, i) => (
        <li key={i}>{text}</li>
      ))}
    </ul>
  </Card>
);
