import { Button } from "@/components/atoms/Button";
import "./StudentRow.css";

export interface StudentRowProps {
  id: string;
  name: string;
  ciNivelEstado: string;
  levelLabel: string;
  status: string;
  lastModified: string;
  onView?: (id: string) => void;
}

/**
 * StudentRow - Molecule
 *
 * Row for student list: name, CI / level / status, last modified and View button.
 */
export const StudentRow = ({
  id,
  name,
  ciNivelEstado,
  levelLabel,
  status,
  lastModified,
  onView,
}: StudentRowProps) => {
  return (
    <div className="student-row">
      <div className="student-row__info">
        <span className="student-row__name">{name}</span>
        <span className="student-row__ci-nivel">{ciNivelEstado}</span>
      </div>
      <span className="student-row__level">{levelLabel}</span>
      <span className="student-row__status">{status}</span>
      <span className="student-row__modified">Últ. mod: {lastModified}</span>
      <Button variant="outline" size="small" onClick={() => onView?.(id)} className="student-row__btn-view">
        Ver
      </Button>
    </div>
  );
};
