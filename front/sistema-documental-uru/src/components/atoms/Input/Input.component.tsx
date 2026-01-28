import { InputHTMLAttributes, forwardRef } from "react";
import "./input.css";

export type InputSize = "small" | "medium" | "large";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Tamaño del input
   * @default 'medium'
   */
  size?: InputSize;
  /**
   * Si es true, muestra un estado de error
   * @default false
   */
  error?: boolean;
  /**
   * Mensaje de error a mostrar
   */
  errorMessage?: string;
  /**
   * Si es true, el input ocupa todo el ancho disponible
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Icono que se muestra al inicio del input
   */
  startIcon?: React.ReactNode;
  /**
   * Icono que se muestra al final del input
   */
  endIcon?: React.ReactNode;
  /**
   * Label del input (para accesibilidad)
   */
  label?: string;
}

/**
 * Componente Input - Atom
 *
 * Campo de entrada reutilizable y desacoplado.
 * Soporta diferentes tamaños, estados de error, iconos y personalización completa.
 *
 * @example
 * ```tsx
 * <Input placeholder="Email / Usuario" />
 * <Input type="password" endIcon={<EyeIcon />} />
 * <Input error errorMessage="Campo requerido" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = "medium", error = false, errorMessage, fullWidth = false, startIcon, endIcon, label, className = "", ...props }, ref) => {
    const inputClasses = [
      "input",
      `input--${size}`,
      error && "input--error",
      fullWidth && "input--fullWidth",
      startIcon && "input--with-start-icon",
      endIcon && "input--with-end-icon",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="input-wrapper">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="input-container">
          {startIcon && (
            <span className="input__start-icon" aria-hidden="true">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={error}
            aria-describedby={error && errorMessage ? `${inputId}-error` : undefined}
            {...props}
          />
          {endIcon && (
            <span className="input__end-icon" aria-hidden="true">
              {endIcon}
            </span>
          )}
        </div>
        {error && errorMessage && (
          <span id={`${inputId}-error`} className="input__error-message" role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
