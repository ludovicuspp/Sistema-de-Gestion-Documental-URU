import { type AnchorHTMLAttributes, forwardRef } from "react";
import "./Link.css";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Link visual variant
   * @default 'default'
   */
  variant?: "default" | "primary" | "secondary";
  /**
   * If true, link is shown as plain text without underline
   * @default false
   */
  underline?: boolean;
  /**
   * Link content
   */
  children: React.ReactNode;
}

/**
 * Link component - Atom
 *
 * Reusable, decoupled link.
 *
 * @example
 * ```tsx
 * <Link href="/forgot-password">Forgot password</Link>
 * <Link href="/register" variant="primary">Register</Link>
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
