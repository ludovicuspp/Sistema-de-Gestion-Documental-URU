import { Link } from "react-router-dom";
import { Button } from "@/components/atoms/Button";
import "./AdminHeader.css";

export interface AdminHeaderProps {
  currentView?: string;
  userRole?: string;
  userEmail?: string;
  /** Logout button label. Default: "Cerrar sesión". */
  logoutButtonText?: string;
  onLogout?: () => void;
}

/**
 * AdminHeader - Organism
 *
 * Admin panel header: URU logo, system title, current view, role+email and logout button.
 */
export const AdminHeader = ({
  currentView = "Panel principal",
  userRole = "Administrador",
  userEmail = "username@mail.co",
  logoutButtonText = "Cerrar sesión",
  onLogout,
}: AdminHeaderProps) => {
  return (
    <header className="admin-header">
      <div className="admin-header__main">
        <div className="admin-header__branding">
          <Link to="/admin" className="admin-header__logo">
            URU Universidad Rafael Urdaneta
          </Link>
          <span className="admin-header__system">SISTEMA DOCUMENTAL DE EXPEDIENTES</span>
          <span className="admin-header__separator">|</span>
          <span className="admin-header__view">{currentView}</span>
        </div>
        <div className="admin-header__user">
          <div className="admin-header__user-info">
            <span className="admin-header__role">{userRole}</span>
            <span className="admin-header__email">{userEmail}</span>
          </div>
          <Button variant="primary" size="small" onClick={onLogout} className="admin-header__logout">
            {logoutButtonText}
          </Button>
        </div>
      </div>
    </header>
  );
};
