import { useState, useCallback } from "react";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { UserList } from "@/components/organisms/UserList";
import { UserDetails } from "@/components/organisms/UserDetails";
import { ActionHistory } from "@/components/organisms/ActionHistory";
import { UserFormModal } from "@/components/molecules/UserFormModal";
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

  const handleEdit = useCallback((id: string) => {
    const user = MOCK_DETAILS[id] ?? null;
    const name = users.find((u) => u.id === id)?.name ?? "";
    if (user) {
      setEditingUser({ user, name });
      setUserModalOpen(true);
    }
  }, [users]);

  const handleDelete = useCallback((id: string) => {
    console.log("Eliminar usuario", id);
  }, []);

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
    </DashboardTemplate>
  );
};
