import { SummaryCard } from "@/components/molecules/SummaryCard";
import "./KPICards.css";

export interface KPIData {
  value: string | number;
  label: string;
  subtitle?: string;
}

export interface KPICardsProps {
  items: KPIData[];
}

/**
 * KPICards - Organism
 *
 * KPI cards block (indicators summary).
 */
export const KPICards = ({ items }: KPICardsProps) => (
  <div className="kpi-cards">
    {items.map((item, i) => (
      <SummaryCard key={i} value={item.value} label={item.label} subtitle={item.subtitle} />
    ))}
  </div>
);
