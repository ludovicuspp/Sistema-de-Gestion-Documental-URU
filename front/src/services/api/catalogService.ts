import { apiFetch, type PageResponse } from "./http";

export interface CareerDto {
  id: number;
  name: string;
  code?: string | null;
}

export interface OptionDto {
  id: number;
  name: string;
}

export interface DocumentTypeDto {
  id: number;
  name: string;
  required: boolean;
  academicLevelId?: number | null;
}

const BASE = "/api/v1/catalog";

export const catalogService = {
  async careers(page = 0, size = 20): Promise<PageResponse<CareerDto>> {
    return apiFetch<PageResponse<CareerDto>>(`${BASE}/careers?page=${page}&size=${size}`);
  },

  async createCareer(name: string, code?: string): Promise<CareerDto> {
    return apiFetch<CareerDto>(`${BASE}/careers`, {
      method: "POST",
      body: JSON.stringify({ name, code }),
    });
  },

  async updateCareer(id: number, name: string, code?: string): Promise<CareerDto> {
    return apiFetch<CareerDto>(`${BASE}/careers/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, code }),
    });
  },

  async deleteCareer(id: number): Promise<void> {
    await apiFetch<void>(`${BASE}/careers/${id}`, { method: "DELETE" });
  },

  async academicLevels(): Promise<OptionDto[]> {
    return apiFetch<OptionDto[]>(`${BASE}/academic-levels`);
  },

  async documentTypes(page = 0, size = 20): Promise<PageResponse<DocumentTypeDto>> {
    return apiFetch<PageResponse<DocumentTypeDto>>(`${BASE}/document-types?page=${page}&size=${size}`);
  },

  async createDocumentType(
    name: string,
    required: boolean,
    academicLevelId?: number,
  ): Promise<DocumentTypeDto> {
    return apiFetch<DocumentTypeDto>(`${BASE}/document-types`, {
      method: "POST",
      body: JSON.stringify({ name, required, academicLevelId }),
    });
  },

  async updateDocumentType(
    id: number,
    name: string,
    required: boolean,
    academicLevelId?: number,
  ): Promise<DocumentTypeDto> {
    return apiFetch<DocumentTypeDto>(`${BASE}/document-types/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, required, academicLevelId }),
    });
  },

  async deleteDocumentType(id: number): Promise<void> {
    await apiFetch<void>(`${BASE}/document-types/${id}`, { method: "DELETE" });
  },

  async mimeTypes(): Promise<OptionDto[]> {
    return apiFetch<OptionDto[]>(`${BASE}/mime-types`);
  },
};
