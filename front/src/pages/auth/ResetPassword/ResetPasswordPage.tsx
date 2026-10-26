import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { ApiError } from "@/services/api/http";
import { authService } from "@/services/api/authService";

/**
 * ResetPasswordPage - Page (Auth). Paso 1: pide el correo y envia el enlace.
 * Paso 2 (con ?token=): establece la nueva contrasena.
 */
export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [done, setDone] = useState<string | undefined>();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Indique su correo.");
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      await authService.forgotPassword(email.trim());
      setDone("Si el correo existe, recibira un enlace para restablecer su contrasena.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No fue posible procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("La contrasena debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contrasenas no coinciden.");
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      await authService.resetPassword(token, password);
      setDone("Contrasena actualizada. Ya puede iniciar sesion.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No fue posible restablecer la contrasena.");
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
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "22rem" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>Restablecer contrasena</h2>
        {done ? (
          <>
            <p style={{ fontSize: "0.875rem", textAlign: "center" }}>{done}</p>
            <Button type="button" variant="primary" fullWidth onClick={() => navigate("/", { replace: true })}>
              Ir al inicio de sesion
            </Button>
          </>
        ) : token ? (
          <form onSubmit={(e) => void handleReset(e)} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Input
              type="password"
              placeholder="Nueva contrasena (minimo 8 caracteres)"
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
              Guardar contrasena
            </Button>
          </form>
        ) : (
          <form onSubmit={(e) => void handleRequest(e)} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Input
              type="email"
              placeholder="nombre.apellido@uru.edu.ve"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            {error && <p style={{ color: "#b42318", fontSize: "0.875rem", margin: 0 }}>{error}</p>}
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Enviar enlace
            </Button>
          </form>
        )}
        <Link to="/" style={{ fontSize: "0.875rem", color: "#284483", textAlign: "center" }}>
          Volver al inicio de sesion
        </Link>
      </div>
    </AuthTemplate>
  );
};
