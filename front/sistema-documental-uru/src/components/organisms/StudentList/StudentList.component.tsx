import { useState } from "react";
import { Card } from "@/components/molecules/Card";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { StudentRow } from "@/components/molecules/StudentRow";
import type { StudentRowProps } from "@/components/molecules/StudentRow";
import "./StudentList.css";

export interface StudentListItem
  extends Pick<StudentRowProps, "id" | "name" | "ciNivelEstado" | "levelLabel" | "status" | "lastModified"> {}

export interface StudentListProps {
  students: StudentListItem[];
  onSearch?: (query: string) => void;
  onViewStudent?: (id: string) => void;
  onFilterCareer?: () => void;
  onFilterSelect?: () => void;
  onNewStudent?: () => void;
  onImportList?: () => void;
}

/**
 * StudentList - Organism
 *
 * Search, filters and student list section (Consultar estudiantes).
 */
export const StudentList = ({
  students,
  onSearch,
  onViewStudent,
  onFilterCareer,
  onFilterSelect,
  onNewStudent,
  onImportList,
}: StudentListProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch?.("");
  };

  return (
    <Card variant="elevated" className="student-list">
      <h2 className="student-list__title">Consultar estudiantes</h2>
      <p className="student-list__subtitle">Buscar por cédula, nombre o estado</p>
      <div className="student-list__search-row">
        <Input
          placeholder="Buscar por cédula o nombre (Ej: 0113 o Ludovicus)"
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
                className="student-list__clear-btn"
              >
                <span aria-hidden>×</span>
              </button>
            ) : undefined
          }
        />
        <div className="student-list__filters">
          <Button variant="outline" size="small" onClick={onFilterCareer}>
            Carrera
          </Button>
          <Button variant="outline" size="small" onClick={onFilterSelect}>
            Seleccionar
          </Button>
        </div>
      </div>
      <div className="student-list__actions">
        <Button variant="primary" size="small" onClick={onNewStudent} startIcon={<span>+</span>}>
          Nuevo estudiante
        </Button>
        <Button variant="outline" size="small" onClick={onImportList}>
          Importar lista
        </Button>
      </div>
      <div className="student-list__list">
        {students.length === 0 ? (
          <p className="student-list__empty">No hay estudiantes para mostrar.</p>
        ) : (
          students.map((s) => (
            <StudentRow
              key={s.id}
              id={s.id}
              name={s.name}
              ciNivelEstado={s.ciNivelEstado}
              levelLabel={s.levelLabel}
              status={s.status}
              lastModified={s.lastModified}
              onView={onViewStudent}
            />
          ))
        )}
      </div>
    </Card>
  );
};
