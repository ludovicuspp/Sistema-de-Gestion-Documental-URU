import { useState } from "react";
import { Card } from "@/components/molecules/Card";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { UserRow } from "@/components/molecules/UserRow";
import type { RoleBadgeVariant } from "@/components/atoms/RoleBadge";
import "./UserList.css";

export interface UserListItem {
  id: string;
  name: string;
  idEmail: string;
  role: string;
  roleVariant: RoleBadgeVariant;
  status: string;
}

export interface UserListProps {
  users: UserListItem[];
  onSearch?: (query: string) => void;
  onViewUser?: (id: string) => void;
  onFilterRole?: () => void;
  onFilterStatus?: () => void;
  onExport?: () => void;
}

/**
 * UserList - Organism
 *
 * Search, filters and user list section.
 */
export const UserList = ({
  users,
  onSearch,
  onViewUser,
  onFilterRole,
  onFilterStatus,
  onExport,
}: UserListProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch?.("");
  };

  return (
    <Card variant="elevated" className="user-list">
      <h2 className="user-list__title">Consultar usuarios</h2>
      <p className="user-list__subtitle">Buscar, filtrar y ver detalles.</p>
      <div className="user-list__search-row">
        <Input
          placeholder="Buscar por nombre, cédula o correo"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            onSearch?.(e.target.value);
          }}
          fullWidth
          endIcon={
            searchValue ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Limpiar búsqueda"
                className="user-list__clear-btn"
              >
                <span aria-hidden>×</span>
              </button>
            ) : undefined
          }
        />
        <div className="user-list__filters">
          <Button variant="outline" size="small" onClick={onFilterRole}>
            Todos los roles
          </Button>
          <Button variant="outline" size="small" onClick={onFilterStatus}>
            Todos los estados
          </Button>
          <Button variant="outline" size="small" onClick={onExport}>
            Exportar
          </Button>
        </div>
      </div>
      <div className="user-list__list">
        {users.length === 0 ? (
          <p className="user-list__empty">No hay usuarios para mostrar.</p>
        ) : (
          users.map((u) => (
            <UserRow
              key={u.id}
              id={u.id}
              name={u.name}
              idEmail={u.idEmail}
              role={u.role}
              roleVariant={u.roleVariant}
              status={u.status}
              onView={onViewUser}
            />
          ))
        )}
      </div>
    </Card>
  );
};
