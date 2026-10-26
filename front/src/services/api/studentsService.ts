import { apiFetch, type PageResponse } from "./http";

export interface StudentDto {
  id: number;
  ci: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  birthdate?: string | null;
  careerId?: number | null;
  academicLevelId?: number | null;
  status: string;
  type: string;
  active: boolean;
}

export interface StudentRequest {
  ci: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  careerId?: number;
  academicLevelId?: number;
  status?: string;
  type?: string;
}

const BASE = "/api/v1/students";

export const studentsService = {
  async search(query = "", status?: string, page = 0, size = 20): Promise<PageResponse<StudentDto>> {
    const params = new URLSearchParams({ query, page: String(page), size: String(size) });
    if (status) params.set("status", status);
    return apiFetch<PageResponse<StudentDto>>(`${BASE}?${params.toString()}`);
  },

  async byCi(ci: string): Promise<StudentDto> {
    return apiFetch<StudentDto>(`${BASE}/by-ci/${encodeURIComponent(ci)}`);
  },

  async byId(id: number): Promise<StudentDto> {
    return apiFetch<StudentDto>(`${BASE}/${id}`);
  },

  async count(): Promise<number> {
    return apiFetch<number>(`${BASE}/count`);
  },

  async create(request: StudentRequest): Promise<StudentDto> {
    return apiFetch<StudentDto>(BASE, { method: "POST", body: JSON.stringify(request) });
  },

  async update(id: number, request: StudentRequest): Promise<StudentDto> {
    return apiFetch<StudentDto>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(request) });
  },

  /** Baja logica (el backend conserva egresados: RST-05). */
  async remove(id: number): Promise<void> {
    await apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
  },
};

export function studentFullName(student: Pick<StudentDto, "firstName" | "lastName">): string {
  return `${student.firstName} ${student.lastName}`;
}
