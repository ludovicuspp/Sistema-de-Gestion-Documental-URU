import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import "./QuickAccess.css";

export interface QuickAccessItem {
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

export interface QuickAccessProps {
  items: QuickAccessItem[];
  /** Card title. Default: "Accesos rápidos". */
  title?: string;
}

/**
 * QuickAccess - Organism
 *
 * Quick access block. Title can be overridden for i18n.
 */
export const QuickAccess = ({ items, title = "Accesos rápidos" }: QuickAccessProps) => (
  <Card variant="elevated" className="quick-access">
    <h3 className="quick-access__title">{title}</h3>
    <div className="quick-access__list">
      {items.map((item, i) =>
        item.primary ? (
          <Button key={i} variant="primary" size="small" fullWidth onClick={item.onClick}>
            {item.label}
          </Button>
        ) : item.href ? (
          <Link key={i} href={item.href} className="quick-access__link">
            {item.label}
          </Link>
        ) : (
          <button key={i} type="button" className="quick-access__btn" onClick={item.onClick}>
            {item.label}
          </button>
        ),
      )}
    </div>
  </Card>
);
