import "./footer.css";

export interface FooterProps {
  /**
   * Callback cuando se hace clic en Privacy & Terms
   */
  onPrivacyClick?: () => void;
}

/**
 * Componente Footer - Organism
 *
 * Barra inferior con branding y enlaces legales.
 *
 * @example
 * ```tsx
 * <Footer onPrivacyClick={() => navigate('/privacy')} />
 * ```
 */
export const Footer = ({ onPrivacyClick }: FooterProps) => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <span className="footer__text">UNIVERSIDAD RAFAEL URDANETA - SISTEMA DOCUMENTAL DE EXPEDIENTES</span>
        <button className="footer__privacy-link" onClick={onPrivacyClick} type="button">
          Privacy & Terms
        </button>
      </div>
    </footer>
  );
};
