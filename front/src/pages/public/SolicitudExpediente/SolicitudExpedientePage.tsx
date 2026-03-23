import { useState, useEffect, type FormEvent } from "react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import "./SolicitudExpedientePage.css";

const DOCUMENTOS_OPCIONES = [
  "Partida de Nacimiento",
  "Fotocopia de la Cédula",
  "Fondo Negro Titular de Bachiller",
  "Fondo Negro Notas Certificadas",
  "Certificado de participación OPSU",
  "Veredicto",
  "Acta aprobación Servicio comunitario",
  "Acta aprobación de pasantías",
  "Reconocimientos internos",
] as const;

const ESTUDIANTE_OPCIONES = [
  { value: "", label: "Seleccionar" },
  { value: "pregrado", label: "Pregrado" },
  { value: "postgrado", label: "Postgrado" },
  { value: "extension", label: "Extensión" },
  { value: "egresado", label: "Egresado" },
];

const initialForm = {
  nombres: "",
  apellidos: "",
  cedula: "",
  estudianteDe: "",
  documentos: [] as string[],
  correo: "",
  comentario: "",
};

/**
 * Página pública: formulario de solicitud de expediente.
 * Incluye información rápida (proceso y requisitos) y formulario.
 */
export const SolicitudExpedientePage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");
    html.style.setProperty("overflow-x", "hidden");
    html.style.setProperty("overflow-y", "auto");
    html.style.setProperty("height", "auto");
    html.style.setProperty("min-height", "100vh");
    body.style.setProperty("overflow-x", "hidden");
    body.style.setProperty("overflow-y", "auto");
    body.style.setProperty("height", "auto");
    body.style.setProperty("min-height", "100vh");
    if (root) {
      root.style.setProperty("overflow", "visible");
      root.style.setProperty("height", "auto");
      root.style.setProperty("min-height", "100vh");
    }
    return () => {
      html.style.removeProperty("overflow-x");
      html.style.removeProperty("overflow-y");
      html.style.removeProperty("height");
      html.style.removeProperty("min-height");
      body.style.removeProperty("overflow-x");
      body.style.removeProperty("overflow-y");
      body.style.removeProperty("height");
      body.style.removeProperty("min-height");
      if (root) {
        root.style.removeProperty("overflow");
        root.style.removeProperty("height");
        root.style.removeProperty("min-height");
      }
    };
  }, []);

  const handleChange = (field: keyof typeof form, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleDocumento = (doc: string) => {
    setForm((prev) => ({
      ...prev,
      documentos: prev.documentos.includes(doc)
        ? prev.documentos.filter((d) => d !== doc)
        : [...prev.documentos, doc],
    }));
    if (errors.documentos) setErrors((prev) => ({ ...prev, documentos: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.nombres.trim()) next.nombres = "Requerido";
    if (!form.apellidos.trim()) next.apellidos = "Requerido";
    if (!form.cedula.trim()) next.cedula = "Requerido";
    if (!form.estudianteDe) next.estudianteDe = "Selecciona una opción";
    if (form.documentos.length === 0) next.documentos = "Selecciona al menos un documento";
    if (!form.correo.trim()) next.correo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) next.correo = "Correo no válido";
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
    <div className="solicitud-expediente">
      <main className="solicitud-expediente__main">
        <div className="solicitud-expediente__shell">
          <header className="solicitud-expediente__hero" aria-label="Encabezado del formulario">
            <div className="solicitud-expediente__hero-brand">
              <span className="solicitud-expediente__hero-abbr">URU</span>
              <span className="solicitud-expediente__hero-uni">Universidad Rafael Urdaneta</span>
            </div>
            <h1 className="solicitud-expediente__hero-title">SISTEMA DOCUMENTAL DE EXPEDIENTES</h1>
            <p className="solicitud-expediente__hero-subtitle">
              Formulario público &gt; Solicitud de expediente
            </p>
          </header>

        <div className="solicitud-expediente__stack">
          <section className="solicitud-expediente__card solicitud-expediente__info" aria-labelledby="info-title">
            <h2 id="info-title" className="solicitud-expediente__card-title">
              Información rápida
            </h2>
            <div className="solicitud-expediente__info-block">
              <h3 className="solicitud-expediente__info-subtitle">Proceso</h3>
              <ol className="solicitud-expediente__list">
                <li>Recibimos tu solicitud</li>
                <li>Verificamos tu expediente</li>
                <li>Te notificamos por correo cuando esté listo</li>
              </ol>
            </div>
            <div className="solicitud-expediente__info-block">
              <h3 className="solicitud-expediente__info-subtitle">Requisitos</h3>
              <ul className="solicitud-expediente__list solicitud-expediente__list--bullets">
                <li>Correo válido</li>
                <li>Adjuntar identificación si te lo solicitan (en respuesta)</li>
                <li>Evita solicitudes duplicadas el mismo día</li>
              </ul>
            </div>
          </section>

          <section className="solicitud-expediente__card solicitud-expediente__form-card" aria-labelledby="form-title">
            <h2 id="form-title" className="solicitud-expediente__card-title">
              Bienvenido
            </h2>
            <p className="solicitud-expediente__intro">
              Si deseas solicitar tu expediente, llena el siguiente formulario
            </p>

            <form onSubmit={handleSubmit} className="solicitud-expediente__form" noValidate>
              <div className="solicitud-expediente__field">
                <Input
                  label="1. Primer y segundo nombre"
                  placeholder="Ej: José Luis"
                  value={form.nombres}
                  onChange={(e) => handleChange("nombres", e.target.value)}
                  error={!!errors.nombres}
                  errorMessage={errors.nombres}
                  fullWidth
                  className="solicitud-expediente__control"
                />
              </div>

              <div className="solicitud-expediente__field">
                <Input
                  label="2. Apellidos"
                  placeholder="Ej: Perez Gomez"
                  value={form.apellidos}
                  onChange={(e) => handleChange("apellidos", e.target.value)}
                  error={!!errors.apellidos}
                  errorMessage={errors.apellidos}
                  fullWidth
                  className="solicitud-expediente__control"
                />
              </div>

              <div className="solicitud-expediente__field">
                <Input
                  label="3. Cédula de identidad"
                  placeholder="Ej: V-12345678"
                  value={form.cedula}
                  onChange={(e) => handleChange("cedula", e.target.value)}
                  error={!!errors.cedula}
                  errorMessage={errors.cedula}
                  fullWidth
                  className="solicitud-expediente__control"
                />
              </div>

              <div className="solicitud-expediente__field">
                <label className="solicitud-expediente__label" htmlFor="solicitud-estudiante-de">
                  4. ¿Eres estudiante de?
                </label>
                <select
                  id="solicitud-estudiante-de"
                  className="solicitud-expediente__select"
                  value={form.estudianteDe}
                  onChange={(e) => handleChange("estudianteDe", e.target.value)}
                  aria-invalid={!!errors.estudianteDe}
                >
                  {ESTUDIANTE_OPCIONES.map((opt) => (
                    <option key={opt.value || "sel"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.estudianteDe && (
                  <span className="solicitud-expediente__error" role="alert">
                    {errors.estudianteDe}
                  </span>
                )}
              </div>

              <div className="solicitud-expediente__field">
                <span className="solicitud-expediente__label" id="solicitud-docs-label">
                  5. Selecciona los documentos que deseas solicitar
                </span>
                <p className="solicitud-expediente__hint" id="solicitud-docs-hint">
                  Selecciona al menos un documento para enviar la solicitud
                </p>
                <div
                  className="solicitud-expediente__checkgrid"
                  role="group"
                  aria-labelledby="solicitud-docs-label"
                  aria-describedby="solicitud-docs-hint"
                >
                  {DOCUMENTOS_OPCIONES.map((doc) => (
                    <label
                      key={doc}
                      className={`solicitud-expediente__checkbox-cell${
                        doc === "Reconocimientos internos"
                          ? " solicitud-expediente__checkbox-cell--full"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.documentos.includes(doc)}
                        onChange={() => toggleDocumento(doc)}
                        className="solicitud-expediente__checkbox"
                      />
                      <span>{doc}</span>
                    </label>
                  ))}
                </div>
                {errors.documentos && (
                  <span className="solicitud-expediente__error" role="alert">
                    {errors.documentos}
                  </span>
                )}
              </div>

              <div className="solicitud-expediente__field">
                <Input
                  label="6. Correo electrónico"
                  type="email"
                  placeholder="ejemplo@mail.com"
                  value={form.correo}
                  onChange={(e) => handleChange("correo", e.target.value)}
                  error={!!errors.correo}
                  errorMessage={errors.correo}
                  fullWidth
                  className="solicitud-expediente__control"
                />
              </div>

              <div className="solicitud-expediente__field">
                <label className="solicitud-expediente__label" htmlFor="solicitud-comentario">
                  7. Comentario (opcional)
                </label>
                <textarea
                  id="solicitud-comentario"
                  className="solicitud-expediente__textarea"
                  placeholder="Agrega información relevante: período, número de estudiante, observaciones..."
                  value={form.comentario}
                  onChange={(e) => handleChange("comentario", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="solicitud-expediente__submit-area">
                <p className="solicitud-expediente__legal">
                  Al enviar acepta la política de privacidad institucional
                </p>
                <div className="solicitud-expediente__buttons">
                  <Button type="button" variant="outline" onClick={handleLimpiar}>
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

        <footer className="solicitud-expediente__page-footer">
          <p className="solicitud-expediente__page-footer-text">
            UNIVERSIDAD RAFAEL URDANETA · SISTEMA DOCUMENTAL DE EXPEDIENTES
          </p>
          <button type="button" className="solicitud-expediente__page-footer-link">
            Privacy &amp; Terms
          </button>
        </footer>
        </div>
      </main>
    </div>
  );
};
