import "./rolebadge.css";

export type RoleBadgeVariant = "administrador" | "verificador" | "asistente";

export interface RoleBadgeProps {
  variant: RoleBadgeVariant;
  children: React.ReactNode;
  className?: string;
}

/**
 * RoleBadge - Atom
 *
 * Badge para mostrar el rol del usuario (Administrador, Verificador, Asistente).
 */
export const RoleBadge = ({ variant, children, className = "" }: RoleBadgeProps) => {
  const classes = ["role-badge", `role-badge--${variant}`, className].filter(Boolean).join(" ");
  return <span className={classes}>{children}</span>;
};
