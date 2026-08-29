import { Card } from "@/components/molecules/Card";
import "./SummaryCard.css";

export interface SummaryCardProps {
  value: string | number;
  label: string;
  subtitle?: string;
}

/**
 * SummaryCard - Molecule
 *
 * Tarjeta KPI (valor + etiqueta + subtítulo opcional).
 */
export const SummaryCard = ({ value, label, subtitle }: SummaryCardProps) => (
  <Card variant="elevated" className="summary-card">
    <span className="summary-card__value">{value}</span>
    <span className="summary-card__label">{label}</span>
    {subtitle && <span className="summary-card__subtitle">{subtitle}</span>}
  </Card>
);
