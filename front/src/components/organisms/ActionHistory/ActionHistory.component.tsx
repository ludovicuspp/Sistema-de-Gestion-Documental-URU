import { Card } from "@/components/molecules/Card";
import "./ActionHistory.css";

export interface ActionHistoryProps {
  items?: { id: string; action: string; date: string }[];
}

/**
 * ActionHistory - Organism
 *
 * User action history section (read-only).
 */
export const ActionHistory = ({ items = [] }: ActionHistoryProps) => {
  return (
    <Card variant="elevated" className="action-history">
      <h2 className="action-history__title">Historial de acciones</h2>
      <p className="action-history__subtitle">Últimas acciones del usuario (solo lectura)</p>
      <div className="action-history__content">
        {items.length === 0 ? (
          <p className="action-history__empty">No hay acciones registradas.</p>
        ) : (
          <ul className="action-history__list">
            {items.map((item) => (
              <li key={item.id} className="action-history__item">
                <span className="action-history__action">{item.action}</span>
                <span className="action-history__date">{item.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};
