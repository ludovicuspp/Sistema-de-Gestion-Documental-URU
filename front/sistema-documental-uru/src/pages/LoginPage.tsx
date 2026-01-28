import { useState } from "react";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { LoginForm } from "@/components/molecules/LoginForm";

/**
 * Página de Login - Page
 *
 * Página completa de inicio de sesión que integra el template de autenticación
 * con el formulario de login y maneja la lógica de autenticación.
 */
export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implementar lógica de autenticación real
      // Ejemplo:
      // const response = await authService.login(email, password);
      // if (response.success) {
      //   navigate('/dashboard');
      // } else {
      //   setError(response.message);
      // }

      // Simulación de login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simular error o éxito
      if (email && password) {
        console.log("Login attempt:", { email, password });
        // navigate('/dashboard');
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

  const handleUserClick = () => {
    console.log("User icon clicked");
    // TODO: Implementar navegación o acción
  };

  const handleSettingsClick = () => {
    console.log("Settings icon clicked");
    // TODO: Implementar navegación o acción
  };

  const handleHelpClick = () => {
    console.log("Help icon clicked");
    // TODO: Implementar navegación o acción
  };

  const handlePrivacyClick = () => {
    console.log("Privacy & Terms clicked");
    // TODO: Implementar navegación o acción
  };

  return (
    <AuthTemplate
      onUserClick={handleUserClick}
      onSettingsClick={handleSettingsClick}
      onHelpClick={handleHelpClick}
      onPrivacyClick={handlePrivacyClick}>
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </AuthTemplate>
  );
};
