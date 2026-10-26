import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { ApiError } from "@/services/api/http";
import { authService } from "@/services/api/authService";

const HOME_BY_ROLE: Record<string, string> = {
  Administrador: "/admin",
  Verificador: "/verifier",
  Asistente: "/assistant",
  Estudiante: "/solicitud-expediente",
};

/**
 * RegisterPage - Page (Auth). Registro publico de usuarios (rol Usuario).
 */
export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 8) {
      setError("Indique un correo valido y una contrasena de al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contrasenas no coinciden.");
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const response = await authService.register(
        email.trim(),
        password,
        username.trim() || undefined,
      );
      navigate(HOME_BY_ROLE[response.role] ?? "/solicitud-expediente", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No fue posible registrarse. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTemplate
      onUserClick={() => {}}
      onSettingsClick={() => {}}
      onHelpClick={() => {}}
      onPrivacyClick={() => {}}>
      <form
        onSubmit={(e) => void handleSubmit(e)}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "22rem" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>Crear cuenta</h2>
        <Input
          type="email"
          placeholder="nombre.apellido@uru.edu.ve"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <Input
          type="text"
          placeholder="Nombre de usuario (opcional)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <Input
          type="password"
          placeholder="Contrasena (minimo 8 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <Input
          type="password"
          placeholder="Confirmar contrasena"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          fullWidth
          required
        />
        {error && <p style={{ color: "#b42318", fontSize: "0.875rem", margin: 0 }}>{error}</p>}
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Registrarse
        </Button>
        <Link to="/" style={{ fontSize: "0.875rem", color: "#284483", textAlign: "center" }}>
          Ya tengo cuenta
        </Link>
      </form>
    </AuthTemplate>
  );
};
