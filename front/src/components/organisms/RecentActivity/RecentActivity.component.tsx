import { Card } from "@/components/molecules/Card";
import { ActivityLogItem } from "@/components/molecules/ActivityLogItem";
import { Link } from "@/components/atoms/Link";
import "./RecentActivity.css";

export interface ActivityEntry {
  text: string;
  datetime: string;
}

export interface RecentActivityProps {
  entries: ActivityEntry[];
  title?: string;
  subtitle?: string;
  linkText?: string;
  onViewAll?: () => void;
}

/**
 * RecentActivity - Organism
 *
 * Recent activity block (action log). Optional title for reuse as "Historial / Observaciones".
 */
export const RecentActivity = ({
  entries,
  title = "Actividad reciente",
  subtitle,
  linkText = "Ver todo",
  onViewAll,
}: RecentActivityProps) => (
  <Card variant="elevated" className="recent-activity">
    <div className="recent-activity__header">
      <div>
        <h3 className="recent-activity__title">{title}</h3>
        {subtitle && <p className="recent-activity__subtitle">{subtitle}</p>}
      </div>
      <Link href="#" onClick={(e) => { e.preventDefault(); onViewAll?.(); }} className="recent-activity__link">
        {linkText}
      </Link>
    </div>
    <div className="recent-activity__list">
      {entries.map((e, i) => (
        <ActivityLogItem key={i} text={e.text} datetime={e.datetime} />
      ))}
    </div>
  </Card>
);
