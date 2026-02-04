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
  subtitle?: string;
  onViewAll?: () => void;
}

/**
 * RecentActivity - Organism
 *
 * Recent activity block (action log).
 */
export const RecentActivity = ({ entries, subtitle, onViewAll }: RecentActivityProps) => (
  <Card variant="elevated" className="recent-activity">
    <div className="recent-activity__header">
      <div>
        <h3 className="recent-activity__title">Actividad reciente</h3>
        {subtitle && <p className="recent-activity__subtitle">{subtitle}</p>}
      </div>
      <Link href="#" onClick={(e) => { e.preventDefault(); onViewAll?.(); }} className="recent-activity__link">
        Ver todo
      </Link>
    </div>
    <div className="recent-activity__list">
      {entries.map((e, i) => (
        <ActivityLogItem key={i} text={e.text} datetime={e.datetime} />
      ))}
    </div>
  </Card>
);
