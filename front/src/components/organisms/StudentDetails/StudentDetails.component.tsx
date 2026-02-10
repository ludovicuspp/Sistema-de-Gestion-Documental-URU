import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import "./StudentDetails.css";

export interface StudentDetail {
  id: string;
  name: string;
  studentId: string;
  birthDate?: string;
  email?: string;
  cedula?: string;
  nivel?: string;
  carrera?: string;
  estado?: string;
  expedienteSummary?: string;
}

export interface StudentDetailsProps {
  student: StudentDetail | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewExpedientes?: (id: string) => void;
  onNewExpediente?: (id: string) => void;
  /** Show edit and delete student actions. Default true. */
  showEditDeleteActions?: boolean;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * StudentDetails - Organism
 *
 * Selected student: identity card (avatar, name, id, birth, email, edit/delete)
 * and academic info card (cedula, nivel, carrera, estado, expedientes).
 */
export const StudentDetails = ({
  student,
  onEdit,
  onDelete,
  onViewExpedientes,
  onNewExpediente,
  showEditDeleteActions = true,
}: StudentDetailsProps) => {
  const display = (value: string | undefined) => value ?? "—";

  if (!student) {
    return (
      <Card variant="elevated" className="student-details">
        <h2 className="student-details__title">Detalle del estudiante</h2>
        <p className="student-details__subtitle">Selecciona un estudiante para ver o gestionar</p>
        <div className="student-details__empty">
          <p>No hay estudiante seleccionado.</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card variant="elevated" className="student-details student-details--identity">
        <div className="student-details__identity">
          <div className="student-details__avatar" aria-hidden>
            {getInitials(student.name)}
          </div>
          <div className="student-details__identity-text">
            <h2 className="student-details__name">{student.name}</h2>
            <p className="student-details__meta">
              Estudiante ID: {display(student.studentId)}
              {student.birthDate ? ` Nac: ${student.birthDate}` : ""}
            </p>
            <p className="student-details__meta">Email: {display(student.email)}</p>
          </div>
        </div>
        {showEditDeleteActions && (
        <div className="student-details__actions">
          <Button variant="outline" size="small" onClick={() => onEdit?.(student.id)}>
            Editar estudiante
          </Button>
          <Button variant="primary" size="small" onClick={() => onDelete?.(student.id)}>
            Eliminar estudiante
          </Button>
        </div>
        )}
      </Card>

      <Card variant="elevated" className="student-details student-details--academic">
        <h3 className="student-details__section-title">Información académica</h3>
        <dl className="student-details__fields">
          <div className="student-details__field">
            <dt className="student-details__label">Cédula</dt>
            <dd className="student-details__value">{display(student.cedula)}</dd>
          </div>
          <div className="student-details__field">
            <dt className="student-details__label">Nivel</dt>
            <dd className="student-details__value">{display(student.nivel)}</dd>
          </div>
          <div className="student-details__field">
            <dt className="student-details__label">Carrera</dt>
            <dd className="student-details__value">{display(student.carrera)}</dd>
          </div>
          <div className="student-details__field">
            <dt className="student-details__label">Estado</dt>
            <dd className="student-details__value">{display(student.estado)}</dd>
          </div>
        </dl>
        <div className="student-details__expedientes">
          <h4 className="student-details__exp-title">Expedientes asociados</h4>
          <p className="student-details__exp-summary">
            {student.expedienteSummary ?? "Expediente · Pregrado · Estante 3/Caja 12/Fila B"}
          </p>
          <div className="student-details__exp-actions">
            <Button variant="outline" size="small" onClick={() => onViewExpedientes?.(student.id)}>
              Ver expedientes
            </Button>
            <Button variant="primary" size="small" onClick={() => onNewExpediente?.(student.id)}>
              Nuevo expediente
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};
