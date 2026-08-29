import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import "./Reminders.css";

export interface RemindersProps {
  items: string[];
  onAddReminder?: () => void;
  /** Card title. Default: "Recordatorios". */
  title?: string;
  /** Add button label. Default: "Añadir Recordatorio". */
  addButtonText?: string;
}

/**
 * Reminders - Organism
 *
 * Reminders block. Title and add-button text can be overridden for i18n.
 */
export const Reminders = ({
  items,
  onAddReminder,
  title = "Recordatorios",
  addButtonText = "Añadir Recordatorio",
}: RemindersProps) => (
  <Card variant="elevated" className="reminders">
    <h3 className="reminders__title">{title}</h3>
    <ul className="reminders__list">
      {items.map((text, i) => (
        <li key={i} className="reminders__item">
          {text}
        </li>
      ))}
    </ul>
    <Button variant="primary" size="small" fullWidth onClick={onAddReminder} className="reminders__add">
      {addButtonText}
    </Button>
  </Card>
);
