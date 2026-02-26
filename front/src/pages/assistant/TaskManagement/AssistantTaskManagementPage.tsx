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
  {
    id: "3",
    title: "Digitalizar partidas de nacimiento - Lote B",
    assignee: "Asistente",
    assignmentDate: "2025-11-12",
    dueDate: "2025-12-05",
    status: "Pendiente",
  },
  {
    id: "4",
    title: "Cargar cédulas de identidad pendientes",
    assignee: "Asistente",
    assignmentDate: "2025-11-13",
    dueDate: "2025-11-28",
    status: "Pendiente",
  },
  {
    id: "5",
    title: "Verificar expedientes del grupo de Postgrado",
    assignee: "Asistente",
    assignmentDate: "2025-11-10",
    dueDate: "2025-12-01",
    status: "Pendiente",
  },
  {
    id: "6",
    title: "Actualizar documentos de expedientes en revisión",
    assignee: "Asistente",
    assignmentDate: "2025-11-14",
    dueDate: "2025-11-30",
    status: "Pendiente",
  },
  {
    id: "7",
    title: "Subir notas certificadas - Segundo semestre",
    assignee: "Asistente",
    assignmentDate: "2025-11-09",
    dueDate: "2025-11-25",
    status: "Finalizada",
  },
  {
    id: "8",
    title: "Revisión de expedientes - Cohorte 2024",
    assignee: "Asistente",
    assignmentDate: "2025-11-08",
    dueDate: "2025-12-10",
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
  "3": {
    id: "3",
    title: "Digitalizar partidas de nacimiento - Lote B",
    assignee: "Asistente",
    assignmentDate: "2025-11-12",
    dueDate: "2025-12-05",
    status: "Pendiente",
    description: "Escanear y subir al sistema las partidas de nacimiento del lote B. Asegurar que cada documento esté legible y asociado al expediente correcto.",
    workDetail: [
      "Revisar listado de expedientes del lote B.",
      "Escanear partidas en orden.",
      "Subir archivos PDF al sistema.",
      "Verificar vinculación con expediente.",
    ],
    historyCount: 0,
    historyResponsible: "—",
  },
  "4": {
    id: "4",
    title: "Cargar cédulas de identidad pendientes",
    assignee: "Asistente",
    assignmentDate: "2025-11-13",
    dueDate: "2025-11-28",
    status: "Pendiente",
    description: "Cargar las cédulas de identidad que están pendientes en el listado de expedientes sin documento de identidad.",
    workDetail: [
      "Descargar listado de expedientes sin cédula.",
      "Solicitar o recopilar copias escaneadas.",
      "Subir cada cédula al expediente correspondiente.",
      "Marcar como cargado en el sistema.",
    ],
    historyCount: 1,
    historyResponsible: "Admin",
  },
  "5": {
    id: "5",
    title: "Verificar expedientes del grupo de Postgrado",
    assignee: "Asistente",
    assignmentDate: "2025-11-10",
    dueDate: "2025-12-01",
    status: "Pendiente",
    description: "Revisar que los expedientes de estudiantes de postgrado tengan todos los documentos requeridos y estén correctamente organizados.",
    workDetail: [
      "Revisar requisitos de documentación para postgrado.",
      "Verificar cada expediente del listado.",
      "Registrar observaciones si faltan documentos.",
      "Notificar al verificador cuando esté completo.",
    ],
    historyCount: 2,
    historyResponsible: "Verificador",
  },
  "6": {
    id: "6",
    title: "Actualizar documentos de expedientes en revisión",
    assignee: "Asistente",
    assignmentDate: "2025-11-14",
    dueDate: "2025-11-30",
    status: "Pendiente",
    description: "Incorporar las versiones actualizadas de documentos que fueron devueltos con observaciones en la ronda anterior.",
    workDetail: [
      "Revisar expedientes con estado 'En revisión'.",
      "Localizar documentos reemplazo o corregidos.",
      "Subir nuevas versiones manteniendo trazabilidad.",
      "Actualizar estado del expediente.",
    ],
    historyCount: 1,
    historyResponsible: "Admin",
  },
  "7": {
    id: "7",
    title: "Subir notas certificadas - Segundo semestre",
    assignee: "Asistente",
    assignmentDate: "2025-11-09",
    dueDate: "2025-11-25",
    status: "Finalizada",
    description: "Subir y verificar las notas certificadas del segundo semestre para los expedientes indicados.",
    workDetail: [
      "Verificar documentos escaneados.",
      "Agregar observaciones por documento si aplica.",
      "Marcar expediente como validado en el sistema.",
    ],
    historyCount: 1,
    historyResponsible: "Admin",
  },
  "8": {
    id: "8",
    title: "Revisión de expedientes - Cohorte 2024",
    assignee: "Asistente",
    assignmentDate: "2025-11-08",
    dueDate: "2025-12-10",
    status: "Pendiente",
    description: "Revisión integral de los expedientes de la cohorte 2024 para asegurar que cumplan con todos los requisitos antes del cierre del período.",
    workDetail: [
      "Verificar completitud de cada expediente.",
      "Confirmar que documentos estén legibles y vigentes.",
      "Documentar observaciones en el sistema.",
      "Reportar resumen al administrador.",
    ],
    historyCount: 0,
    historyResponsible: "—",
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
  const [list, setList] = useState<TaskListItem[]>(MOCK_LIST);
  const [details, setDetails] = useState<Record<string, TaskDetail>>(MOCK_DETAILS);

  const selectedDetail = selectedId == null ? null : (details[selectedId] ?? null);

  const handleMarkCompleted = () => {
    if (selectedId == null) return;
    setList((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, status: "Finalizada" as const } : item
      )
    );
    setDetails((prev) => {
      const d = prev[selectedId];
      if (!d) return prev;
      return { ...prev, [selectedId]: { ...d, status: "Finalizada" } };
    });
  };

  const handleMarkPending = () => {
    if (selectedId == null) return;
    setList((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, status: "Pendiente" as const } : item
      )
    );
    setDetails((prev) => {
      const d = prev[selectedId];
      if (!d) return prev;
      return { ...prev, [selectedId]: { ...d, status: "Pendiente" } };
    });
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
            onMarkPending={handleMarkPending}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};
