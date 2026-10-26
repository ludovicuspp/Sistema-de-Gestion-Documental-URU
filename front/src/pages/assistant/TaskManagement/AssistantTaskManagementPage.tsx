import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { TaskListCard } from "@/components/organisms/TaskListCard";
import { TaskDetailCard } from "@/components/organisms/TaskDetailCard";
import { AlertModal } from "@/components/molecules/AlertModal";
import { Pagination } from "@/components/molecules/Pagination";
import { usePagedList } from "@/hooks/usePagedList";
import type { TaskListItem } from "@/components/organisms/TaskListCard";
import type { TaskDetail } from "@/components/organisms/TaskDetailCard";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import { tasksService } from "@/services/api/tasksService";
import type { TaskDto } from "@/services/api/tasksService";
import { ApiError, clearSession } from "@/services/api/http";
import "./AssistantTaskManagementPage.css";

const toListItem = (t: TaskDto): TaskListItem => ({
  id: String(t.id),
  title: t.title,
  assignee: t.assignedToName ?? t.createdByName ?? "—",
  assignmentDate: (t.createdAt ?? "").slice(0, 10),
  dueDate: t.dueDate ?? undefined,
  status: t.status === "COMPLETADA" ? "Finalizada" : "Pendiente",
});

const toDetail = (t: TaskDto): TaskDetail => ({
  ...toListItem(t),
  description: t.description ?? t.detail ?? t.title,
  workDetail: (t.detail ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean),
  historyCount: 0,
  historyResponsible: t.createdByName ?? "—",
});

/**
 * AssistantTaskManagementPage - Page (Assistant)
 *
 * Task management view for Assistant role: assigned tasks list and task details.
 * Structure aligned with admin/verifier but focused on tasks assigned to the assistant.
 * Solo lectura y cambio de estado (crear/eliminar es solo Administrador).
 */
export const AssistantTaskManagementPage = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const showError = (err: unknown) => {
    if (err instanceof ApiError && err.status === 401) {
      clearSession();
      navigate("/");
      return;
    }
    setAlertMessage(
      err instanceof ApiError ? err.message : "Error al cargar las tareas. Intente nuevamente."
    );
  };

  const loadTasksPage = useCallback(
    (page: number, size: number) => tasksService.list({}, page, size),
    []
  );

  const paged = usePagedList(loadTasksPage, 20, showError);
  const tasks = paged.items;
  const loading = paged.loading;

  useEffect(() => {
    setSelectedId((prev) =>
      prev != null && tasks.some((t) => String(t.id) === prev)
        ? prev
        : tasks.length > 0
          ? String(tasks[0].id)
          : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paged.items]);

  const items = useMemo(() => tasks.map(toListItem), [tasks]);

  const selectedDetail = useMemo(() => {
    if (selectedId == null) return null;
    const found = tasks.find((t) => String(t.id) === selectedId);
    return found ? toDetail(found) : null;
  }, [tasks, selectedId]);

  const handleMarkCompleted = useCallback(async () => {
    if (selectedId == null) return;
    try {
      await tasksService.updateStatus(Number(selectedId), "COMPLETADA");
      paged.reload();
    } catch (err) {
      showError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, paged]);

  const handleMarkPending = useCallback(async () => {
    if (selectedId == null) return;
    try {
      await tasksService.updateStatus(Number(selectedId), "PENDIENTE");
      paged.reload();
    } catch (err) {
      showError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, paged]);

  const handleStartTask = (id: string) => {
    setSelectedId(id);
  };

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const visibleItems = loading ? [] : items;

  return (
    <DashboardTemplate
      currentView="Gestión de tareas"
      userRole="Asistente"
      userEmail="username@mail.co"
      headerHomePath="/assistant"
      onLogout={handleLogout}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={ASSISTANT_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="assistant-task-management">
        <div className="assistant-task-management__content">
          <TaskListCard
            title="Tareas asignadas"
            items={visibleItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onStartTask={handleStartTask}
            variant="assistant"
          />
          <Pagination
            page={paged.page}
            totalPages={paged.totalPages}
            totalElements={paged.totalElements}
            onPageChange={paged.setPage}
          />
          <TaskDetailCard
            task={selectedDetail}
            variant="verifier"
            subtitle="Selecciona una tarea para ver el detalle o crear una nueva"
            onMarkCompleted={() => void handleMarkCompleted()}
            onMarkPending={() => void handleMarkPending()}
          />
        </div>
      </div>
      <AlertModal
        open={alertMessage != null}
        type="error"
        title="Error"
        message={alertMessage ?? ""}
        buttonLabel="Cerrar"
        onClose={() => setAlertMessage(null)}
      />
    </DashboardTemplate>
  );
};
