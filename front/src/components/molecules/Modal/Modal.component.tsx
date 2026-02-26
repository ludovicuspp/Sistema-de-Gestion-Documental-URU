import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export interface ModalProps {
  /** Si es false, no se renderiza. */
  open: boolean;
  /** Llamado al cerrar (clic fuera, Escape o botón cerrar). */
  onClose: () => void;
  /** Título opcional en la parte superior del modal. */
  title?: string;
  /** Tamaño del cuadro: sm (320px), md (480px), lg (560px). Por defecto: md. */
  size?: "sm" | "md" | "lg";
  /** Contenido del modal. */
  children: React.ReactNode;
}

/**
 * Modal - Molecule
 *
 * Modal reutilizable: fondo oscuro, cuadro centrado, cierra con Escape o clic fuera.
 * Úsalo en cualquier vista para mostrar formularios, confirmaciones o contenido custom.
 */
export const Modal = ({
  open,
  onClose,
  title,
  size = "md",
  children,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const modal = (
    <div
      className="modal__backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`modal__box modal__box--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal__header">
            <h2 id="modal-title" className="modal__title">
              {title}
            </h2>
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
