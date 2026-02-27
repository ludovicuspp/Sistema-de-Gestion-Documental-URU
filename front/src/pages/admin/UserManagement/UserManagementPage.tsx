import { useState, useCallback } from "react";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { UserList } from "@/components/organisms/UserList";
import { UserDetails } from "@/components/organisms/UserDetails";
import { ActionHistory } from "@/components/organisms/ActionHistory";
import { UserFormModal } from "@/components/molecules/UserFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Button } from "@/components/atoms/Button";
import type { UserListItem } from "@/components/organisms/UserList";
import type { UserDetail } from "@/components/organisms/UserDetails";
import "./UserManagementPage.css";

const MOCK_USERS: UserListItem[] = [
  {
    id: "1",
    name: "Admin Principal",
    idEmail: "V-0001 - admin@uru.edu.ve",
    role: "Administrador",
    roleVariant: "administrador",
    status: "Activo",
  },
  {
    id: "2",
    name: "Ludovicus Van Vargas",
    idEmail: "V-0002 - ludovicus@uru.edu.ve",
    role: "Verificador",
    roleVariant: "verificador",
    status: "Activo",
  },
  {
    id: "3",
    name: "Asistente B",
    idEmail: "V-0003 - asistente.b@uru.edu.ve",
    role: "Asistente",
    roleVariant: "asistente",
    status: "Activo",
  },
];

const MOCK_DETAILS: Record<string, UserDetail> = {
  "1": {
    id: "1",
    cedula: "V-0001",
    correo: "admin@uru.edu.ve",
    rol: "Administrador",
    estado: "Activo",
  },
  "2": {
    id: "2",
    cedula: "V-0002",
    correo: "ludovicus@uru.edu.ve",
    rol: "Verificador",
    estado: "Activo",
  },
  "3": {
    id: "3",
    cedula: "V-0003",
    correo: "asistente.b@uru.edu.ve",
    rol: "Asistente",
    estado: "Activo",
  },
};

/**
 * UserManagementPage - Page
 *
 * Página de gestión de usuarios: consultar, ver detalle y historial de acciones.
 */
