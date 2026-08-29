import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Reminders } from "@/components/organisms/Reminders";
import { QuickAccess } from "@/components/organisms/QuickAccess";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import { TaskPanelCard } from "@/components/organisms/TaskPanelCard";
import { FormModal } from "@/components/molecules/FormModal";
import { CharacterCounter } from "@/components/atoms/CharacterCounter";
import type { QuickAccessItem } from "@/components/organisms/QuickAccess";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import { remindersService, activityService } from "@/services/api";
import "./AssistantDashboardPage.css";

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  { label: "+ Crear expediente", onClick: () => {}, primary: true },
  { label: "Subir documento", onClick: () => {} },
  { label: "Ver solicitudes", onClick: () => {} },
];

const ACTIVITY_MOCK: ActivityEntry[] = [
  { text: "Expediente #0113 creado", datetime: "2025-11-25" },
  { text: "Documento cedula.pdf subido", datetime: "2025-11-25" },
  { text: "Solicitud de José Luis revisada", datetime: "2025-11-24" },
];

const TASK_PANEL_TODO = [
  "Revisar expediente 00060-001",
  "Subir actas lote 12",
];
const TASK_PANEL_IN_PROGRESS = ["Validar documentos Verificador A"];
const TASK_PANEL_COMPLETED = ["Generar reporte mensual"];

const MAX_REMINDER_CHARS = 200;

/**
 * AssistantDashboardPage - Page (Asistente)
 *
 * Panel principal para el rol Asistente: Recordatorios, Accesos rápidos,
 * Actividad reciente y Panel de tareas. Misma estructura y base que Admin/Verificador.
 */
export const AssistantDashboardPage = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<string[]>([]);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>(ACTIVITY_MOCK);
  const [loading, setLoading] = useState(true);
  const [addReminderOpen, setAddReminderOpen] = useState(false);
  const [newReminderText, setNewReminderText] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [remindersList, activityList] = await Promise.all([
          remindersService.list(),
          activityService.getRecent(),
        ]);
        setReminders(remindersList.map((r) => r.text));
        setActivityEntries(
          activityList.map((a) => ({ text: a.text, datetime: a.datetime }))
        );
      } catch {
        setActivityEntries(ACTIVITY_MOCK);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleQuickAccess = (index: number) => {
    if (index === 0) navigate("/assistant/records");
    else if (index === 1) navigate("/assistant/documents");
    else if (index === 2) navigate("/assistant/requests");
  };

  const quickAccessWithNav = QUICK_ACCESS_ITEMS.map((item, i) => ({
    ...item,
    onClick: () => handleQuickAccess(i),
  }));

  const handleCloseAddReminder = () => {
    setAddReminderOpen(false);
    setNewReminderText("");
  };

  const handleSubmitAddReminder = () => {
    const text = newReminderText.trim();
    if (text) {
      setReminders((prev) => [...prev, text]);
      handleCloseAddReminder();
    }
  };

  return (
    <DashboardTemplate
      currentView="Panel principal"
      userRole="Asistente"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={ASSISTANT_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="assistant-dashboard">
        <div className="assistant-dashboard__grid">
          <div className="assistant-dashboard__left">
            <Reminders
              items={loading ? [] : reminders}
              onAddReminder={() => setAddReminderOpen(true)}
            />
            <FormModal
              open={addReminderOpen}
              onClose={handleCloseAddReminder}
              label="Añadir recordatorio"
              size="md"
              submitLabel="Añadir"
              onSubmit={handleSubmitAddReminder}
            >
              <div className="form-modal__field">
                <label htmlFor="reminder-text" className="form-modal__field-label">
                  Texto del recordatorio
                </label>
                <div className="assistant-dashboard__reminder-field-wrapper">
                  <textarea
                    id="reminder-text"
                    className="form-modal__field-textarea"
                    value={newReminderText}
                    onChange={(e) => setNewReminderText(e.target.value)}
                    placeholder="Ej: Revisar expedientes pendientes..."
                    maxLength={MAX_REMINDER_CHARS}
                    rows={3}
                  />
                  <CharacterCounter
                    current={newReminderText.length}
                    max={MAX_REMINDER_CHARS}
                  />
                </div>
              </div>
            </FormModal>
            <TaskPanelCard
              todo={TASK_PANEL_TODO}
              inProgress={TASK_PANEL_IN_PROGRESS}
              completed={TASK_PANEL_COMPLETED}
            />
          </div>
          <aside className="assistant-dashboard__right">
            <QuickAccess items={quickAccessWithNav} />
            <RecentActivity
              entries={activityEntries}
              subtitle="Últimas acciones registradas"
              onViewAll={() => navigate("/assistant/requests")}
            />
          </aside>
        </div>
      </div>
    </DashboardTemplate>
  );
};
