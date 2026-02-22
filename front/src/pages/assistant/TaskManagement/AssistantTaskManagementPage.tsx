import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { TaskFiltersCard } from "@/components/organisms/TaskFiltersCard";
import { TaskListCard } from "@/components/organisms/TaskListCard";
import { TaskDetailCard } from "@/components/organisms/TaskDetailCard";
import type { TaskFilterTab } from "@/components/organisms/TaskFiltersCard";
import type { TaskListItem } from "@/components/organisms/TaskListCard";
import type { TaskDetail } from "@/components/organisms/TaskDetailCard";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./AssistantTaskManagementPage.css";

const MOCK_LIST: TaskListItem[] = [
  { id: "1", title: "Revisión de partidas - Grupo A", assignee: "Asistente A", assignmentDate: "2025-11-13", dueDate: "2025-12-02", status: "Pendiente" },
  { id: "2", title: "Subir actas lote 12", assignee: "Asistente B", assignmentDate: "2025-11-11", dueDate: "2025-12-02", status: "Pendiente" },
];

const MOCK_DETAILS: Record<string, TaskDetail> = {
  "1": {
    id: "1",
    title: "Revisión de partidas - Grupo A",
    assignee: "Asistente A",
    assignmentDate: "2025-11-13",
    dueDate: "2025-12-02",
    status: "Pendiente",
    description: "Revisar integridad y legibilidad de partidas de nacimiento del lote A. Reportar observaciones y marcar como validada.",
    workDetail: [
      "Verificar documentos escaneados.",
      "Agregar observaciones por documento si aplica.",
      "Marcar expediente como validado en el sistema.",
    ],
    historyCount: 1,
    historyResponsible: "Admin",
    total: 2,
  },
  "2": {
    id: "2",
    title: "Subir actas lote 12",
    assignee: "Asistente B",
    assignmentDate: "2025-11-11",
    dueDate: "2025-12-02",
    status: "Pendiente",
    description: "Subir y verificar las actas del lote 12 de estudiantes.",
    workDetail: [
      "Verificar documentos escaneados.",
      "Subir actas al sistema.",
      "Marcar como completado.",
    ],
    historyCount: 1,
    historyResponsible: "Admin",
  },
};

export const AssistantTaskManagementPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TaskFilterTab>("assigned-to-me");
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [list] = useState<TaskListItem[]>(MOCK_LIST);

  const filteredList = useMemo(() => {
    let out = list;
    if (activeTab === "pending") out = out.filter((t) => t.status === "Pendiente");
    else if (activeTab === "assigned-to-me") out = out.filter((t) => t.status === "Pendiente");
    else if (activeTab === "completed") out = out.filter((t) => t.status === "Finalizada");
    const q = search.trim().toLowerCase();
    if (!q) return out;
    return out.filter((t) => t.title.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q));
  }, [list, search, activeTab]);

  const selectedDetail = selectedId == null ? null : (MOCK_DETAILS[selectedId] ?? null);

  const handleMarkCompleted = () => console.log("Mark task as completed", selectedId);

  return (
    <DashboardTemplate
      currentView="Tareas"
      userRole="Asistente"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={ASSISTANT_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="assistant-task-management">
        <TaskFiltersCard
          searchValue={search}
          onSearchChange={setSearch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="assistant-task-management__content">
          <TaskListCard
            title="Tareas asignadas"
            items={filteredList}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <TaskDetailCard
            task={selectedDetail}
            variant="verifier"
            subtitle="Selecciona una tarea para ver el detalle"
            onMarkCompleted={handleMarkCompleted}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};
