import "./Spinner.css";

export type SpinnerSize = "small" | "medium" | "large";

export interface SpinnerProps {
  /**
   * Spinner size
   * @default 'medium'
   */
  size?: SpinnerSize;
  /**
   * Spinner color
   * @default 'currentColor'
   */
  color?: string;
  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Spinner component - Atom
 *
 * Reusable, decoupled loading indicator.
 *
 * @example
 * ```tsx
 * <Spinner size="small" />
 * <Spinner size="large" color="#284483" />
 * ```
 */
export const Spinner = ({ size = "medium", color = "currentColor", className = "" }: SpinnerProps) => {
  const spinnerClasses = ["spinner", `spinner--${size}`, className].filter(Boolean).join(" ");

  return (
    <span className={spinnerClasses} aria-hidden="true" aria-label="Cargando...">
      <svg className="spinner__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color }}>
        <circle
          className="spinner__circle"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="32"
          strokeDashoffset="32">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite" />
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite" />
        </circle>
      </svg>
    </span>
  );
};
