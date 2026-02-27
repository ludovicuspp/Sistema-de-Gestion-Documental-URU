import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";
import "./AlertModal.css";

export type AlertType = "info" | "warning" | "error" | "success";

export interface AlertModalProps {
  /** Si es false, no se renderiza el modal. */
  open: boolean;
  /** Título del alert. */
  title: string;
  /** Mensaje o descripción. */
  message: string;
  /** Tipo de alerta: info, warning, error, success. Por defecto: warning. */
  type?: AlertType;
  /** Texto del botón. Por defecto: "Cerrar". */
  buttonLabel?: string;
  /** Llamado al cerrar (clic botón, fuera o Escape). */
  onClose: () => void;
  /** Contenido adicional (ej: lista de opciones). */
  children?: React.ReactNode;
  /** Acciones adicionales (ej: botón "Crear expediente"). */
  actions?: React.ReactNode;
}

/**
 * AlertModal - Molecule
 *
 * Modal de alerta/información simple y minimalista.
 * Caso de uso 02: "Estudiante no registrado", "Documento no disponible", "Sin expediente asociado", etc.
 */
export const AlertModal = ({
  open,
  title,
  message,
  type = "warning",
  buttonLabel = "Cerrar",
  onClose,
  children,
  actions,
}: AlertModalProps) => {
  const icon = type === "error" ? "" : "!";
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="default"
      size="md"
      hideHeader
    >
      <div className={`alert-modal alert-modal--${type}`}>
        <div className="alert-modal__icon">{icon}</div>
        <div className="alert-modal__content">
          <h3 className="alert-modal__title">{title}</h3>
          <p className="alert-modal__message">{message}</p>
          {children}
        </div>
      </div>
      <div className="alert-modal__footer">
        {actions}
        <Button variant="primary" size="medium" onClick={onClose} className="alert-modal__btn-close">
          {buttonLabel}
        </Button>
      </div>
    </Modal>
  );
};
