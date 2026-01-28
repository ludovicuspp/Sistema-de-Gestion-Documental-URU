import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import backgroundImage from "@/assets/img/uru-background.jpg";
import "./authtemplate.css";

export interface AuthTemplateProps {
  /**
   * Contenido principal del template (normalmente un formulario de autenticación)
   */
  children: React.ReactNode;
  /**
   * Callback cuando se hace clic en el icono de usuario del header
   */
  onUserClick?: () => void;
  /**
   * Callback cuando se hace clic en el icono de configuración del header
   */
  onSettingsClick?: () => void;
  /**
   * Callback cuando se hace clic en el icono de ayuda del header
   */
  onHelpClick?: () => void;
  /**
   * Callback cuando se hace clic en Privacy & Terms del footer
   */
  onPrivacyClick?: () => void;
}

/**
 * Componente AuthTemplate - Template
 *
 * Layout para páginas de autenticación con header, contenido centrado y footer.
 * Incluye fondo con imagen borrosa y branding de URU.
 *
 * @example
 * ```tsx
 * <AuthTemplate>
 *   <LoginForm onSubmit={handleLogin} />
 * </AuthTemplate>
 * ```
 */
export const AuthTemplate = ({ children, onUserClick, onSettingsClick, onHelpClick, onPrivacyClick }: AuthTemplateProps) => {
  return (
    <div className="auth-template">
      <Header onUserClick={onUserClick} onSettingsClick={onSettingsClick} onHelpClick={onHelpClick} />
      <main className="auth-template__main-content" style={{ "--background-image": `url(${backgroundImage})` } as React.CSSProperties}>
        <div className="auth-template__content-wrapper">{children}</div>
      </main>
      <Footer onPrivacyClick={onPrivacyClick} />
    </div>
  );
};
