import { useState, type FormEvent } from "react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import "./ExpedientRequestPage.css";

type DocLevel = "todos" | "pregrado" | "postgrado" | "egresado";

interface DocOption {
  label: string;
  level: DocLevel;
}

const DOCUMENTOS_OPCIONES: DocOption[] = [
  // ── Comunes a todos los niveles ──────────────────────────
  { label: "Cédula de Identidad",                level: "todos"    },
  { label: "Partida de Nacimiento",              level: "todos"    },
  { label: "Fondo Negro Título de Bachiller",    level: "todos"    },
  { label: "Notas Certificadas",                 level: "todos"    },
  { label: "Suscripción Militar",                level: "todos"    },
  { label: "Manejo de Idioma",                   level: "todos"    },
  { label: "Constancia de Servicio Comunitario", level: "todos"    },
  { label: "Constancia de Pasantías",            level: "todos"    },
  // ── Solo Pregrado ────────────────────────────────────────
  { label: "Certificado de Aprobación OPSU",     level: "pregrado" },
  // ── Egresado (Pregrado y Postgrado) ──────────────────────
  { label: "Veredicto",                          level: "egresado" },
  { label: "Repetición de Expediente",           level: "egresado" },
];

/** Devuelve los documentos visibles según el tipo de estudiante seleccionado. */
function getDocumentosFiltrados(estudianteDe: string): DocOption[] {
  if (!estudianteDe) return [];
  return DOCUMENTOS_OPCIONES.filter(({ level }) => {
    if (level === "todos") return true;
    if (level === "pregrado")  return estudianteDe === "pregrado";
    if (level === "postgrado") return estudianteDe === "postgrado";
    if (level === "egresado")  return estudianteDe === "pregrado" || estudianteDe === "postgrado";
    return false;
  });
}

const CARRERAS_PREGRADO = [
  { value: "", label: "Seleccionar carrera" },
  { value: "ing_computacion", label: "Ingeniería en Computación" },
  { value: "ing_industrial", label: "Ingeniería Industrial" },
  { value: "ing_civil", label: "Ingeniería Civil" },
  { value: "ing_mecanica", label: "Ingeniería Mecánica" },
  { value: "ing_electronica", label: "Ingeniería Electrónica" },
  { value: "ing_quimica", label: "Ingeniería Química" },
  { value: "ing_produccion_animal", label: "Ingeniería en Producción Animal" },
  { value: "ciencias_politicas", label: "Ciencias Políticas y Administrativas" },
  { value: "administracion", label: "Administración de Empresas" },
  { value: "contaduria", label: "Contaduría Pública" },
  { value: "derecho", label: "Derecho" },
  { value: "educacion", label: "Educación" },
  { value: "medicina", label: "Medicina" },
  { value: "enfermeria", label: "Enfermería" },
  { value: "arquitectura", label: "Arquitectura" },
  { value: "matematica", label: "Matemática" },
  { value: "fisica", label: "Física" },
  { value: "biologia", label: "Biología" },
  { value: "quimica", label: "Química" },
  { value: "comunicacion", label: "Comunicación Social" },
  { value: "psicologia", label: "Psicología" },
  { value: "trabajo_social", label: "Trabajo Social" },
  { value: "turismo", label: "Turismo" },
  { value: "otra", label: "Otra" },
];

const ESTUDIANTE_OPCIONES = [
  { value: "", label: "Seleccionar" },
  { value: "pregrado", label: "Pregrado" },
  { value: "postgrado", label: "Postgrado" },
  { value: "cursos_avanzados", label: "Cursos Avanzados" },
];

const initialForm = {
  nombres: "",
  apellidos: "",
  cedula: "",
  estudianteDe: "",
  fechaIngreso: "",
  carrera: "",
  documentos: [] as string[],
  correo: "",
  telefono: "",
  comentario: "",
};

/**
 * Public page: expedient request form (student-facing).
 */
