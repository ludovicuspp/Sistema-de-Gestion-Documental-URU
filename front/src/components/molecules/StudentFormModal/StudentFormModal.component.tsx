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
  { value: "",               label: "Seleccionar"       },
  { value: "pregrado",       label: "Pregrado"          },
  { value: "postgrado",      label: "Postgrado"         },
  { value: "cursos_avanzados", label: "Cursos Avanzados" },
];

const CARRERAS_PREGRADO = [
  { value: "",                     label: "Seleccionar carrera"                  },
  { value: "ing_computacion",      label: "Ingeniería en Computación"            },
  { value: "ing_industrial",       label: "Ingeniería Industrial"                },
  { value: "ing_civil",            label: "Ingeniería Civil"                     },
  { value: "ing_mecanica",         label: "Ingeniería Mecánica"                  },
  { value: "ing_electronica",      label: "Ingeniería Electrónica"               },
  { value: "ing_quimica",          label: "Ingeniería Química"                   },
  { value: "ing_produccion_animal",label: "Ingeniería en Producción Animal"      },
  { value: "ciencias_politicas",   label: "Ciencias Políticas y Administrativas" },
  { value: "administracion",       label: "Administración de Empresas"           },
  { value: "contaduria",           label: "Contaduría Pública"                   },
  { value: "derecho",              label: "Derecho"                              },
  { value: "educacion",            label: "Educación"                            },
  { value: "medicina",             label: "Medicina"                             },
  { value: "enfermeria",           label: "Enfermería"                           },
  { value: "arquitectura",         label: "Arquitectura"                         },
  { value: "matematica",           label: "Matemática"                           },
  { value: "fisica",               label: "Física"                               },
  { value: "biologia",             label: "Biología"                             },
  { value: "quimica",              label: "Química"                              },
  { value: "comunicacion",         label: "Comunicación Social"                  },
  { value: "psicologia",           label: "Psicología"                           },
  { value: "trabajo_social",       label: "Trabajo Social"                       },
  { value: "turismo",              label: "Turismo"                              },
  { value: "otra",                 label: "Otra"                                 },
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
  const [nivel, setNivel] = useState("");
  const [carrera, setCarrera] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    if (open) {
      if (student) {
        setName(student.name ?? "");
        setCedula(student.cedula ?? "");
        const nivelLower = student.nivel?.toLowerCase() ?? "";
        if (nivelLower === "postgrado") setNivel("postgrado");
        else if (nivelLower === "cursos avanzados" || nivelLower === "cursos_avanzados") setNivel("cursos_avanzados");
        else if (nivelLower === "pregrado") setNivel("pregrado");
        else setNivel("");
        setCarrera(student.carrera ?? "");
        setEstado(student.estado?.toLowerCase() === "activo" ? "activo" : "inactivo");
      } else {
        setName("");
        setCedula("");
        setNivel("");
        setCarrera("");
        setEstado("");
      }
    }
  }, [open, student]);

  const handleNivelChange = (value: string) => {
    setNivel(value);
    if (value !== "pregrado") setCarrera("");
  };

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
          onChange={(e) => handleNivelChange(e.target.value)}
        >
          {NIVELES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {nivel === "pregrado" && (
        <div className="form-modal__field">
          <label htmlFor="student-carrera" className="form-modal__field-label">
            Carrera
          </label>
          <select
            id="student-carrera"
            className="form-modal__field-select"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
          >
            {CARRERAS_PREGRADO.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}
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
