import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";
import "./FormModal.css";

export interface FormModalProps {
  /** Si es false, no se renderiza. */
  open: boolean;
  /** Llamado al cerrar (clic fuera, Escape o botón Cerrar). */
  onClose: () => void;
  /** Etiqueta en gris en la esquina superior izquierda del overlay (ej: "Editar/Crear tipo de doc"). */
  label: string;
  /** Tamaño del cuadro: sm (320px), md (480px), lg (560px). Por defecto: md. */
  size?: "sm" | "md" | "lg";
  /** Texto del botón principal. Por defecto: "Aplicar cambios". */
  submitLabel?: string;
  /** Llamado al pulsar "Aplicar cambios". */
  onSubmit: () => void;
  /** Contenido del formulario. */
  children: React.ReactNode;
}

/**
 * FormModal - Molecule
 *
 * Composición sobre Modal para formularios de edición/creación.
 * Usa Modal como base (Atomic Design).
 */
export const FormModal = ({
  open,
  onClose,
  label,
  size = "md",
  submitLabel = "Aplicar cambios",
  onSubmit,
  children,
}: FormModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    variant="form"
    label={label}
    size={size}
    headerContent={
      <Button
        variant="ghost"
        size="small"
        onClick={onClose}
        className="form-modal__close-btn"
      >
        Cerrar
      </Button>
    }
    footerContent={
      <Button variant="primary" size="medium" onClick={onSubmit}>
        {submitLabel}
      </Button>
    }
  >
    <div className="form-modal__body">{children}</div>
  </Modal>
);
