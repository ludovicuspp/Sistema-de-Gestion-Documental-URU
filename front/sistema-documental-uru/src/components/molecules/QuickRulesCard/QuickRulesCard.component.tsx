import { Card } from "@/components/molecules/Card";
import "./QuickRulesCard.css";

export interface QuickRulesCardProps {
  title?: string;
  rules: string[];
}

/**
 * QuickRulesCard - Molecule
 *
 * Card with bullet list of quick rules (e.g. document management rules).
 */
export const QuickRulesCard = ({
  title = "Reglas rápidas",
  rules,
}: QuickRulesCardProps) => {
  return (
    <Card variant="elevated" className="quick-rules-card">
      <h3 className="quick-rules-card__title">{title}</h3>
      <ul className="quick-rules-card__list">
        {rules.map((rule, i) => (
          <li key={i} className="quick-rules-card__item">
            {rule}
          </li>
        ))}
      </ul>
    </Card>
  );
};
