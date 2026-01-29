import { NavLink } from "react-router-dom";
import "./NavItem.css";

export interface NavItemProps {
  label: string;
  icon?: React.ReactNode;
  /** When using `to`, active state comes from the route. */
  active?: boolean;
  onClick?: () => void;
  href?: string;
  /** React Router path; uses NavLink when set. */
  to?: string;
}

/**
 * NavItem - Molecule
 *
 * Sidebar nav item (icon + label). Supports link, router link, or button.
 */
export const NavItem = ({ label, icon, active = false, onClick, href, to }: NavItemProps) => {
  const content = (
    <>
      {icon && <span className="nav-item__icon" aria-hidden="true">{icon}</span>}
      <span className="nav-item__label">{label}</span>
    </>
  );

  if (to != null) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          ["nav-item", (isActive || active) && "nav-item--active"].filter(Boolean).join(" ")
        }
        end={false}
      >
        {content}
      </NavLink>
    );
  }

  const classes = ["nav-item", active && "nav-item--active"].filter(Boolean).join(" ");
  if (href) {
    return <a href={href} className={classes}>{content}</a>;
  }
  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  );
};
