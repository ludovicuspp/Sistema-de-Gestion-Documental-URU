import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";
import "./ConfirmModal.css";

export interface ConfirmModalProps {
  /** Si es false, no se renderiza el modal. */
  open: boolean;
  /** Título del modal. */
  title?: string;
  /** Mensaje o pregunta a mostrar. */
  message: string;
  /** Texto del botón de confirmar. Por defecto: "Sí". */
  confirmLabel?: string;
  /** Texto del botón de cancelar. Por defecto: "No". */
  cancelLabel?: string;
  /** Llamado al confirmar. */
  onConfirm: () => void;
  /** Llamado al cancelar o cerrar. */
  onCancel: () => void;
}

/**
 * ConfirmModal - Molecule
 *
 * Modal de confirmación con mensaje y botones Sí / No.
 * Usa el Modal reutilizable internamente.
 */
export const ConfirmModal = ({
  open,
  title = "Confirmar",
  message,
  confirmLabel = "Sí",
  cancelLabel = "No",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <Modal open={open} onClose={onCancel} title={title} size="sm">
    <p className="confirm-modal__message" id="confirm-modal-message">
      {message}
    </p>
    <div className="confirm-modal__actions">
      <Button variant="outline" size="medium" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button variant="primary" size="medium" onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);
