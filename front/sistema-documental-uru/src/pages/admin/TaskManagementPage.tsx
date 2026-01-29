import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { TaskFiltersCard } from "@/components/organisms/TaskFiltersCard";
import { TaskListCard } from "@/components/organisms/TaskListCard";
import { TaskDetailCard } from "@/components/organisms/TaskDetailCard";
import { TaskRecentCard } from "@/components/organisms/TaskRecentCard";
import type { TaskFilterTab } from "@/components/organisms/TaskFiltersCard";
import type { TaskListItem } from "@/components/organisms/TaskListCard";
import type { TaskDetail } from "@/components/organisms/TaskDetailCard";
import "./TaskManagementPage.css";

const MOCK_LIST: TaskListItem[] = [
  {
    id: "1",
    title: "Revisión de partidas - Grupo A",
    assignee: "Verificador A",
    assignmentDate: "2025-11-13",
    status: "Pendiente",
  },
  {
    id: "2",
    title: "Digitalizar cédulas batch 3",
    assignee: "Asistente B",
    assignmentDate: "2025-11-10",
    status: "Finalizada",
  },
];

const MOCK_RECENT: TaskListItem[] = [
  {
    id: "3",
    title: "Asignar escaneo - Lote 4",
    assignee: "Asistente D",
    assignmentDate: "2025-11-11",
    status: "Pendiente",
  },
];

const MOCK_DETAILS: Record<string, TaskDetail> = {
  "1": {
    id: "1",
    title: "Revisión de partidas - Grupo A",
    assignee: "Verificador A",
    assignmentDate: "2025-11-13",
    status: "Pendiente",
    description:
      "Revisar integridad y legibilidad de partidas de nacimiento del lote A. Reportar observaciones y marcar como validada.",
    workDetail: [
      "Verificar documentos escaneados.",
      "Agregar observaciones por documento si aplica.",
      "Marcar expediente como validado en el sistema.",
    ],
    historyCount: 3,
    historyResponsible: "Admin",
    total: 2,
  },
  "2": {
    id: "2",
    title: "Digitalizar cédulas batch 3",
    assignee: "Asistente B",
    assignmentDate: "2025-11-10",
    status: "Finalizada",
    description: "Digitalización del batch 3 de cédulas. Revisar calidad de escaneo y completar índice.",
    workDetail: [
      "Escanear documentos del lote.",
      "Revisar calidad de imágenes.",
      "Completar metadatos en sistema.",
    ],
    historyCount: 5,
    historyResponsible: "Admin",
  },
  "3": {
    id: "3",
    title: "Asignar escaneo - Lote 4",
    assignee: "Asistente D",
    assignmentDate: "2025-11-11",
    status: "Pendiente",
    description: "Asignar tareas de escaneo del lote 4 a los asistentes disponibles.",
    workDetail: ["Verificar disponibilidad.", "Asignar lotes.", "Registrar en sistema."],
    historyCount: 1,
    historyResponsible: "Admin",
  },
};

/**
 * TaskManagementPage - Page (Admin)
 *
 * Task management view: filters, list, detail, recent tasks.
 */
export const TaskManagementPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TaskFilterTab>("pending");
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [list] = useState<TaskListItem[]>(MOCK_LIST);
  const [recent] = useState<TaskListItem[]>(MOCK_RECENT);

  const filteredList = useMemo(() => {
    let out = list;
    if (activeTab === "pending") out = out.filter((t) => t.status === "Pendiente");
    else if (activeTab === "completed") out = out.filter((t) => t.status === "Finalizada");
    const q = search.trim().toLowerCase();
    if (!q) return out;
    return out.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
    );
  }, [list, search, activeTab]);

  const selectedDetail =
    selectedId == null ? null : (MOCK_DETAILS[selectedId] ?? null);

  const handleLogout = () => navigate("/");

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
          onCreateTask={() => {}}
        />
        <TaskListCard
          items={filteredList}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={(id) => {
            if (selectedId === id) setSelectedId(null);
          }}
        />
        <TaskDetailCard
          task={selectedDetail}
          onMarkPending={() => {}}
          onNotifyAssigned={() => {}}
        />
        <TaskRecentCard
          items={recent}
          selectedId={selectedId}
          onViewAll={() => {}}
          onSelect={setSelectedId}
          onDelete={() => {}}
        />
      </div>
    </DashboardTemplate>
  );
};
