import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { TaskListCard } from "@/components/organisms/TaskListCard";
import { TaskDetailCard } from "@/components/organisms/TaskDetailCard";
import type { TaskListItem } from "@/components/organisms/TaskListCard";
import type { TaskDetail } from "@/components/organisms/TaskDetailCard";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./AssistantTaskManagementPage.css";

const MOCK_LIST: TaskListItem[] = [
  {
    id: "1",
    title: "Subir Fondo notas certificadas de estudiantes nuevo ingreso",
    assignee: "Asistente",
    assignmentDate: "2025-11-11",
    dueDate: "2025-12-02",
    status: "Pendiente",
  },
  {
    id: "2",
    title: "Revisar expedientes de nuevos ingresos",
    assignee: "Asistente",
    assignmentDate: "2025-11-11",
    dueDate: "2025-12-03",
    status: "Pendiente",
  },
];

const MOCK_DETAILS: Record<string, TaskDetail> = {
  "1": {
    id: "1",
    title: "Subir Fondo notas certificadas de estudiantes nuevo ingreso",
    assignee: "Asistente",
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
  "2": {
    id: "2",
    title: "Revisar expedientes de nuevos ingresos",
    assignee: "Asistente",
    assignmentDate: "2025-11-11",
    dueDate: "2025-12-03",
    status: "Pendiente",
    description: "Revisar integridad y legibilidad de expedientes de nuevos ingresos. Reportar observaciones y marcar como validada.",
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
 * AssistantTaskManagementPage - Page (Assistant)
 *
 * Task management view for Assistant role: assigned tasks list and task details.
 * Structure aligned with admin/verifier but focused on tasks assigned to the assistant.
 */
export const AssistantTaskManagementPage = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [list] = useState<TaskListItem[]>(MOCK_LIST);

  const selectedDetail = selectedId == null ? null : (MOCK_DETAILS[selectedId] ?? null);

  const handleMarkCompleted = () => {
    console.log("Mark task as completed", selectedId);
  };

  const handleStartTask = (id: string) => {
    setSelectedId(id);
  };

  return (
    <DashboardTemplate
      currentView="Gestión de tareas"
      userRole="Asistente"
      userEmail="username@mail.co"
      headerHomePath="/assistant"
      onLogout={() => navigate("/")}
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
            items={list}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onStartTask={handleStartTask}
            variant="assistant"
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
