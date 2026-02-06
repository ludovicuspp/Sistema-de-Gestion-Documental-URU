import { useState, useCallback } from "react";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import "./AdminConfigurationPage.css";

/**
 * AdminConfigurationPage - Page
 *
 * Administrator configuration view: validation configuration and expedient configuration.
 */
export const AdminConfigurationPage = () => {
  const [verificationFlow, setVerificationFlow] = useState("standard-2");
  const [approvalCriteria, setApprovalCriteria] = useState("Coincidencia exacta de datos");
  const [allowedDocTypes, setAllowedDocTypes] = useState({
    cedula: true,
    pasaporte: true,
    partidaNacimiento: false,
  });
  const [timeLimitDays, setTimeLimitDays] = useState("5");
  const [reviewTemplate, setReviewTemplate] = useState("general");
  const [labelsAndStates, setLabelsAndStates] = useState("Pendiente, Aprobado, Rechazado");
  const [notifyAdmin, setNotifyAdmin] = useState(true);
  const [notifyApplicant, setNotifyApplicant] = useState(true);
  const [sendDailySummary, setSendDailySummary] = useState(false);

  const handleToggleDocType = useCallback((key: keyof typeof allowedDocTypes) => {
    setAllowedDocTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSaveChanges = useCallback(() => {
    console.log("Guardar cambios", {
      verificationFlow,
      approvalCriteria,
      allowedDocTypes,
      timeLimitDays,
      reviewTemplate,
      labelsAndStates,
      notifyAdmin,
      notifyApplicant,
      sendDailySummary,
    });
  }, [
    verificationFlow,
    approvalCriteria,
    allowedDocTypes,
    timeLimitDays,
    reviewTemplate,
    labelsAndStates,
    notifyAdmin,
    notifyApplicant,
    sendDailySummary,
  ]);

  return (
    <DashboardTemplate
      currentView="Configuración"
      userRole="Administrador"
      userEmail="username@mail.co"
      onLogout={() => {}}
      onCreateUser={() => {}}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
    >
      <div className="admin-configuration-page">
        {/* CONFIGURACIÓN DE VALIDACIÓN */}
        <section className="admin-configuration-page__section">
          <Card variant="elevated" className="admin-configuration-page__card">
            <h3 className="admin-configuration-page__section-title">CONFIGURACIÓN DE VALIDACIÓN</h3>
            <div className="admin-configuration-page__fields">
              <div className="admin-configuration-page__field">
                <label htmlFor="verification-flow" className="admin-configuration-page__label">
                  Flujos de Verificación
                </label>
                <select
                  id="verification-flow"
                  className="admin-configuration-page__select"
                  value={verificationFlow}
                  onChange={(e) => setVerificationFlow(e.target.value)}
                >
                  <option value="standard-2">Flujo Estándar de 2 Pasos</option>
                  <option value="standard-3">Flujo Estándar de 3 Pasos</option>
                  <option value="extended">Flujo Extendido</option>
                </select>
              </div>
              <div className="admin-configuration-page__field">
                <Input
                  id="approval-criteria"
                  fullWidth
                  label="Criterios de Aprobación"
                  value={approvalCriteria}
                  onChange={(e) => setApprovalCriteria(e.target.value)}
                  className="admin-configuration-page__input"
                />
              </div>
              <div className="admin-configuration-page__field">
                <span id="doc-types-label" className="admin-configuration-page__label">
                  Tipos de Documentos Permitidos
                </span>
                <div className="admin-configuration-page__checkboxes" aria-labelledby="doc-types-label">
                  <label className="admin-configuration-page__checkbox-label">
                    <input
                      type="checkbox"
                      checked={allowedDocTypes.cedula}
                      onChange={() => handleToggleDocType("cedula")}
                      className="admin-configuration-page__checkbox"
                    />
                    <span className="admin-configuration-page__checkbox-text">Cédula</span>
                  </label>
                  <label className="admin-configuration-page__checkbox-label">
                    <input
                      type="checkbox"
                      checked={allowedDocTypes.pasaporte}
                      onChange={() => handleToggleDocType("pasaporte")}
                      className="admin-configuration-page__checkbox"
                    />
                    <span className="admin-configuration-page__checkbox-text">Pasaporte</span>
                  </label>
                  <label className="admin-configuration-page__checkbox-label">
                    <input
                      type="checkbox"
                      checked={allowedDocTypes.partidaNacimiento}
                      onChange={() => handleToggleDocType("partidaNacimiento")}
                      className="admin-configuration-page__checkbox"
                    />
                    <span className="admin-configuration-page__checkbox-text">Partida de Nacimiento</span>
                  </label>
                </div>
              </div>
              <div className="admin-configuration-page__field">
                <Input
                  id="time-limit-days"
                  fullWidth
                  type="text"
                  label="Límites de Tiempo (días)"
                  value={timeLimitDays}
                  onChange={(e) => setTimeLimitDays(e.target.value)}
                  className="admin-configuration-page__input"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* CONFIGURACIÓN DE EXPEDIENTES */}
        <section className="admin-configuration-page__section">
          <Card variant="elevated" className="admin-configuration-page__card">
            <h3 className="admin-configuration-page__section-title">CONFIGURACIÓN DE EXPEDIENTES</h3>
            <div className="admin-configuration-page__fields">
              <div className="admin-configuration-page__field">
                <label htmlFor="review-template" className="admin-configuration-page__label">
                  Plantillas de Revisión
                </label>
                <select
                  id="review-template"
                  className="admin-configuration-page__select"
                  value={reviewTemplate}
                  onChange={(e) => setReviewTemplate(e.target.value)}
                >
                  <option value="general">Plantilla General</option>
                  <option value="pregrado">Plantilla Pregrado</option>
                  <option value="postgrado">Plantilla Postgrado</option>
                </select>
              </div>
              <div className="admin-configuration-page__field">
                <Input
                  id="labels-and-states"
                  fullWidth
                  label="Etiquetas y Estados"
                  value={labelsAndStates}
                  onChange={(e) => setLabelsAndStates(e.target.value)}
                  className="admin-configuration-page__input"
                />
              </div>
              <div className="admin-configuration-page__field">
                <span id="validation-notifications-label" className="admin-configuration-page__label">
                  Notificaciones de Validación
                </span>
                <div className="admin-configuration-page__checkboxes" aria-labelledby="validation-notifications-label">
                  <label className="admin-configuration-page__checkbox-label">
                    <input
                      type="checkbox"
                      checked={notifyAdmin}
                      onChange={(e) => setNotifyAdmin(e.target.checked)}
                      className="admin-configuration-page__checkbox"
                    />
                    <span className="admin-configuration-page__checkbox-text">Notificar al Administrador</span>
                  </label>
                  <label className="admin-configuration-page__checkbox-label">
                    <input
                      type="checkbox"
                      checked={notifyApplicant}
                      onChange={(e) => setNotifyApplicant(e.target.checked)}
                      className="admin-configuration-page__checkbox"
                    />
                    <span className="admin-configuration-page__checkbox-text">Notificar al Solicitante</span>
                  </label>
                  <label className="admin-configuration-page__radio-label">
                    <input
                      type="radio"
                      name="daily-summary"
                      checked={sendDailySummary}
                      onChange={() => setSendDailySummary(true)}
                      className="admin-configuration-page__radio"
                    />
                    <span className="admin-configuration-page__checkbox-text">Enviar Resumen Diario</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <div className="admin-configuration-page__actions">
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </DashboardTemplate>
  );
};
