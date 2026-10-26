import { apiFetch, type PageResponse } from "./http";

export interface TaskDto {
  id: number;
  title: string;
  description?: string | null;
  detail?: string | null;
  assignedToId?: number | null;
  assignedToName?: string | null;
  dueDate?: string | null;
  status: string;
  createdByName?: string | null;
  createdAt: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface TaskRequest {
  title: string;
  description?: string;
  detail?: string;
  assignedToId?: number;
  assignedToName?: string;
  dueDate?: string;
}

const BASE = "/api/v1/tasks";

export const tasksService = {
  async list(
    params: { assignedTo?: number; status?: string } = {},
    page = 0,
    size = 20,
  ): Promise<PageResponse<TaskDto>> {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (params.assignedTo != null) query.set("assignedTo", String(params.assignedTo));
    if (params.status) query.set("status", params.status);
    return apiFetch<PageResponse<TaskDto>>(`${BASE}?${query.toString()}`);
  },

  async stats(): Promise<TaskStats> {
    return apiFetch<TaskStats>(`${BASE}/stats`);
  },

  async create(request: TaskRequest): Promise<TaskDto> {
    return apiFetch<TaskDto>(BASE, { method: "POST", body: JSON.stringify(request) });
  },

  async updateStatus(id: number, status: string): Promise<TaskDto> {
    return apiFetch<TaskDto>(`${BASE}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async remove(id: number): Promise<void> {
    await apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
  },
};
