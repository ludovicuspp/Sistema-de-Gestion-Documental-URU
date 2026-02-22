import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { LoginForm } from "@/components/molecules/LoginForm";

/**
 * Login page (Auth).
 *
 * Full login page that integrates the auth template with the login form
 * and handles authentication logic.
 */
export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement real authentication logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email && password) {
        console.log("Login attempt:", { email, password });
        // navigate('/admin');
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Por favor, intente nuevamente.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = () => console.log("User icon clicked");
  const handleSettingsClick = () => console.log("Settings icon clicked");
  const handleHelpClick = () => console.log("Help icon clicked");
  const handlePrivacyClick = () => console.log("Privacy & Terms clicked");

  return (
    <AuthTemplate
      onUserClick={handleUserClick}
      onSettingsClick={handleSettingsClick}
      onHelpClick={handleHelpClick}
      onPrivacyClick={handlePrivacyClick}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/admin" style={{ fontSize: "0.875rem", color: "#284483" }}>
            Ir al panel admin (demo)
          </Link>
          <Link to="/verifier" style={{ fontSize: "0.875rem", color: "#284483" }}>
            Ir al panel verificador (demo)
          </Link>
          <Link to="/assistant" style={{ fontSize: "0.875rem", color: "#284483" }}>
            Ir al panel asistente (demo)
          </Link>
        </div>
      </div>
    </AuthTemplate>
  );
};
