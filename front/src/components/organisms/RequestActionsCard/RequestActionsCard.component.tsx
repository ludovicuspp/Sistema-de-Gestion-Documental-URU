import { useState } from "react";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import "./RequestActionsCard.css";

const MAX_CHARS = 200;

export interface RequestActionsCardProps {
  onSaveNote?: (note: string) => void;
  onClear?: () => void;
  /** Si es true, muestra confirmación antes de guardar (ej. vista verificador). */
  confirmBeforeSave?: boolean;
  /** Mensaje de la confirmación. Por defecto: "¿Desea guardar la nota?" */
  confirmSaveMessage?: string;
}

/**
 * RequestActionsCard - Organism
 *
 * Actions and status panel with administrative observations textarea.
 */
export const RequestActionsCard = ({
  onSaveNote,
  onClear,
  confirmBeforeSave = false,
  confirmSaveMessage = "¿Desea guardar la nota?",
}: RequestActionsCardProps) => {
  const [note, setNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const charCount = note.length;
  const isAtLimit = charCount >= MAX_CHARS;
  const isNearLimit = charCount >= MAX_CHARS * 0.8 && charCount < MAX_CHARS;

  const handleClear = () => {
    setNote("");
    onClear?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setNote(value);
    }
  };

  const performSaveNote = () => {
    const text = note.trim();
    if (text) {
      onSaveNote?.(text);
      setNote("");
    }
    setShowConfirmModal(false);
  };

  const handleSaveNote = () => {
    if (note.length >= MAX_CHARS) {
      alert(`Ha superado el límite de caracteres permitidos (${MAX_CHARS}). Por favor, reduzca el texto antes de guardar.`);
      return;
    }
    if (note.trim()) {
      if (confirmBeforeSave) {
        setShowConfirmModal(true);
        return;
      }
      performSaveNote();
    }
  };

  const counterClass = [
    "request-actions-card__counter",
    isAtLimit && "request-actions-card__counter--error",
    isNearLimit && !isAtLimit && "request-actions-card__counter--warning",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card variant="elevated" className="request-actions-card">
      <h2 className="request-actions-card__title">Acciones y estado</h2>
      <div className="request-actions-card__section">
        <h3 className="request-actions-card__section-title">Observaciones administrativas</h3>
        <div className="request-actions-card__textarea-wrapper">
          <textarea
            className="request-actions-card__textarea"
            placeholder="Escribe tus observaciones aquí..."
            value={note}
            onChange={handleChange}
            maxLength={MAX_CHARS}
            rows={10}
          />
          <span className={counterClass}>{charCount}/{MAX_CHARS}</span>
        </div>
        <div className="request-actions-card__actions">
          <Button variant="outline" size="small" onClick={handleClear}>
            Limpiar
          </Button>
          <Button variant="primary" size="small" onClick={handleSaveNote}>
            Guardar nota
          </Button>
        </div>
      </div>
      {confirmBeforeSave && (
        <ConfirmModal
          open={showConfirmModal}
          title="Guardar nota"
          message={confirmSaveMessage}
          confirmLabel="Sí, guardar"
          cancelLabel="No"
          onConfirm={performSaveNote}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </Card>
  );
};
