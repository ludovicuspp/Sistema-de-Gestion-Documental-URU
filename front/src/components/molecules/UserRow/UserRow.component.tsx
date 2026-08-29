import { Button } from "@/components/atoms/Button";
import { RoleBadge } from "@/components/atoms/RoleBadge";
import type { RoleBadgeVariant } from "@/components/atoms/RoleBadge";
import "./userrow.css";

export interface UserRowProps {
  id: string;
  name: string;
  idEmail: string;
  role: string;
  roleVariant: RoleBadgeVariant;
  status: string;
  onView?: (id: string) => void;
}

/**
 * UserRow - Molecule
 *
 * Fila de usuario: nombre, cédula/correo, rol, estado y botón Ver.
 */
export const UserRow = ({ id, name, idEmail, role, roleVariant, status, onView }: UserRowProps) => {
  return (
    <div className="user-row">
      <div className="user-row__info">
        <span className="user-row__name">{name}</span>
        <span className="user-row__id-email">{idEmail}</span>
      </div>
      <RoleBadge variant={roleVariant}>{role}</RoleBadge>
      <span className="user-row__status">{status}</span>
      <Button variant="outline" size="small" onClick={() => onView?.(id)} className="user-row__btn-view">
        Ver
      </Button>
    </div>
  );
};
