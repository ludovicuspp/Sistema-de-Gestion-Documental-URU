import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { UserList } from "@/components/organisms/UserList";
import { UserDetails } from "@/components/organisms/UserDetails";
import { ActionHistory } from "@/components/organisms/ActionHistory";
import { UserFormModal } from "@/components/molecules/UserFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import type { UserListItem } from "@/components/organisms/UserList";
import type { UserDetail } from "@/components/organisms/UserDetails";
import type { RoleBadgeVariant } from "@/components/atoms/RoleBadge";
import { usersService } from "@/services/api/usersService";
import type { UserDto } from "@/services/api/usersService";
import { ApiError, clearSession } from "@/services/api/http";
import "./UserManagementPage.css";

/** El formulario no pide contraseña: se genera una temporal aleatoria y se muestra
 *  al administrador para que la comparta con el nuevo usuario. */
function generateTempPassword(length = 12): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!*?";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

const toRoleVariant = (role: string): RoleBadgeVariant => {
  if (role === "Administrador") return "administrador";
  if (role === "Asistente") return "asistente";
  return "verificador";
};

const toListItem = (u: UserDto): UserListItem => ({
  id: String(u.id),
  name: u.username,
  idEmail: u.email,
  role: u.role,
  roleVariant: toRoleVariant(u.role),
  status: u.active ? "Activo" : "Inactivo",
});

const toDetail = (u: UserDto): UserDetail => ({
  id: String(u.id),
  correo: u.email,
  rol: u.role,
  estado: u.active ? "Activo" : "Inactivo",
});

/**
 * UserManagementPage - Page
 *
 * Página de gestión de usuarios: consultar, ver detalle y historial de acciones.
 * Datos del backend real (solo Administrador).
 */
