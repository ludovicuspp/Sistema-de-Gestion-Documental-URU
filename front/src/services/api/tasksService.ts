/**
 * API service: Tasks
 * Sample data for active and recent tasks.
 */

export interface TaskDto {
  id: string;
  title: string;
  date: string;
  priority?: "Alta" | "Media" | "Baja";
  assignee?: string;
}

export interface TasksSummary {
  active: number;
  subtitle: string;
  recent: TaskDto[];
}

const MOCK_TASKS: TaskDto[] = [
  {
    id: "1",
    title: "Subir estudiantes periodo 2025B",
    date: "2025-05-12",
    assignee: "Cargador N",
  },
  {
    id: "2",
    title: "Revisión masiva de expedientes",
    date: "2025-11-11",
    priority: "Alta",
    assignee: "Equipo CID",
  },
];

const MOCK: TasksSummary = {
  active: 28,
  subtitle: "Asignadas a equipo CID",
  recent: MOCK_TASKS,
};

export const tasksService = {
  async getSummary(): Promise<TasksSummary> {
    await delay(200);
    return MOCK;
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
