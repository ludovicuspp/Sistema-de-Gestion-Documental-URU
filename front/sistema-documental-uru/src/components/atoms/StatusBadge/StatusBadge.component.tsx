import "./StatusBadge.css";

export type StatusBadgeVariant = "pending" | "completed";

export interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  children: React.ReactNode;
  className?: string;
}

/**
 * StatusBadge - Atom
 *
 * Status pill (e.g. Pendiente, Finalizada).
 */
export const StatusBadge = ({ variant, children, className = "" }: StatusBadgeProps) => {
  const classes = ["status-badge", `status-badge--${variant}`, className].filter(Boolean).join(" ");
  return <span className={classes}>{children}</span>;
};