export const UserManagementPage = () => {
  const [users, setUsers] = useState<UserListItem[]>(MOCK_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{ user: UserDetail; name: string } | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [incompleteFieldsAlert, setIncompleteFieldsAlert] = useState(false);
  const [userExistsAlert, setUserExistsAlert] = useState(false);
  const [invalidRoleAlert, setInvalidRoleAlert] = useState(false);
  const [saveUserErrorAlert, setSaveUserErrorAlert] = useState(false);
  const [userNotFoundAlert, setUserNotFoundAlert] = useState(false);
  const [userDeletedAlert, setUserDeletedAlert] = useState(false);
  const [invalidRoleForDeletionAlert, setInvalidRoleForDeletionAlert] = useState(false);
  const [userWithPendingTasksAlert, setUserWithPendingTasksAlert] = useState(false);
  const [noUsersFoundAlert, setNoUsersFoundAlert] = useState(false);

  const selectedUser = selectedUserId ? MOCK_DETAILS[selectedUserId] ?? null : null;

  const handleViewUser = useCallback((id: string) => {
    setSelectedUserId(id);
  }, []);

  const handleCreateUser = useCallback(() => {
    setEditingUser(null);
    setUserModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setSelectedUserId(null);
    // TODO: recargar lista desde API
    console.log("Refrescar");
  }, []);

  // TEMPORAL: Funciones para probar alertas - ELIMINAR después
  const handleTestIncompleteFields = useCallback(() => {
    setIncompleteFieldsAlert(true);
  }, []);

  const handleTestUserExists = useCallback(() => {
    setUserExistsAlert(true);
  }, []);

  const handleTestInvalidRole = useCallback(() => {
    setInvalidRoleAlert(true);
  }, []);

  const handleTestSaveUserError = useCallback(() => {
    setSaveUserErrorAlert(true);
  }, []);

  const handleTestUserNotFound = useCallback(() => {
    setUserNotFoundAlert(true);
  }, []);

  const handleTestUserDeleted = useCallback(() => {
    setUserDeletedAlert(true);
  }, []);

  const handleTestInvalidRoleForDeletion = useCallback(() => {
    setInvalidRoleForDeletionAlert(true);
  }, []);

  const handleTestUserWithPendingTasks = useCallback(() => {
    setUserWithPendingTasksAlert(true);
  }, []);

  const handleTestNoUsersFound = useCallback(() => {
    setNoUsersFoundAlert(true);
  }, []);

  const handleEdit = useCallback((id: string) => {
    const user = MOCK_DETAILS[id] ?? null;
    const name = users.find((u) => u.id === id)?.name ?? "";
    if (user) {
      setEditingUser({ user, name });
      setUserModalOpen(true);
    }
  }, [users]);

  const handleDelete = useCallback((id: string) => {
    setDeletingUserId(id);
    setConfirmDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletingUserId) {
      setUsers((prev) => prev.filter((u) => u.id !== deletingUserId));
      if (selectedUserId === deletingUserId) setSelectedUserId(null);
      setConfirmDeleteOpen(false);
      setDeletingUserId(null);
    }
  }, [deletingUserId, selectedUserId]);

  const handleUserSubmit = useCallback(
    (data: { name: string; cedula: string; rol: string; correo: string; estado: string }) => {
      const rolLabel = data.rol === "administrador" ? "Administrador" : data.rol === "verificador" ? "Verificador" : "Asistente";
      const estadoLabel = data.estado === "activo" ? "Activo" : "Inactivo";
      const roleVariant: "administrador" | "verificador" | "asistente" =
        data.rol === "administrador" || data.rol === "verificador" ? data.rol : "asistente";
      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.user.id
              ? {
                  ...u,
                  name: data.name,
                  idEmail: `${data.cedula} - ${data.correo}`,
                  role: rolLabel,
                  roleVariant,
                  status: estadoLabel,
                }
              : u
          )
        );
      } else {
        const newId = String(users.length + 1);
        setUsers((prev) => [
          ...prev,
          {
            id: newId,
            name: data.name,
            idEmail: `${data.cedula} - ${data.correo}`,
            role: rolLabel,
            roleVariant,
            status: estadoLabel,
          },
        ]);
      }
    },
    [editingUser, users.length]
  );

  const filteredUsers = searchQuery
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.idEmail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <DashboardTemplate
      currentView="Gestión de usuarios"
      onCreateUser={handleCreateUser}
      onRefresh={handleRefresh}
    >
      <div className="user-management-page">
        {/* TEMPORAL: Botones de prueba - ELIMINAR después */}
        <div style={{ padding: "1rem", background: "#fff3cd", marginBottom: "1rem", borderRadius: "4px" }}>
          <strong>🧪 Botones de prueba (eliminar después):</strong>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
            <Button variant="secondary" size="small" onClick={handleTestIncompleteFields}>
              23. Campos obligatorios
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestUserExists}>
              24. Usuario ya existe
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestInvalidRole}>
              25. Rol no válido
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestSaveUserError}>
              26. Error al guardar usuario
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestUserNotFound}>
              27. Usuario no encontrado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestUserDeleted}>
              28. Usuario ya eliminado
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestInvalidRoleForDeletion}>
              29. Rol no válido (eliminar)
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestUserWithPendingTasks}>
              30. Usuario con tareas
            </Button>
            <Button variant="secondary" size="small" onClick={handleTestNoUsersFound}>
              31. No se encontraron usuarios
            </Button>
          </div>
        </div>
        
        <div className="user-management-page__top">
          <UserList
            users={filteredUsers}
            onSearch={setSearchQuery}
            onViewUser={handleViewUser}
            onFilterRole={() => {}}
            onFilterStatus={() => {}}
            onExport={() => {}}
          />
        </div>
        <div className="user-management-page__count">{filteredUsers.length} usuarios</div>
        <div className="user-management-page__bottom">
          <div className="user-management-page__detail">
            <UserDetails
              user={selectedUser}
              onEdit={handleEdit}
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
        user={editingUser?.user ?? null}
        userName={editingUser?.name}
        onSubmit={handleUserSubmit}
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => { setConfirmDeleteOpen(false); setDeletingUserId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar?"
        onConfirm={handleConfirmDelete}
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
        message="No se pudo guardar el registro en la base de datos."
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
        message="El rol seleccionado no puede ser eliminado."
        buttonLabel="Cerrar"
        onClose={() => setInvalidRoleForDeletionAlert(false)}
      />
      <AlertModal
        open={userWithPendingTasksAlert}
        type="warning"
        title="Usuario con tareas pendientes"
        message="No se puede eliminar mientras existan tareas o validaciones pendientes."
        buttonLabel="Cerrar"
        onClose={() => setUserWithPendingTasksAlert(false)}
        actions={
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              setUserWithPendingTasksAlert(false);
              console.log("Ver tareas pendientes");
            }}
          >
            Ver tareas
          </Button>
        }
      />
      <AlertModal
        open={noUsersFoundAlert}
        type="warning"
        title="No se encontraron usuarios"
        message=""
        buttonLabel="Cerrar"
        onClose={() => setNoUsersFoundAlert(false)}
      />
    </DashboardTemplate>
  );
};
