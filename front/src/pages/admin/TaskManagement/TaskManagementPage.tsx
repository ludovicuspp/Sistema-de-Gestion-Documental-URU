import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { TaskFiltersCard } from "@/components/organisms/TaskFiltersCard";
import { TaskListCard } from "@/components/organisms/TaskListCard";
import { TaskDetailCard } from "@/components/organisms/TaskDetailCard";
import { TaskRecentCard } from "@/components/organisms/TaskRecentCard";
import { TaskFormModal } from "@/components/molecules/TaskFormModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AlertModal } from "@/components/molecules/AlertModal";
import type { TaskFilterTab } from "@/components/organisms/TaskFiltersCard";
import type { TaskListItem } from "@/components/organisms/TaskListCard";
import type { TaskDetail } from "@/components/organisms/TaskDetailCard";
import { tasksService } from "@/services/api/tasksService";
import type { TaskDto } from "@/services/api/tasksService";
import { ApiError, clearSession } from "@/services/api/http";
import "./TaskManagementPage.css";

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
 * TaskManagementPage - Page (Admin)
 *
 * Task management view: filters, list, detail, recent tasks. Datos del backend real.
 */
export const TaskManagementPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TaskFilterTab>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleAuthError = (err: unknown): boolean => {
    if (err instanceof ApiError && err.status === 401) {
      clearSession();
      navigate("/");
      return true;
    }
    return false;
  };

  const showError = (err: unknown) => {
    if (handleAuthError(err)) return;
    setAlertMessage(
      err instanceof ApiError ? err.message : "Error al cargar las tareas. Intente nuevamente."
    );
  };

  const load = useCallback(async (tab: TaskFilterTab) => {
    setLoading(true);
    try {
      let data: TaskDto[];
      if (tab === "pending") {
        const [pending, inProgress] = await Promise.all([
          tasksService.list({ status: "PENDIENTE" }),
          tasksService.list({ status: "EN_PROCESO" }),
        ]);
        data = [...pending, ...inProgress].sort((a, b) =>
          (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
        );
      } else if (tab === "completed") {
        data = await tasksService.list({ status: "COMPLETADA" });
      } else {
        data = await tasksService.list();
      }
      setTasks(data);
      setSelectedId((prev) =>
        prev != null && data.some((t) => String(t.id) === prev)
          ? prev
          : data.length > 0
            ? String(data[0].id)
            : null
      );
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void load(activeTab);
  }, [load, activeTab]);

  const items = useMemo(() => tasks.map(toListItem), [tasks]);

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
    );
  }, [items, search]);

  const recent = useMemo(() => items.slice(0, 3), [items]);

  const selectedDetail = useMemo(() => {
    if (selectedId == null) return null;
    const found = tasks.find((t) => String(t.id) === selectedId);
    return found ? toDetail(found) : null;
  }, [tasks, selectedId]);

  const handleCreateTask = useCallback(() => {
    setTaskModalOpen(true);
  }, []);

  const handleTaskSubmit = useCallback(
    async (data: {
      title: string;
      assignee: string;
      assignmentDate: string;
      dueDate: string;
      status: "Pendiente" | "Finalizada";
      description: string;
      workDetail: string[];
    }) => {
      try {
        await tasksService.create({
          title: data.title.trim(),
          description: data.description.trim() || undefined,
          detail: data.workDetail.join("\n") || undefined,
          assignedToName: data.assignee.trim() || undefined,
          dueDate: data.dueDate || undefined,
        });
        await load(activeTab);
      } catch (err) {
        showError(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [load, activeTab]
  );

  const handleDelete = useCallback((id: string) => {
    setDeletingTaskId(id);
    setConfirmDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingTaskId) return;
    try {
      await tasksService.remove(Number(deletingTaskId));
      setConfirmDeleteOpen(false);
      setDeletingTaskId(null);
      await load(activeTab);
    } catch (err) {
      setConfirmDeleteOpen(false);
      showError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletingTaskId, load, activeTab]);

  const handleMarkPending = useCallback(async () => {
    if (selectedId == null) return;
    try {
      await tasksService.updateStatus(Number(selectedId), "PENDIENTE");
      await load(activeTab);
    } catch (err) {
      showError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, load, activeTab]);

  const handleNotifyAssigned = useCallback(async () => {
    if (selectedId == null) return;
    try {
      await tasksService.updateStatus(Number(selectedId), "EN_PROCESO");
      await load(activeTab);
    } catch (err) {
      showError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, load, activeTab]);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const visibleList = loading ? [] : filteredList;
  const visibleRecent = loading ? [] : recent;

  return (
    <DashboardTemplate
      currentView="Gestión de tareas"
      userRole="Administrador"
      userEmail="username@mail.co"
      onLogout={handleLogout}
      onCreateUser={() => {}}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
    >
      <div className="task-management">
        <TaskFiltersCard
          searchValue={search}
          onSearchChange={setSearch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreateTask={handleCreateTask}
        />
        <TaskListCard
          items={visibleList}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={handleDelete}
        />
        <TaskDetailCard
          task={selectedDetail}
          onMarkPending={handleMarkPending}
          onNotifyAssigned={handleNotifyAssigned}
        />
        <TaskRecentCard
          items={visibleRecent}
          selectedId={selectedId}
          onViewAll={() => {}}
          onSelect={setSelectedId}
          onDelete={handleDelete}
        />
      </div>
      <TaskFormModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        task={null}
        onSubmit={(data) => void handleTaskSubmit(data)}
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => { setConfirmDeleteOpen(false); setDeletingTaskId(null); }}
        label="Eliminar"
        message="¿Seguro que desea eliminar la tarea?"
        onConfirm={() => void handleConfirmDelete()}
      />
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