export const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [incompleteFieldsAlert, setIncompleteFieldsAlert] = useState(false);
  const [userExistsAlert, setUserExistsAlert] = useState(false);
  const [invalidRoleAlert, setInvalidRoleAlert] = useState(false);
  const [saveUserErrorAlert, setSaveUserErrorAlert] = useState(false);
  const [saveUserErrorMessage, setSaveUserErrorMessage] = useState(
    "No se pudo guardar el registro en la base de datos."
  );
  const [userNotFoundAlert, setUserNotFoundAlert] = useState(false);
  const [userDeletedAlert, setUserDeletedAlert] = useState(false);
  const [invalidRoleForDeletionAlert, setInvalidRoleForDeletionAlert] = useState(false);
  const [invalidRoleForDeletionMessage, setInvalidRoleForDeletionMessage] = useState(
    "El rol seleccionado no puede ser eliminado."
  );
  const [noUsersFoundAlert, setNoUsersFoundAlert] = useState(false);
  const [noUsersFoundMessage, setNoUsersFoundMessage] = useState("");
  const [userCreatedAlert, setUserCreatedAlert] = useState(false);
  const [userCreatedMessage, setUserCreatedMessage] = useState("");

  const showError = (err: unknown, fallback: (message: string) => void) => {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        clearSession();
        navigate("/");
        return;
      }
      fallback(err.message);
      return;
    }
    fallback("Error inesperado. Intente nuevamente.");
  };

  const load = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const data = await usersService.list(query);
      setUsers(data);
      setSelectedUserId((prev) =>
        prev != null && data.some((u) => String(u.id) === prev) ? prev : null
      );
      if (query.trim() !== "" && data.length === 0) {
        setNoUsersFoundMessage(`No hay usuarios que coincidan con "${query.trim()}".`);
        setNoUsersFoundAlert(true);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate("/");
        return;
      }
      setSaveUserErrorMessage(
        err instanceof ApiError ? err.message : "No se pudo cargar la lista de usuarios."
      );
      setSaveUserErrorAlert(true);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        void load(searchQuery);
      },
      searchQuery ? 350 : 0
    );
    return () => clearTimeout(timer);
  }, [load, searchQuery]);

  const listItems = users.map(toListItem);
  const selectedUser = selectedUserId
    ? (users.find((u) => String(u.id) === selectedUserId) ?? null)
    : null;
  const selectedDetail = selectedUser ? toDetail(selectedUser) : null;

  const handleViewUser = useCallback((id: string) => {
    setSelectedUserId(id);
  }, []);

  const handleCreateUser = useCallback(() => {
    setUserModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setSelectedUserId(null);
    void load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const handleDelete = useCallback((id: string) => {
    setDeletingUserId(id);
    setConfirmDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingUserId) return;
    const target = users.find((u) => String(u.id) === deletingUserId) ?? null;
    if (target && !target.active) {
      setConfirmDeleteOpen(false);
      setDeletingUserId(null);
      setUserDeletedAlert(true);
      return;
    }
    try {
      await usersService.deactivate(Number(deletingUserId));
      if (selectedUserId === deletingUserId) setSelectedUserId(null);
      setConfirmDeleteOpen(false);
      setDeletingUserId(null);
      await load(searchQuery);
    } catch (err) {
      setConfirmDeleteOpen(false);
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate("/");
        return;
      }
      if (err instanceof ApiError && err.status === 404) {
        setUserNotFoundAlert(true);
        return;
      }
      showError(err, (message) => {
        setInvalidRoleForDeletionMessage(message);
        setInvalidRoleForDeletionAlert(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletingUserId, users, selectedUserId, load, searchQuery]);

  const handleUserSubmit = useCallback(
    async (data: { name: string; cedula: string; rol: string; correo: string; estado: string }) => {
      const name = data.name.trim();
      const cedula = data.cedula.trim();
      const correo = data.correo.trim();
      if (!name || !cedula || !correo || !data.rol) {
        setIncompleteFieldsAlert(true);
        return;
      }
      const role =
        data.rol === "verificador"
          ? "Verificador"
          : data.rol === "asistente"
            ? "Asistente"
            : null;
      if (!role) {
        setInvalidRoleAlert(true);
        return;
      }
      try {
        const tempPassword = generateTempPassword();
        await usersService.create({
          email: correo,
          password: tempPassword,
          username: name,
          role,
        });
        setUserCreatedMessage(
          `Usuario ${correo} creado con rol ${role}. Contraseña temporal: ${tempPassword} — compártala con el usuario.`
        );
        setUserCreatedAlert(true);
        await load(searchQuery);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearSession();
          navigate("/");
          return;
        }
        if (err instanceof ApiError && err.code === "ALREADY_EXISTS") {
          setUserExistsAlert(true);
          return;
        }
        if (err instanceof ApiError && err.code === "ROLE_NOT_ALLOWED") {
          setInvalidRoleAlert(true);
          return;
        }
        showError(err, (message) => {
          setSaveUserErrorMessage(message);
          setSaveUserErrorAlert(true);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [load, searchQuery]
  );

  const visibleUsers = loading ? [] : listItems;

  return (
    <DashboardTemplate
      currentView="Gestión de usuarios"
      onCreateUser={handleCreateUser}
      onRefresh={handleRefresh}
    >
      <div className="user-management-page">
        <div className="user-management-page__top">
          <UserList
            users={visibleUsers}
            onSearch={setSearchQuery}
            onViewUser={handleViewUser}
            onFilterRole={() => {}}
            onFilterStatus={() => {}}
            onExport={() => {}}
          />
        </div>
        <div className="user-management-page__count">{visibleUsers.length} usuarios</div>
        <div className="user-management-page__bottom">
          <div className="user-management-page__detail">
            <UserDetails
              user={selectedDetail}
              onDelete={handleDelete}
            />
          </div>
          <div className="user-management-page__history">
            <ActionHistory />
          </div>
        </div>
      </div>
      <UserFormModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={null}
        onSubmit={(data) => void handleUserSubmit(data)}
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => { setConfirmDeleteOpen(false); setDeletingUserId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar?"
        onConfirm={() => void handleConfirmDelete()}
      />
      <AlertModal
        open={incompleteFieldsAlert}
        type="warning"
        title="Complete los campos obligatorios"
        message="Nombre, cédula, correo, rol y credenciales son requeridos."
        buttonLabel="Corregir"
        onClose={() => setIncompleteFieldsAlert(false)}
      />
      <AlertModal
        open={userExistsAlert}
        type="warning"
        title="Usuario ya existe"
        message="Se encontró un usuario con la misma cédula o correo."
        buttonLabel="Cerrar"
        onClose={() => setUserExistsAlert(false)}
      />
      <AlertModal
        open={invalidRoleAlert}
        type="error"
        title="Rol no válido"
        message="El rol suministrado no es admitido por el sistema."
        buttonLabel="Cerrar"
        onClose={() => setInvalidRoleAlert(false)}
      />
      <AlertModal
        open={saveUserErrorAlert}
        type="error"
        title="Error al guardar usuario"
        message={saveUserErrorMessage}
        buttonLabel="Cerrar"
        onClose={() => setSaveUserErrorAlert(false)}
      />
      <AlertModal
        open={userNotFoundAlert}
        type="warning"
        title="Usuario no encontrado"
        message="No existe un usuario con esos criterios."
        buttonLabel="Cerrar"
        onClose={() => setUserNotFoundAlert(false)}
      />
      <AlertModal
        open={userDeletedAlert}
        type="warning"
        title="Usuario ya fue eliminado"
        message="Este usuario se encuentra inactivo o eliminado."
        buttonLabel="Cerrar"
        onClose={() => setUserDeletedAlert(false)}
      />
      <AlertModal
        open={invalidRoleForDeletionAlert}
        type="error"
        title="Rol no válido para eliminación"
        message={invalidRoleForDeletionMessage}
        buttonLabel="Cerrar"
        onClose={() => setInvalidRoleForDeletionAlert(false)}
      />
      <AlertModal
        open={userCreatedAlert}
        type="success"
        title="Usuario creado"
        message={userCreatedMessage}
        buttonLabel="Cerrar"
        onClose={() => setUserCreatedAlert(false)}
      />
      <AlertModal
        open={noUsersFoundAlert}
        type="warning"
        title="No se encontraron usuarios"
        message={noUsersFoundMessage}
        buttonLabel="Cerrar"
        onClose={() => setNoUsersFoundAlert(false)}
      />
    </DashboardTemplate>
  );
};
