import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { Spinner } from "@/components/atoms/Spinner";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline" | "ghost";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante visual del botón
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Tamaño del botón
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * Si es true, el botón ocupa todo el ancho disponible
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Si es true, muestra un estado de carga
   * @default false
   */
  loading?: boolean;
  /**
   * Contenido del botón
   */
  children: React.ReactNode;
  /**
   * Icono que se muestra antes del texto
   */
  startIcon?: React.ReactNode;
  /**
   * Icono que se muestra después del texto
   */
  endIcon?: React.ReactNode;
}

/**
 * Componente Button - Atom
 *
 * Botón reutilizable y desacoplado que puede adaptarse a diferentes contextos.
 * Soporta múltiples variantes, tamaños, estados y personalización completa.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button variant="danger" size="small" loading={isLoading}>
 *   Delete
 * </Button>
 *
 * <Button variant="outline" startIcon={<Icon />} fullWidth>
 *   Submit
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "medium", fullWidth = false, loading = false, disabled, children, startIcon, endIcon, className = "", ...props },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const buttonClasses = [
      "button",
      `button--${variant}`,
      `button--${size}`,
      fullWidth && "button--fullWidth",
      loading && "button--loading",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type={props.type || "button"} className={buttonClasses} disabled={isDisabled} aria-busy={loading} {...props}>
        {loading && (
          <span className="button__spinner">
            <Spinner size={size === "small" ? "small" : size === "large" ? "large" : "medium"} />
          </span>
        )}
        {!loading && startIcon && (
          <span className="button__start-icon" aria-hidden="true">
            {startIcon}
          </span>
        )}
        <span className="button__content">{children}</span>
        {!loading && endIcon && (
          <span className="button__end-icon" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
