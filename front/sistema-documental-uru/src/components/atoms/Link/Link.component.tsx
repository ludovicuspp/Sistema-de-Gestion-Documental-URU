import { AnchorHTMLAttributes, forwardRef } from "react";
import "./link.css";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Variante visual del enlace
   * @default 'default'
   */
  variant?: "default" | "primary" | "secondary";
  /**
   * Si es true, el enlace se muestra como texto simple sin subrayado
   * @default false
   */
  underline?: boolean;
  /**
   * Contenido del enlace
   */
  children: React.ReactNode;
}

/**
 * Componente Link - Atom
 *
 * Enlace reutilizable y desacoplado.
 *
 * @example
 * ```tsx
 * <Link href="/forgot-password">Olvidé mi contraseña</Link>
 * <Link href="/register" variant="primary">Registrarse</Link>
 * ```
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = "default", underline = false, className = "", children, ...props }, ref) => {
    const linkClasses = ["link", `link--${variant}`, underline && "link--underline", className].filter(Boolean).join(" ");

    return (
      <a ref={ref} className={linkClasses} {...props}>
        {children}
      </a>
    );
  },
);

Link.displayName = "Link";
