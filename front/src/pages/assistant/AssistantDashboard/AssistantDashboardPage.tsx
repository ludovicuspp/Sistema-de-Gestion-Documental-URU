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
import {
  recordsService,
  tasksService,
  ApiError,
  clearSession,
} from "@/services/api";
import type { RecentHistoryDto, TaskDto } from "@/services/api";
import "./AssistantDashboardPage.css";

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  { label: "+ Crear expediente", onClick: () => {}, primary: true },
  { label: "Subir documento", onClick: () => {} },
  { label: "Ver solicitudes", onClick: () => {} },
];

const MAX_REMINDER_CHARS = 200;

const formatHistoryEntry = (h: RecentHistoryDto): ActivityEntry => {
  const who = h.studentName?.trim() || h.userName?.trim() || "";
  let text = who ? `${h.action} — ${who}` : h.action;
  if (h.detail?.trim()) text += `: ${h.detail}`;
  return { text, datetime: h.createdAt };
};

const formatReminder = (t: TaskDto): string =>
  t.dueDate ? `${t.title} — vence ${t.dueDate.slice(0, 10)}` : t.title;

/**
 * AssistantDashboardPage - Page (Asistente)
 *
 * Panel principal para el rol Asistente: Recordatorios, Accesos rápidos,
 * Actividad reciente y Panel de tareas. Misma estructura y base que Admin/Verificador.
 * Recordatorios derivados de tareas pendientes reales; actividad de recentHistory.
 */
export const AssistantDashboardPage = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<string[]>([]);
  const [todo, setTodo] = useState<string[]>([]);
  const [inProgress, setInProgress] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [addReminderOpen, setAddReminderOpen] = useState(false);
  const [newReminderText, setNewReminderText] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [allTasks, history] = await Promise.all([
          tasksService.list(),
          recordsService.recentHistory(10),
        ]);
        const byStatus = (status: string) =>
          allTasks
            .filter((t) => t.status.toUpperCase() === status)
            .slice(0, 5);
        const pending = byStatus("PENDIENTE");
        setReminders(pending.map(formatReminder));
        setTodo(pending.map((t) => t.title));
        setInProgress(byStatus("EN_PROCESO").map((t) => t.title));
        setCompleted(byStatus("COMPLETADA").map((t) => t.title));
        setActivityEntries(history.map(formatHistoryEntry));
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          clearSession();
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

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
              todo={loading ? [] : todo}
              inProgress={loading ? [] : inProgress}
              completed={loading ? [] : completed}
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
