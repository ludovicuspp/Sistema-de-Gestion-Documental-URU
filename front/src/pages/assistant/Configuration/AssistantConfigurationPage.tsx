import { useState, useCallback } from "react";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./AssistantConfigurationPage.css";

/**
 * AssistantConfigurationPage - Page (Asistente)
 *
 * Assistant configuration view: upload configuration and notification configuration.
 * Based on admin configuration structure, adapted for assistant role.
 */
export const AssistantConfigurationPage = () => {
  const [acceptedFormats, setAcceptedFormats] = useState("PDF, DOCX, JPG, PNG");
  const [sizeLimitMb, setSizeLimitMb] = useState("10");
  const [requiredMetadata, setRequiredMetadata] = useState({
    cedulaIdentidad: true,
    partidaNacimiento: true,
  });
  const [storageDestination, setStorageDestination] = useState("cloud");
  const [notifyAdminOnUpload, setNotifyAdminOnUpload] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [confirmReceiptToStudent, setConfirmReceiptToStudent] = useState(true);

  const handleToggleMetadata = useCallback((key: keyof typeof requiredMetadata) => {
    setRequiredMetadata((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSaveChanges = useCallback(() => {
    console.log("Guardar cambios (asistente)", {
      acceptedFormats,
      sizeLimitMb,
      requiredMetadata,
      storageDestination,
      notifyAdminOnUpload,
      dailyReminder,
      confirmReceiptToStudent,
    });
  }, [
    acceptedFormats,
    sizeLimitMb,
    requiredMetadata,
    storageDestination,
    notifyAdminOnUpload,
    dailyReminder,
    confirmReceiptToStudent,
  ]);

  return (
    <DashboardTemplate
      currentView="Configuración"
      userRole="Asistente"
      userEmail="username@mail.co"
      headerHomePath="/assistant"
      onLogout={() => {}}
      onCreateUser={() => {}}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={ASSISTANT_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
    >
      <div className="assistant-configuration-page">
        {/* CONFIGURACIÓN DE CARGA */}
        <section className="assistant-configuration-page__section">
          <Card variant="elevated" className="assistant-configuration-page__card">
            <h3 className="assistant-configuration-page__section-title">CONFIGURACIÓN DE CARGA</h3>
            <p className="assistant-configuration-page__section-subtitle">
              Ajustes relacionados con la subida y procesamiento de documentos.
            </p>
            <div className="assistant-configuration-page__fields">
              <div className="assistant-configuration-page__field">
                <Input
                  id="accepted-formats"
                  fullWidth
                  label="Formatos de Documentos Aceptados"
                  value={acceptedFormats}
                  onChange={(e) => setAcceptedFormats(e.target.value)}
                  className="assistant-configuration-page__input"
                />
                <span className="assistant-configuration-page__hint">
                  Separar con comas los formatos permitidos.
                </span>
              </div>
              <div className="assistant-configuration-page__field">
                <Input
                  id="size-limit"
                  fullWidth
                  type="text"
                  label="Límites de Tamaño (MB)"
                  value={sizeLimitMb}
                  onChange={(e) => setSizeLimitMb(e.target.value)}
                  className="assistant-configuration-page__input"
                />
              </div>
              <div className="assistant-configuration-page__field">
                <span id="metadata-label" className="assistant-configuration-page__label">
                  Metadatos Requeridos
                </span>
                <div className="assistant-configuration-page__checkboxes" aria-labelledby="metadata-label">
                  <label className="assistant-configuration-page__checkbox-label">
                    <input
                      type="checkbox"
                      checked={requiredMetadata.cedulaIdentidad}
                      onChange={() => handleToggleMetadata("cedulaIdentidad")}
                      className="assistant-configuration-page__checkbox"
                    />
                    <span className="assistant-configuration-page__checkbox-text">Cédula de Identidad</span>
                  </label>
                  <label className="assistant-configuration-page__checkbox-label">
                    <input
                      type="checkbox"
                      checked={requiredMetadata.partidaNacimiento}
                      onChange={() => handleToggleMetadata("partidaNacimiento")}
                      className="assistant-configuration-page__checkbox"
                    />
                    <span className="assistant-configuration-page__checkbox-text">Partida de Nacimiento</span>
                  </label>
                </div>
              </div>
              <div className="assistant-configuration-page__field">
                <label htmlFor="storage-destination" className="assistant-configuration-page__label">
                  Destinos de Almacenamiento
                </label>
                <select
                  id="storage-destination"
                  className="assistant-configuration-page__select"
                  value={storageDestination}
                  onChange={(e) => setStorageDestination(e.target.value)}
                >
                  <option value="cloud">Almacenamiento Principal (Cloud)</option>
                  <option value="local">Almacenamiento Local</option>
                  <option value="hybrid">Almacenamiento Híbrido</option>
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* CONFIGURACIÓN DE NOTIFICACIONES */}
        <section className="assistant-configuration-page__section">
          <Card variant="elevated" className="assistant-configuration-page__card">
            <h3 className="assistant-configuration-page__section-title">CONFIGURACIÓN DE NOTIFICACIONES</h3>
            <p className="assistant-configuration-page__section-subtitle">
              Gestiona las alertas y comunicaciones automáticas del sistema.
            </p>
            <div className="assistant-configuration-page__fields">
              <div className="assistant-configuration-page__field">
                <span id="upload-alerts-label" className="assistant-configuration-page__label">
                  Alertas de Carga Exitosa
                </span>
                <div className="assistant-configuration-page__checkboxes" aria-labelledby="upload-alerts-label">
                  <label className="assistant-configuration-page__checkbox-label">
                    <input
                      type="checkbox"
                      checked={notifyAdminOnUpload}
                      onChange={(e) => setNotifyAdminOnUpload(e.target.checked)}
                      className="assistant-configuration-page__checkbox"
                    />
                    <span className="assistant-configuration-page__checkbox-text">Notificar al administrador por correo</span>
                  </label>
                </div>
              </div>
              <div className="assistant-configuration-page__field">
                <span id="reminders-label" className="assistant-configuration-page__label">
                  Recordatorios Pendientes
                </span>
                <div className="assistant-configuration-page__radios" aria-labelledby="reminders-label">
                  <label className="assistant-configuration-page__radio-label">
                    <input
                      type="radio"
                      name="daily-reminder"
                      checked={dailyReminder}
                      onChange={() => setDailyReminder(true)}
                      className="assistant-configuration-page__radio"
                    />
                    <span className="assistant-configuration-page__checkbox-text">
                      Enviar recordatorio diario para tareas pendientes
                    </span>
                  </label>
                  <label className="assistant-configuration-page__radio-label">
                    <input
                      type="radio"
                      name="daily-reminder"
                      checked={!dailyReminder}
                      onChange={() => setDailyReminder(false)}
                      className="assistant-configuration-page__radio"
                    />
                    <span className="assistant-configuration-page__checkbox-text">No enviar recordatorios</span>
                  </label>
                </div>
              </div>
              <div className="assistant-configuration-page__field">
                <span id="student-comms-label" className="assistant-configuration-page__label">
                  Comunicaciones a Estudiantes
                </span>
                <div className="assistant-configuration-page__checkboxes" aria-labelledby="student-comms-label">
                  <label className="assistant-configuration-page__checkbox-label">
                    <input
                      type="checkbox"
                      checked={confirmReceiptToStudent}
                      onChange={(e) => setConfirmReceiptToStudent(e.target.checked)}
                      className="assistant-configuration-page__checkbox"
                    />
                    <span className="assistant-configuration-page__checkbox-text">Confirmar recepción de documentos al estudiante</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <div className="assistant-configuration-page__actions">
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </DashboardTemplate>
  );
};
