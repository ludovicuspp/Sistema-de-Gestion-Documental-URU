import { Card } from "@/components/molecules/Card";
import "./QuickSummary.css";

export interface QuickSummaryItem {
  label: string;
  value: string | number;
}

export interface QuickSummaryProps {
  title?: string;
  subtitle?: string;
  items: QuickSummaryItem[];
}

/**
 * QuickSummary - Organism
 *
 * Quick summary (e.g. Today: new records, validated documents, etc.).
 */
export const QuickSummary = ({ title = "Resumen rápido", subtitle = "Hoy", items }: QuickSummaryProps) => (
  <Card variant="elevated" className="quick-summary">
    <div className="quick-summary__header">
      <h3 className="quick-summary__title">{title}</h3>
      <span className="quick-summary__subtitle">{subtitle}</span>
    </div>
    <div className="quick-summary__list">
      {items.map((item, i) => (
        <div key={i} className="quick-summary__row">
          <span className="quick-summary__label">{item.label}</span>
          <span className="quick-summary__value">{item.value}</span>
        </div>
      ))}
    </div>
  </Card>
);
