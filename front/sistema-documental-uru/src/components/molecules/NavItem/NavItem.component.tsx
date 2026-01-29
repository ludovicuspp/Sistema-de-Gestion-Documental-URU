import "./NavItem.css";

export interface NavItemProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

/**
 * NavItem - Molecule
 *
 * Ítem de navegación para sidebar (icono + texto).
 * Soporta modo botón o enlace.
 */
export const NavItem = ({ label, icon, active = false, onClick, href }: NavItemProps) => {
  const classes = ["nav-item", active && "nav-item--active"].filter(Boolean).join(" ");

  const content = (
    <>
      {icon && <span className="nav-item__icon" aria-hidden="true">{icon}</span>}
      <span className="nav-item__label">{label}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  );
};
