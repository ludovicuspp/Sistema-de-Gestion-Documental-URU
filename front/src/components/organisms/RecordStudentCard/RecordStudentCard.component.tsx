import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import "./RecordStudentCard.css";

export interface RecordStudent {
  id: string;
  name: string;
  cedula: string;
  birthDate: string;
  email: string;
  initials: string;
}

export interface RecordStudentCardProps {
  student: RecordStudent | null;
  onUpdateDocuments?: (studentId: string) => void;
  onUploadRecord?: (studentId: string) => void;
}

/**
 * RecordStudentCard - Organism
 *
 * Student summary card: avatar, info, Update documents and Upload record actions.
 */
export const RecordStudentCard = ({
  student,
  onUpdateDocuments,
  onUploadRecord,
}: RecordStudentCardProps) => {
  if (student == null) {
    return (
      <Card variant="elevated" className="record-student-card">
        <div className="record-student-card__empty">
          Busca un estudiante por cédula o nombre para ver su expediente.
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="record-student-card">
      <div className="record-student-card__inner">
        <div className="record-student-card__avatar" aria-hidden="true">
          {student.initials}
        </div>
        <div className="record-student-card__info">
          <h3 className="record-student-card__name">{student.name}</h3>
          <dl className="record-student-card__fields">
            <div className="record-student-card__field">
              <dt className="record-student-card__label">CI</dt>
              <dd className="record-student-card__value">{student.cedula}</dd>
            </div>
            <div className="record-student-card__field">
              <dt className="record-student-card__label">Nac</dt>
              <dd className="record-student-card__value">{student.birthDate}</dd>
            </div>
            <div className="record-student-card__field">
              <dt className="record-student-card__label">Email</dt>
              <dd className="record-student-card__value">{student.email}</dd>
            </div>
          </dl>
        </div>
        <div className="record-student-card__actions">
          <Button variant="secondary" size="small" onClick={() => onUpdateDocuments?.(student.id)}>
            Actualizar Documentos
          </Button>
          <Button variant="primary" size="small" onClick={() => onUploadRecord?.(student.id)}>
            Cargar Expediente
          </Button>
        </div>
      </div>
    </Card>
  );
};