export const ExpedientRequestPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string | string[]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "estudianteDe") {
        next.documentos = [];
        if (value !== "pregrado") {
          next.fechaIngreso = "";
          next.carrera = "";
        }
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleDocumento = (doc: string) => {
    setForm((prev) => ({
      ...prev,
      documentos: prev.documentos.includes(doc)
        ? prev.documentos.filter((d) => d !== doc)
        : [...prev.documentos, doc],
    }));
    if (errors.documentos)
      setErrors((prev) => ({ ...prev, documentos: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.nombres.trim()) next.nombres = "Requerido";
    if (!form.apellidos.trim()) next.apellidos = "Requerido";
    if (!form.cedula.trim()) next.cedula = "Requerido";
    if (!form.estudianteDe) next.estudianteDe = "Selecciona una opción";
    if (form.estudianteDe === "pregrado") {
      if (!form.fechaIngreso) next.fechaIngreso = "Requerido";
      if (!form.carrera) next.carrera = "Selecciona una carrera";
    }
    if (form.documentos.length === 0)
      next.documentos = "Selecciona al menos un documento";
    if (!form.correo.trim()) next.correo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
      next.correo = "Correo no válido";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);
    // TODO: enviar a API
    setTimeout(() => {
      console.log("Solicitud enviada:", form);
      setLoading(false);
      setForm(initialForm);
      setErrors({});
    }, 1000);
  };

  const handleLimpiar = () => {
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div className="expedient-request">
      <Header />

      <main className="expedient-request__main">
        <div className="expedient-request__shell">
          <nav
            className="expedient-request__breadcrumb"
            aria-label="Navegación"
          >
            Formulario público &gt; Solicitud de expediente
          </nav>

          <div className="expedient-request__stack">
            <section
              className="expedient-request__card expedient-request__info"
              aria-labelledby="info-title"
            >
              <h2 id="info-title" className="expedient-request__card-title">
                Información rápida
              </h2>
              <div className="expedient-request__info-block">
                <h3 className="expedient-request__info-subtitle">Proceso</h3>
                <ol className="expedient-request__list">
                  <li>Recibimos tu solicitud</li>
                  <li>Verificamos tu expediente</li>
                  <li>Te notificamos por correo cuando esté listo</li>
                </ol>
              </div>
              <div className="expedient-request__info-block">
                <h3 className="expedient-request__info-subtitle">
                  Requisitos
                </h3>
                <ul className="expedient-request__list expedient-request__list--bullets">
                  <li>Correo válido</li>
                  <li>
                    Adjuntar identificación si te lo solicitan (en respuesta)
                  </li>
                  <li>Evita solicitudes duplicadas el mismo día</li>
                </ul>
              </div>
            </section>

            <section
              className="expedient-request__card expedient-request__form-card"
              aria-labelledby="form-title"
            >
              <h2 id="form-title" className="expedient-request__card-title">
                Bienvenido
              </h2>
              <p className="expedient-request__intro">
                Si deseas solicitar tu expediente, llena el siguiente formulario
              </p>

              <form
                onSubmit={handleSubmit}
                className="expedient-request__form"
                noValidate
              >
                <div className="expedient-request__field">
                  <Input
                    label="1. Primer y segundo nombre"
                    placeholder="Ej: José Luis"
                    value={form.nombres}
                    onChange={(e) => handleChange("nombres", e.target.value)}
                    error={!!errors.nombres}
                    errorMessage={errors.nombres}
                    fullWidth
                    className="expedient-request__control"
                  />
                </div>

                <div className="expedient-request__field">
                  <Input
                    label="2. Apellidos"
                    placeholder="Ej: Perez Gomez"
                    value={form.apellidos}
                    onChange={(e) => handleChange("apellidos", e.target.value)}
                    error={!!errors.apellidos}
                    errorMessage={errors.apellidos}
                    fullWidth
                    className="expedient-request__control"
                  />
                </div>

                <div className="expedient-request__field">
                  <Input
                    label="3. Cédula de identidad"
                    placeholder="Ej: V-12345678"
                    value={form.cedula}
                    onChange={(e) => handleChange("cedula", e.target.value)}
                    error={!!errors.cedula}
                    errorMessage={errors.cedula}
                    fullWidth
                    className="expedient-request__control"
                  />
                </div>

                <div className="expedient-request__field">
                  <label
                    className="expedient-request__label"
                    htmlFor="expedient-request-student-type"
                  >
                    4. ¿Eres estudiante de?
                  </label>
                  <select
                    id="expedient-request-student-type"
                    className="expedient-request__select"
                    value={form.estudianteDe}
                    onChange={(e) =>
                      handleChange("estudianteDe", e.target.value)
                    }
                    aria-invalid={!!errors.estudianteDe}
                  >
                    {ESTUDIANTE_OPCIONES.map((opt) => (
                      <option key={opt.value || "sel"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.estudianteDe && (
                    <span className="expedient-request__error" role="alert">
                      {errors.estudianteDe}
                    </span>
                  )}
                </div>

                {form.estudianteDe === "pregrado" && (
                  <>
                    <div className="expedient-request__field">
                      <Input
                        label="Fecha de inicio de estudios"
                        type="date"
                        value={form.fechaIngreso}
                        onChange={(e) => handleChange("fechaIngreso", e.target.value)}
                        error={!!errors.fechaIngreso}
                        errorMessage={errors.fechaIngreso}
                        fullWidth
                        className="expedient-request__control"
                      />
                    </div>
                    <div className="expedient-request__field">
                      <label
                        className="expedient-request__label"
                        htmlFor="expedient-request-carrera"
                      >
                        Carrera
                      </label>
                      <select
                        id="expedient-request-carrera"
                        className="expedient-request__select"
                        value={form.carrera}
                        onChange={(e) => handleChange("carrera", e.target.value)}
                        aria-invalid={!!errors.carrera}
                      >
                        {CARRERAS_PREGRADO.map((opt) => (
                          <option key={opt.value || "sel"} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.carrera && (
                        <span className="expedient-request__error" role="alert">
                          {errors.carrera}
                        </span>
                      )}
                    </div>
                  </>
                )}

                <div className="expedient-request__field">
                  <span
                    className="expedient-request__label"
                    id="expedient-request-documents-label"
                  >
                    5. Selecciona los documentos que deseas solicitar
                  </span>
                  <p
                    className="expedient-request__hint"
                    id="expedient-request-documents-hint"
                  >
                    {form.estudianteDe
                      ? "Selecciona al menos un documento para enviar la solicitud"
                      : "Primero selecciona el tipo de estudiante para ver los documentos disponibles"}
                  </p>
                  <div
                    className="expedient-request__checkgrid"
                    role="group"
                    aria-labelledby="expedient-request-documents-label"
                    aria-describedby="expedient-request-documents-hint"
                  >
                    {getDocumentosFiltrados(form.estudianteDe).map(({ label }) => (
                      <label
                        key={label}
                        className="expedient-request__checkbox-cell"
                      >
                        <input
                          type="checkbox"
                          checked={form.documentos.includes(label)}
                          onChange={() => toggleDocumento(label)}
                          className="expedient-request__checkbox"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.documentos && (
                    <span className="expedient-request__error" role="alert">
                      {errors.documentos}
                    </span>
                  )}
                </div>

                <div className="expedient-request__field">
                  <Input
                    label="6. Correo electrónico"
                    type="email"
                    placeholder="ejemplo@mail.com"
                    value={form.correo}
                    onChange={(e) => handleChange("correo", e.target.value)}
                    error={!!errors.correo}
                    errorMessage={errors.correo}
                    fullWidth
                    className="expedient-request__control"
                  />
                </div>

                <div className="expedient-request__field">
                  <Input
                    label="7. Número de teléfono"
                    type="tel"
                    placeholder="Ej: 0414-1234567"
                    value={form.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    error={!!errors.telefono}
                    errorMessage={errors.telefono}
                    fullWidth
                    className="expedient-request__control"
                  />
                </div>

                <div className="expedient-request__field">
                  <label
                    className="expedient-request__label"
                    htmlFor="expedient-request-comment"
                  >
                    8. Observaciones (notas)
                  </label>
                  <textarea
                    id="expedient-request-comment"
                    className="expedient-request__textarea"
                    placeholder="Agrega información relevante: período, número de estudiante, observaciones..."
                    value={form.comentario}
                    onChange={(e) => handleChange("comentario", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="expedient-request__submit-area">
                  <p className="expedient-request__legal">
                    Al enviar acepta la política de privacidad institucional
                  </p>
                  <div className="expedient-request__buttons">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLimpiar}
                    >
                      Limpiar
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                      Enviar solicitud
                    </Button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
