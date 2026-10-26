import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { KPICards } from "@/components/organisms/KPICards";
import { RecentTasks } from "@/components/organisms/RecentTasks";
import { Reminders } from "@/components/organisms/Reminders";
import { QuickAccess } from "@/components/organisms/QuickAccess";
import { MonthlyActivityCard } from "@/components/organisms/MonthlyActivityCard";
import { IndicatorsStatusCard } from "@/components/organisms/IndicatorsStatusCard";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import type { KPIData } from "@/components/organisms/KPICards";
import type { Task } from "@/components/organisms/RecentTasks";
import type { QuickAccessItem } from "@/components/organisms/QuickAccess";
import type { ActivityEntry } from "@/components/organisms/RecentActivity";
import {
  recordsService,
  requestsService,
  tasksService,
  ApiError,
  clearSession,
} from "@/services/api";
import type { RecentHistoryDto, TaskDto } from "@/services/api";
import "./AdminDashboardPage.css";

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  { label: "Gestionar usuarios", onClick: () => {} },
  { label: "Enviar comunicación", onClick: () => {} },
  { label: "Generar reporte", onClick: () => {}, primary: true },
];

const formatHistoryEntry = (h: RecentHistoryDto): ActivityEntry => {
  const who = h.studentName?.trim() || h.userName?.trim() || "";
  let text = who ? `${h.action} — ${who}` : h.action;
  if (h.detail?.trim()) text += `: ${h.detail}`;
  return { text, datetime: h.createdAt };
};

const formatReminder = (t: TaskDto): string =>
  t.dueDate ? `${t.title} — vence ${t.dueDate.slice(0, 10)}` : t.title;

/**
 * AdminDashboardPage - Page (Admin)
 *
 * Layout: top row = 3 KPI cards; two columns: left = KPIs + Recent tasks + (Monthly activity | Indicators);
 * right = Reminders, Quick access, Recent activity.
 * Sin fuente de datos en el backend se ocultan: QuickSummary ("Hoy") y las tarjetas
 * de usuarios inactivos / disponibilidad del sistema.
 */
export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);
  const [monthlyActivityValue, setMonthlyActivityValue] = useState<string>("—");
  const [indicatorItems, setIndicatorItems] = useState<string[]>([]);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [recordsStats, requestsStats, tasksStats, pendingTasks, history] =
          await Promise.all([
            recordsService.stats(),
            requestsService.stats(),
            tasksService.stats(),
            tasksService.list({ status: "PENDIENTE" }),
            recordsService.recentHistory(10),
          ]);

        setKpis([
          {
            value: recordsStats.total.toLocaleString("es"),
            label: "Expedientes totales",
            subtitle: `Aprobados: ${recordsStats.approved} · Rechazados: ${recordsStats.rejected}`,
          },
          {
            value: recordsStats.pending.toLocaleString("es"),
            label: "Documentos pendientes",
            subtitle: `Documentos: ${recordsStats.documents.toLocaleString("es")}`,
          },
          {
            value: (tasksStats.pending + tasksStats.inProgress).toLocaleString("es"),
            label: "Tareas activas",
            subtitle: `Pendientes: ${tasksStats.pending} · En proceso: ${tasksStats.inProgress}`,
          },
        ]);

        setTasks(
          pendingTasks.slice(0, 5).map(
            (t): Task => ({
              id: String(t.id),
              title: t.title,
              date: (t.dueDate ?? t.createdAt).slice(0, 10),
              assignee: t.assignedToName ?? undefined,
              actions: [
                { label: "Ver", onClick: () => {}, variant: "ghost" as const },
                { label: "Asignar", onClick: () => {}, variant: "primary" as const },
              ],
            }),
          ),
        );

        setReminders(pendingTasks.slice(0, 5).map(formatReminder));
        setMonthlyActivityValue(
          `Expedientes totales ${recordsStats.total.toLocaleString("es")}`,
        );
        setIndicatorItems([
          `${recordsStats.pending} Documentos pendientes`,
          `${requestsStats.received + requestsStats.inProgress} Solicitudes sin atender`,
        ]);
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
