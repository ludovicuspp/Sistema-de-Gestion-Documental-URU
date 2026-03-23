import { useState, type FormEvent } from "react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
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
  aceptaPolitica: false,
};

/**
 * Página pública: formulario de solicitud de expediente.
 * Incluye información rápida (proceso y requisitos) y formulario.
 */
export const SolicitudExpedientePage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string | boolean | string[]) => {
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
    if (!form.aceptaPolitica) next.aceptaPolitica = "Debes aceptar la política de privacidad";
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
      <Header />

      <main className="solicitud-expediente__main">
        <nav className="solicitud-expediente__breadcrumb" aria-label="Navegación">
          Formulario público &gt; Solicitud de expediente
        </nav>

        <div className="solicitud-expediente__grid">
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
              <div className="solicitud-expediente__form-row">
                <div className="solicitud-expediente__field">
                  <Input
                    label="Primer y segundo nombre"
                    placeholder="Ej: José Luis"
                    value={form.nombres}
                    onChange={(e) => handleChange("nombres", e.target.value)}
                    error={!!errors.nombres}
                    errorMessage={errors.nombres}
                    fullWidth
                  />
                </div>
                <div className="solicitud-expediente__field">
                  <Input
                    label="Apellidos"
                    placeholder="Ej: Perez Gomez"
                    value={form.apellidos}
                    onChange={(e) => handleChange("apellidos", e.target.value)}
                    error={!!errors.apellidos}
                    errorMessage={errors.apellidos}
                    fullWidth
                  />
                </div>
              </div>

              <div className="solicitud-expediente__form-row">
                <div className="solicitud-expediente__field">
                  <Input
                    label="Cédula de identidad"
                    placeholder="Ej: V-12345678"
                    value={form.cedula}
                    onChange={(e) => handleChange("cedula", e.target.value)}
                    error={!!errors.cedula}
                    errorMessage={errors.cedula}
                    fullWidth
                  />
                </div>
                <div className="solicitud-expediente__field">
                  <label className="solicitud-expediente__label">
                    ¿Eres estudiante de?
                  </label>
                  <select
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
              </div>

              <div className="solicitud-expediente__field">
                <span className="solicitud-expediente__label">
                  Selecciona los documentos que deseas solicitar
                </span>
                <div className="solicitud-expediente__checkgrid">
                  {DOCUMENTOS_OPCIONES.map((doc) => (
                    <label key={doc} className="solicitud-expediente__checkbox-label">
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
                <p className="solicitud-expediente__hint">
                  Selecciona al menos un documento para enviar la solicitud
                </p>
                {errors.documentos && (
                  <span className="solicitud-expediente__error" role="alert">
                    {errors.documentos}
                  </span>
                )}
              </div>

              <div className="solicitud-expediente__field">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="ejemplo@mail.com"
                  value={form.correo}
                  onChange={(e) => handleChange("correo", e.target.value)}
                  error={!!errors.correo}
                  errorMessage={errors.correo}
                  fullWidth
                />
              </div>

              <div className="solicitud-expediente__field">
                <label className="solicitud-expediente__label">
                  Comentario (opcional)
                </label>
                <textarea
                  className="solicitud-expediente__textarea"
                  placeholder="Agrega información relevante: período, número de estudiante, observaciones..."
                  value={form.comentario}
                  onChange={(e) => handleChange("comentario", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="solicitud-expediente__submit-area">
                <label className="solicitud-expediente__checkbox-label solicitud-expediente__politica">
                  <input
                    type="checkbox"
                    checked={form.aceptaPolitica}
                    onChange={(e) => handleChange("aceptaPolitica", e.target.checked)}
                    className="solicitud-expediente__checkbox"
                  />
                  <span>Al enviar acepta la política de privacidad institucional</span>
                </label>
                {errors.aceptaPolitica && (
                  <span className="solicitud-expediente__error" role="alert">
                    {errors.aceptaPolitica}
                  </span>
                )}
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
      </main>

      <Footer />
    </div>
  );
};
