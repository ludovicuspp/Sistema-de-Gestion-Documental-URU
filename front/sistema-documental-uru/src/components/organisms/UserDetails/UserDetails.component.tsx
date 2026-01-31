import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import "./UserDetails.css";

export interface UserDetail {
  id: string;
  cedula?: string;
  correo?: string;
  rol?: string;
  estado?: string;
}

export interface UserDetailsProps {
  user: UserDetail | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * UserDetails - Organism
 *
 * Selected user detail section: info and Edit/Delete actions.
 */
export const UserDetails = ({ user, onEdit, onDelete }: UserDetailsProps) => {
  const display = (value: string | undefined) => value ?? "—";

  return (
    <Card variant="elevated" className="user-details">
      <h2 className="user-details__title">Detalle del usuario</h2>
      <p className="user-details__subtitle">Selecciona un usuario para ver o gestionar</p>
      <div className="user-details__section">
        <h3 className="user-details__section-title">Información</h3>
        <dl className="user-details__fields">
          <div className="user-details__field">
            <dt className="user-details__label">Cédula</dt>
            <dd className="user-details__value">{display(user?.cedula)}</dd>
          </div>
          <div className="user-details__field">
            <dt className="user-details__label">Correo</dt>
            <dd className="user-details__value">{display(user?.correo)}</dd>
          </div>
          <div className="user-details__field">
            <dt className="user-details__label">Rol</dt>
            <dd className="user-details__value">{display(user?.rol)}</dd>
          </div>
          <div className="user-details__field">
            <dt className="user-details__label">Estado</dt>
            <dd className="user-details__value">{display(user?.estado)}</dd>
          </div>
        </dl>
      </div>
      <div className="user-details__actions">
        <Button variant="secondary" size="small" onClick={() => user && onEdit?.(user.id)} disabled={!user}>
          Editar
        </Button>
        <Button variant="danger" size="small" onClick={() => user && onDelete?.(user.id)} disabled={!user}>
          Eliminar
        </Button>
      </div>
    </Card>
  );
};
