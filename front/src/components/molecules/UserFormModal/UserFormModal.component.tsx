import { useState, useEffect } from "react";
import { FormModal } from "@/components/molecules/FormModal";
import type { UserDetail } from "@/components/organisms/UserDetails";
import "./UserFormModal.css";

export interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Usuario existente para editar, o null para crear nuevo. */
  user: UserDetail | null;
  /** Nombre del usuario (UserDetail no lo tiene, viene del contexto). */
  userName?: string;
  onSubmit: (data: {
    name: string;
    cedula: string;
    rol: string;
    correo: string;
    estado: string;
  }) => void;
}

const ROLES = [
  { value: "", label: "Seleccionar" },
  { value: "administrador", label: "Administrador" },
  { value: "verificador", label: "Verificador" },
  { value: "asistente", label: "Asistente" },
];

const ESTADOS = [
  { value: "", label: "Seleccionar" },
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
];

/**
 * UserFormModal - Molecule
 *
 * Modal para crear o editar usuario.
 * Campos: Nombre, Cédula, Rol, Correo, Estado.
 */
export const UserFormModal = ({
  open,
  onClose,
  user,
  userName,
  onSubmit,
}: UserFormModalProps) => {
  const [name, setName] = useState("");
  const [cedula, setCedula] = useState("");
  const [rol, setRol] = useState("");
  const [correo, setCorreo] = useState("");
  const [estado, setEstado] = useState("");

  const mapRolToValue = (rol?: string): string => {
    const r = rol?.toLowerCase();
    if (r === "administrador") return "administrador";
    if (r === "verificador") return "verificador";
    if (r === "asistente") return "asistente";
    return "";
  };

  useEffect(() => {
    if (!open) return;
    if (user) {
      setName(userName ?? "");
      setCedula(user.cedula ?? "");
      setRol(mapRolToValue(user.rol));
      setCorreo(user.correo ?? "");
      setEstado(user.estado?.toLowerCase() === "activo" ? "activo" : "inactivo");
    } else {
      setName("");
      setCedula("");
      setRol("");
      setCorreo("");
      setEstado("");
    }
  }, [open, user, userName]);

  const handleSubmit = () => {
    onSubmit({ name, cedula, rol, correo, estado });
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      label={user ? "Editar Usuario" : "Crear Usuario"}
      size="lg"
      onSubmit={handleSubmit}
    >
      <div className="form-modal__field">
        <label htmlFor="user-name" className="form-modal__field-label">
          Nombre
        </label>
        <input
          id="user-name"
          type="text"
          className="form-modal__field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="user-cedula" className="form-modal__field-label">
          Cédula
        </label>
        <input
          id="user-cedula"
          type="text"
          className="form-modal__field-input"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="Ej: V-0001"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="user-rol" className="form-modal__field-label">
          Rol
        </label>
        <select
          id="user-rol"
          className="form-modal__field-select"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          {ROLES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-modal__field">
        <label htmlFor="user-correo" className="form-modal__field-label">
          Correo
        </label>
        <input
          id="user-correo"
          type="email"
          className="form-modal__field-input"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="correo@uru.edu.ve"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="user-estado" className="form-modal__field-label">
          Estado
        </label>
        <select
          id="user-estado"
          className="form-modal__field-select"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          {ESTADOS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </FormModal>
  );
};
