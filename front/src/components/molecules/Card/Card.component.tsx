import "./Card.css";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Variante visual (default | elevated | outline)
   * @default 'default'
   */
  variant?: "default" | "elevated" | "outline";
}

/**
 * Card - Molecule
 *
 * Contenedor reutilizable para secciones del dashboard.
 * Combina estructura básica con variantes de estilo.
 */
export const Card = ({ children, className = "", variant = "default" }: CardProps) => {
  const classes = ["card", `card--${variant}`, className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
};
