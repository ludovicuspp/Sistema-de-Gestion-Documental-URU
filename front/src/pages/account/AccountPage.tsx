import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card } from "@/components/molecules/Card";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { AlertModal } from "@/components/molecules/AlertModal";
import { ASSISTANT_SIDEBAR_MODULES, VERIFIER_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import { ApiError, clearSession } from "@/services/api/http";
import { authService } from "@/services/api/authService";

/**
 * AccountPage - Page. Datos de sesion y cambio de contrasena (todos los roles).
 */
export const AccountPage = () => {
  const navigate = useNavigate();
  const sessionUser = authService.currentUser();
  const role = sessionUser?.role ?? "";
  const homePath = role === "Verificador" ? "/verifier" : role === "Asistente" ? "/assistant" : "/admin";
  const modules =
    role === "Verificador" ? VERIFIER_SIDEBAR_MODULES : role === "Asistente" ? ASSISTANT_SIDEBAR_MODULES : undefined;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("La nueva contrasena debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Las contrasenas no coinciden.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setSuccessOpen(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate("/");
        return;
      }
      setError(err instanceof ApiError ? err.message : "No fue posible cambiar la contrasena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardTemplate
      currentView="Mi cuenta"
      userRole={role || undefined}
      headerHomePath={homePath}
      onLogout={handleLogout}
      onRefresh={() => globalThis.location.reload()}
      sidebarModules={modules}
      sidebarShowCreateUser={false}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "36rem" }}>
        <Card>
          <h3 style={{ marginTop: 0 }}>Datos de sesion</h3>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Usuario:</strong> {sessionUser?.username ?? "—"}
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Correo:</strong> {sessionUser?.email ?? "—"}
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Rol:</strong> {role || "—"}
          </p>
        </Card>
        <Card>
          <h3 style={{ marginTop: 0 }}>Cambiar contrasena</h3>
          <form onSubmit={(e) => void handleSubmit(e)} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Input
              type="password"
              placeholder="Contrasena actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              required
            />
            <Input
              type="password"
              placeholder="Nueva contrasena (minimo 8 caracteres)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
            />
            <Input
              type="password"
              placeholder="Confirmar nueva contrasena"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              fullWidth
              required
            />
            {error && <p style={{ color: "#b42318", fontSize: "0.875rem", margin: 0 }}>{error}</p>}
            <div>
              <Button type="submit" variant="primary" size="medium" loading={loading}>
                Guardar contrasena
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <AlertModal
        open={successOpen}
        type="success"
        title="Contrasena actualizada"
        message="Su contrasena fue cambiada correctamente."
        buttonLabel="Cerrar"
        onClose={() => setSuccessOpen(false)}
      />
    </DashboardTemplate>
  );
};
