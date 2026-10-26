import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { LoginForm } from "@/components/molecules/LoginForm";
import { ApiError } from "@/services/api/http";
import { authService } from "@/services/api/authService";

const HOME_BY_ROLE: Record<string, string> = {
  Administrador: "/admin",
  Verificador: "/verifier",
  Asistente: "/assistant",
  Estudiante: "/solicitud-expediente",
};

/**
 * Login page (Auth). CU-01.
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await authService.login(email, password);
      navigate(HOME_BY_ROLE[response.role] ?? "/admin", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Error al iniciar sesión. Por favor, intente nuevamente.");
        console.error("Login error:", err);
      }
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
          <Link to="/solicitud-expediente" style={{ fontSize: "0.875rem", color: "#284483" }}>
            Ir al formulario de estudiante
          </Link>
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
