import { useState } from "react";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import "./RequestActionsCard.css";

export interface RequestActionsCardProps {
  onSaveNote?: (note: string) => void;
  onClear?: () => void;
}

/**
 * RequestActionsCard - Organism
 *
 * Actions and status panel with administrative observations textarea.
 */
export const RequestActionsCard = ({ onSaveNote, onClear }: RequestActionsCardProps) => {
  const [note, setNote] = useState("");

  const handleClear = () => {
    setNote("");
    onClear?.();
  };

  const handleSaveNote = () => {
    if (note.trim()) {
      onSaveNote?.(note.trim());
      setNote("");
    }
  };

  return (
    <Card variant="elevated" className="request-actions-card">
      <h2 className="request-actions-card__title">Acciones y estado</h2>
      <div className="request-actions-card__section">
        <h3 className="request-actions-card__section-title">Observaciones administrativas</h3>
        <textarea
          className="request-actions-card__textarea"
          placeholder="Escribe tus observaciones aquí..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={10}
        />
        <div className="request-actions-card__actions">
          <Button variant="outline" size="small" onClick={handleClear}>
            Limpiar
          </Button>
          <Button variant="primary" size="small" onClick={handleSaveNote}>
            Guardar nota
          </Button>
        </div>
      </div>
    </Card>
  );
};
