import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { KPICards } from "@/components/organisms/KPICards";
import { RecentTasks } from "@/components/organisms/RecentTasks";
import { Reminders } from "@/components/organisms/Reminders";
import { QuickAccess } from "@/components/organisms/QuickAccess";
import { QuickSummary } from "@/components/organisms/QuickSummary";
import { MonthlyActivityCard } from "@/components/organisms/MonthlyActivityCard";
import { IndicatorsStatusCard } from "@/components/organisms/IndicatorsStatusCard";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import type { KPIData } from "@/components/organisms/KPICards";
import type { Task } from "@/components/organisms/RecentTasks";
import type { QuickAccessItem } from "@/components/organisms/QuickAccess";
import type { QuickSummaryItem } from "@/components/organisms/QuickSummary";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import {
  recordsService,
  documentsService,
  tasksService,
  remindersService,
  activityService,
  indicatorsService,
} from "@/services/api";
import "./AdminDashboardPage.css";

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  { label: "Gestionar usuarios", onClick: () => {} },
  { label: "Enviar comunicación", onClick: () => {} },
  { label: "Generar reporte", onClick: () => {}, primary: true },
];

/**
 * AdminDashboardPage - Page (Admin)
 *
 * Layout: top row = 3 KPI cards; two columns: left = KPIs + Recent tasks + (Monthly activity | Indicators);
 * right = Reminders, Quick access, Quick summary, Recent activity.
 */
export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);
  const [summaryToday, setSummaryToday] = useState<QuickSummaryItem[]>([]);
  const [monthlyActivityValue, setMonthlyActivityValue] = useState<string>("Expedientes creados +84");
  const [indicatorItems, setIndicatorItems] = useState<string[]>([]);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [recordsSummary, documentsSummary, tasksSummary, remindersList, activityList, indicatorsState, summaryTodayData] = await Promise.all([
          recordsService.getSummary(),
          documentsService.getSummary(),
          tasksService.getSummary(),
          remindersService.list(),
          activityService.getRecent(),
          indicatorsService.getCurrentState(),
          indicatorsService.getSummaryToday(),
        ]);

        setKpis([
          { value: recordsSummary.total.toLocaleString("es"), label: "Expedientes totales", subtitle: `Actualizado: ${recordsSummary.updatedAt}.` },
          { value: documentsSummary.pending.toString(), label: "Documentos pendientes", subtitle: documentsSummary.subtitle },
          { value: tasksSummary.active.toString(), label: "Tareas activas", subtitle: tasksSummary.subtitle },
        ]);

        const mapTask = (t: { id: string; title: string; date: string; priority?: "Alta" | "Media" | "Baja"; assignee?: string }): Task => ({
          id: t.id,
          title: t.title,
          date: t.date,
          priority: t.priority,
          assignee: t.assignee,
          actions:
            t.priority === "Alta"
              ? [
                  { label: "Ver", onClick: () => {}, variant: "ghost" as const },
                  { label: "Asignar", onClick: () => {}, variant: "primary" as const },
                ]
              : [
                  { label: "Ver", onClick: () => {} },
                  { label: "Notificar", onClick: () => {} },
                  { label: "Marcar completada", onClick: () => {} },
                  { label: "Asignar", onClick: () => {} },
                ],
        });
        setTasks(tasksSummary.recent.map(mapTask));

        setReminders(remindersList.map((r) => r.text));
        setSummaryToday([
          { label: "Nuevos expedientes", value: summaryTodayData.newRecords },
          { label: "Documentos validados", value: summaryTodayData.validatedDocuments },
          { label: "Solicitudes procesadas", value: summaryTodayData.processedRequests },
        ]);
        setMonthlyActivityValue(`Expedientes creados +${recordsSummary.createdLast30Days}`);
        setIndicatorItems([
          `${indicatorsState.pendingDocuments} Documentos pendientes`,
          `${indicatorsState.unattendedRequests} Solicitudes sin atender`,
          `${indicatorsState.inactiveUsers} Usuarios inactivos`,
          `${indicatorsState.systemAvailability} Disponibilidad sistema`,
        ]);
        setActivityEntries(activityList.map((a) => ({ text: a.text, datetime: a.datetime })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => navigate("/");

  return (
    <DashboardTemplate
      currentView="Panel principal"
      userRole="Administrador"
      userEmail="username@mail.co"
      onLogout={handleLogout}
      onCreateUser={() => {}}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}>
      <div className="admin-dashboard">
        <div className="admin-dashboard__grid">
          <div className="admin-dashboard__left">
            <section className="admin-dashboard__kpis">
              <KPICards items={loading ? [] : kpis} />
            </section>
            <RecentTasks
              tasks={tasks}
              onViewAll={() => navigate("/admin/tasks")}
              onCreateTask={() => navigate("/admin/tasks")}
            />
            <div className="admin-dashboard__two-cards">
              <MonthlyActivityCard value={monthlyActivityValue} />
              <IndicatorsStatusCard items={loading ? [] : indicatorItems} />
            </div>
          </div>

          <aside className="admin-dashboard__right">
            <Reminders items={loading ? [] : reminders} onAddReminder={() => {}} />
            <QuickAccess items={QUICK_ACCESS_ITEMS} />
            <QuickSummary title="Resumen rápido" subtitle="Hoy" items={summaryToday} />
            <RecentActivity
              entries={activityEntries}
              subtitle="Últimas acciones registradas"
              onViewAll={() => {}}
            />
          </aside>
        </div>
      </div>
    </DashboardTemplate>
  );
};
