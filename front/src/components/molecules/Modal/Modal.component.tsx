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
  /** Variante visual: default (fondo oscuro) o form (fondo azul, borde azul). */
  variant?: "default" | "form";
  /** Etiqueta gris en la esquina superior izquierda del overlay (solo con variant="form"). */
  label?: string;
  /** Contenido custom del header (reemplaza title si se usa). Ej: botón Cerrar. */
  headerContent?: React.ReactNode;
  /** Contenido del footer. Ej: botón Aplicar cambios. */
  footerContent?: React.ReactNode;
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
  variant = "default",
  label,
  headerContent,
  footerContent,
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

  const hasHeader = headerContent ?? title ?? label;
  const backdropClass = [
    "modal__backdrop",
    variant === "form" && "modal__backdrop--form",
  ]
    .filter(Boolean)
    .join(" ");
  const boxClass = [
    "modal__box",
    `modal__box--${size}`,
    variant === "form" && "modal__box--form",
  ]
    .filter(Boolean)
    .join(" ");

  const modal = (
    <div
      className={backdropClass}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={label ? "modal-label" : title ? "modal-title" : undefined}
    >
      {label && (
        <span id="modal-label" className="modal__label">
          {label}
        </span>
      )}
      <div className={boxClass} onClick={(e) => e.stopPropagation()}>
        {hasHeader && (
          <div className={variant === "form" ? "modal__header modal__header--form" : "modal__header"}>
            {variant === "form" ? (
              <>
                {(title ?? label) && (
                  <h2 id="modal-title" className="modal__title">
                    {title ?? label}
                  </h2>
                )}
                {headerContent}
              </>
            ) : (
              headerContent ?? (title && (
                <h2 id="modal-title" className="modal__title">
                  {title}
                </h2>
              ))
            )}
          </div>
        )}
        <div className="modal__body">{children}</div>
        {footerContent && <div className="modal__footer">{footerContent}</div>}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
