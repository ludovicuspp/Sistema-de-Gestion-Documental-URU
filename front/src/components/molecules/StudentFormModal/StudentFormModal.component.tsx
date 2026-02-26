import { useState, useEffect } from "react";
import { FormModal } from "@/components/molecules/FormModal";
import type { StudentDetail } from "@/components/organisms/StudentDetails";
import "./StudentFormModal.css";

export interface StudentFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Estudiante existente para editar, o null para crear nuevo. */
  student: StudentDetail | null;
  onSubmit: (data: {
    name: string;
    cedula: string;
    nivel: string;
    carrera: string;
    estado: string;
  }) => void;
}

const NIVELES = [
  { value: "todos", label: "Todos" },
  { value: "pregrado", label: "Pregrado" },
  { value: "postgrado", label: "Postgrado" },
];

const ESTADOS = [
  { value: "", label: "Seleccionar" },
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
];

/**
 * StudentFormModal - Molecule
 *
 * Modal para crear o editar estudiante.
 * Campos: Nombre, Cédula, Nivel académico, Carrera, Estado.
 */
export const StudentFormModal = ({
  open,
  onClose,
  student,
  onSubmit,
}: StudentFormModalProps) => {
  const [name, setName] = useState("");
  const [cedula, setCedula] = useState("");
  const [nivel, setNivel] = useState("todos");
  const [carrera, setCarrera] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    if (open) {
      if (student) {
        setName(student.name ?? "");
        setCedula(student.cedula ?? "");
        setNivel(
          student.nivel?.toLowerCase() === "postgrado" ? "postgrado" : "pregrado"
        );
        setCarrera(student.carrera ?? "");
        setEstado(
          student.estado?.toLowerCase() === "activo" ? "activo" : "inactivo"
        );
      } else {
        setName("");
        setCedula("");
        setNivel("todos");
        setCarrera("");
        setEstado("");
      }
    }
  }, [open, student]);

  const handleSubmit = () => {
    onSubmit({ name, cedula, nivel, carrera, estado });
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      label={student ? "Editar Estudiante" : "Crear Estudiante"}
      size="lg"
      onSubmit={handleSubmit}
    >
      <div className="form-modal__field">
        <label htmlFor="student-name" className="form-modal__field-label">
          Nombre
        </label>
        <input
          id="student-name"
          type="text"
          className="form-modal__field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="student-cedula" className="form-modal__field-label">
          Cédula
        </label>
        <input
          id="student-cedula"
          type="text"
          className="form-modal__field-input"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="Ej: 0113"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="student-nivel" className="form-modal__field-label">
          Nivel académico
        </label>
        <select
          id="student-nivel"
          className="form-modal__field-select"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
        >
          {NIVELES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-modal__field">
        <label htmlFor="student-carrera" className="form-modal__field-label">
          Carrera
        </label>
        <input
          id="student-carrera"
          type="text"
          className="form-modal__field-input"
          value={carrera}
          onChange={(e) => setCarrera(e.target.value)}
          placeholder="Ej: Ingeniería Informática"
        />
      </div>
      <div className="form-modal__field">
        <label htmlFor="student-estado" className="form-modal__field-label">
          Estado
        </label>
        <select
          id="student-estado"
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
