import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { TaskFiltersCard } from "@/components/organisms/TaskFiltersCard";
import { TaskListCard } from "@/components/organisms/TaskListCard";
import { TaskDetailCard } from "@/components/organisms/TaskDetailCard";
import type { TaskFilterTab } from "@/components/organisms/TaskFiltersCard";
import type { TaskListItem } from "@/components/organisms/TaskListCard";
import type { TaskDetail } from "@/components/organisms/TaskDetailCard";
import { VERIFIER_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./VerifierTaskManagementPage.css";

const MOCK_LIST: TaskListItem[] = [
  {
    id: "1",
    title: "Revisión de partidas - Grupo A",
    assignee: "Verificador A",
    assignmentDate: "2025-11-13",
    dueDate: "2025-12-02",
    status: "Pendiente",
  },
  {
    id: "2",
    title: "Subir Fondo notas certificadas de estudiantes nuevo ingreso",
    assignee: "Verificador",
    assignmentDate: "2025-11-11",
    dueDate: "2025-12-02",
    status: "Pendiente",
  },
];

const MOCK_DETAILS: Record<string, TaskDetail> = {
  "1": {
    id: "1",
    title: "Revisión de partidas - Grupo A",
    assignee: "Verificador A",
    assignmentDate: "2025-11-13",
    dueDate: "2025-12-02",
    status: "Pendiente",
    description:
      "Revisar integridad y legibilidad de partidas de nacimiento del lote A. Reportar observaciones y marcar como validada.",
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
    title: "Subir Fondo notas certificadas de estudiantes nuevo ingreso",
    assignee: "Verificador",
    assignmentDate: "2025-11-11",
    dueDate: "2025-12-02",
    status: "Pendiente",
    description: "Subir y verificar las notas certificadas de los estudiantes de nuevo ingreso.",
    workDetail: [
      "Verificar documentos escaneados.",
      "Agregar observaciones por documento si aplica.",
      "Marcar expediente como validado en el sistema.",
    ],
    historyCount: 1,
    historyResponsible: "Admin",
  },
};

/**
 * VerifierTaskManagementPage - Page (Verifier)
 *
 * Task management view for Verifier role: assigned tasks list and task details.
 * Similar structure to admin but focused on tasks assigned to the verifier.
 */
export const VerifierTaskManagementPage = () => {
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
    return out.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
    );
  }, [list, search, activeTab]);

  const selectedDetail =
    selectedId == null ? null : (MOCK_DETAILS[selectedId] ?? null);

  const handleLogout = () => navigate("/");
  const handleMarkCompleted = () => {
    console.log("Mark task as completed", selectedId);
  };

  return (
    <DashboardTemplate
      currentView="Gestión de tareas"
      userRole="Verificador"
      userEmail="username@mail.co"
      headerHomePath="/verifier"
      onLogout={handleLogout}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={VERIFIER_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="verifier-task-management">
        <TaskFiltersCard
          searchValue={search}
          onSearchChange={setSearch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="verifier-task-management__content">
          <TaskListCard
            title="Tareas asignadas"
            items={filteredList}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <TaskDetailCard
            task={selectedDetail}
            variant="verifier"
            subtitle="Selecciona una tarea para ver el detalle o crear una nueva"
            onMarkCompleted={handleMarkCompleted}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};
