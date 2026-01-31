import { useState, useCallback } from "react";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { UserList } from "@/components/organisms/UserList";
import { UserDetails } from "@/components/organisms/UserDetails";
import { ActionHistory } from "@/components/organisms/ActionHistory";
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
  const [users] = useState<UserListItem[]>(MOCK_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedUser = selectedUserId ? MOCK_DETAILS[selectedUserId] ?? null : null;

  const handleViewUser = useCallback((id: string) => {
    setSelectedUserId(id);
  }, []);

  const handleCreateUser = useCallback(() => {
    // TODO: abrir modal o navegar a formulario de creación
    console.log("Crear usuario");
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setSelectedUserId(null);
    // TODO: recargar lista desde API
    console.log("Refrescar");
  }, []);

  const handleEdit = useCallback((id: string) => {
    console.log("Editar usuario", id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log("Eliminar usuario", id);
  }, []);

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
    </DashboardTemplate>
  );
};
