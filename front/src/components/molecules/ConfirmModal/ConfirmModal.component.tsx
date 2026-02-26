import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";
import "./ConfirmModal.css";

export interface ConfirmModalProps {
  /** Si es false, no se renderiza el modal. */
  open: boolean;
  /** Etiqueta gris en esquina superior izquierda (ej: "Eliminar", "aprobar", "Rechazar"). */
  label: string;
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
 * Modal de confirmación usando la misma fórmula que los modals:
 * variant form, label gris en esquina superior izquierda, botones Sí (morado claro) / No (azul oscuro).
 */
export const ConfirmModal = ({
  open,
  label,
  message,
  confirmLabel = "Sí",
  cancelLabel = "No",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <Modal
    open={open}
    onClose={onCancel}
    variant="form"
    label={label}
    size="sm"
    hideHeader
    footerContent={
      <div className="confirm-modal__actions">
        <Button
          variant="secondary"
          size="medium"
          onClick={onConfirm}
          className="confirm-modal__btn-yes"
        >
          {confirmLabel}
        </Button>
        <Button variant="primary" size="medium" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    }
  >
    <p className="confirm-modal__message" id="confirm-modal-message">
      {message}
    </p>
  </Modal>
);
