import "./Header.css";

export interface HeaderProps {
  /**
   * Callback when the user icon is clicked
   */
  onUserClick?: () => void;
  /**
   * Callback when the settings icon is clicked
   */
  onSettingsClick?: () => void;
  /**
   * Callback when the help icon is clicked
   */
  onHelpClick?: () => void;
}

// Iconos definidos fuera del componente para evitar recrearlos en cada render
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/**
 * Componente Header - Organism
 *
 * Barra superior con branding y iconos de navegación.
 *
 * @example
 * ```tsx
 * <Header
 *   onUserClick={() => navigate('/profile')}
 *   onSettingsClick={() => navigate('/settings')}
 *   onHelpClick={() => openHelp()}
 * />
 * ```
 */
export const Header = ({ onUserClick, onSettingsClick, onHelpClick }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__branding">
          <span className="header__brand-abbr">URU</span>
          <span className="header__separator">|</span>
          <span className="header__brand-text">SISTEMA DOCUMENTAL DE EXPEDIENTES</span>
        </div>
        <div className="header__actions">
          <button className="header__icon-button" onClick={onUserClick} aria-label="Usuario" type="button">
            <UserIcon />
            <span className="header__icon-text">User</span>
          </button>
          <button className="header__icon-button" onClick={onSettingsClick} aria-label="Configuración" type="button">
            <SettingsIcon />
          </button>
          <button className="header__icon-button" onClick={onHelpClick} aria-label="Ayuda" type="button">
            <HelpIcon />
          </button>
        </div>
      </div>
    </header>
  );
};
