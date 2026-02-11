import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Reminders } from "@/components/organisms/Reminders";
import { QuickAccess } from "@/components/organisms/QuickAccess";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import { TaskPanelCard } from "@/components/organisms/TaskPanelCard";
import type { QuickAccessItem } from "@/components/organisms/QuickAccess";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import { VERIFICADOR_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import { remindersService, activityService } from "@/services/api";
import "./VerifierDashboardPage.css";

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  { label: "+ Crear expediente", onClick: () => {}, primary: true },
  { label: "Subir documento", onClick: () => {} },
  { label: "Ver solicitudes", onClick: () => {} },
];

/** Activity entries for verifier dashboard (same format as activityService). */
const ACTIVITY_MOCK: ActivityEntry[] = [
  { text: "Expediente #0113 creado", datetime: "2025-11-25" },
  { text: "Documento cedula.pdf subido", datetime: "2025-11-25" },
  { text: "Solicitud de José Luis revisada", datetime: "2025-11-24" },
];

const TASK_PANEL_TODO = ["Revisar expediente 00060-001", "Subir actas lote 12"];
const TASK_PANEL_IN_PROGRESS = ["Validar documentos Verificador A"];
const TASK_PANEL_COMPLETED = ["Generar reporte mensual"];

/**
 * VerifierDashboardPage - Page (Verifier)
 *
 * Main panel for the Verifier role: Reminders, Quick access, Recent activity,
 * and Task panel. Same structure and base as AdminDashboard. UI and data in Spanish.
 */
export const VerifierDashboardPage = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<string[]>([]);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>(ACTIVITY_MOCK);
  const [loading, setLoading] = useState(true);

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
    if (index === 0) navigate("/verifier/records");
    else if (index === 1) navigate("/verifier/documents");
    else if (index === 2) navigate("/verifier/requests");
  };

  const quickAccessWithNav = QUICK_ACCESS_ITEMS.map((item, i) => ({
    ...item,
    onClick: () => handleQuickAccess(i),
  }));

  return (
    <DashboardTemplate
      currentView="Panel principal"
      userRole="Verificador"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={VERIFICADOR_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="verifier-dashboard">
        <div className="verifier-dashboard__grid">
          <div className="verifier-dashboard__left">
            <Reminders
              items={loading ? [] : reminders}
              onAddReminder={() => {}}
            />
            <TaskPanelCard
              todo={TASK_PANEL_TODO}
              inProgress={TASK_PANEL_IN_PROGRESS}
              completed={TASK_PANEL_COMPLETED}
            />
          </div>
          <aside className="verifier-dashboard__right">
            <QuickAccess items={quickAccessWithNav} />
            <RecentActivity
              entries={activityEntries}
              subtitle="Últimas acciones registradas"
              onViewAll={() => navigate("/verifier/requests")}
            />
          </aside>
        </div>
      </div>
    </DashboardTemplate>
  );
};
