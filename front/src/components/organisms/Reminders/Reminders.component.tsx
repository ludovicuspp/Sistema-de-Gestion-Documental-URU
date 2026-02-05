import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import "./Reminders.css";

export interface RemindersProps {
  items: string[];
  onAddReminder?: () => void;
}

/**
 * Reminders - Organism
 *
 * Reminders block.
 */
export const Reminders = ({ items, onAddReminder }: RemindersProps) => (
  <Card variant="elevated" className="reminders">
    <h3 className="reminders__title">Recordatorios</h3>
    <ul className="reminders__list">
      {items.map((text, i) => (
        <li key={i} className="reminders__item">
          {text}
        </li>
      ))}
    </ul>
    <Button variant="primary" size="small" fullWidth onClick={onAddReminder} className="reminders__add">
      Añadir Recordatorio
    </Button>
  </Card>
);
