import { apiFetch, apiFetchBlob } from "./http";

export interface FolderDto {
  id: number;
  guidId: string;
  studentCi: string;
  studentName: string;
  folderType: string;
  status: string;
  description?: string | null;
  shelf?: string | null;
  box?: string | null;
  rowNumber?: string | null;
  createdAt: string;
}

export interface FolderRequest {
  studentCi: string;
  description?: string;
  folderType?: string;
  shelf?: string;
  box?: string;
  rowNumber?: string;
}

export interface FolderUpdateRequest {
  description?: string;
  shelf?: string;
  box?: string;
  rowNumber?: string;
}

export interface DocumentDto {
  id: number;
  name: string;
  contentType?: string | null;
  size?: number | null;
  documentTypeId?: number | null;
  createdAt: string;
}

export interface ObservationDto {
  id: number;
  documentId?: number | null;
  content: string;
  authorName?: string | null;
  createdAt: string;
}

export interface HistoryDto {
  id: number;
  action: string;
  detail?: string | null;
  userName?: string | null;
  createdAt: string;
}

export interface RecentHistoryDto extends HistoryDto {
  folderId: number;
  studentCi?: string | null;
  studentName?: string | null;
}

export interface FolderStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  documents: number;
}

const BASE = "/api/v1/records";

export const recordsService = {
  async list(params: { ci?: string; status?: string } = {}): Promise<FolderDto[]> {
    const query = new URLSearchParams();
    if (params.ci) query.set("ci", params.ci);
    if (params.status) query.set("status", params.status);
    const suffix = query.toString();
    return apiFetch<FolderDto[]>(suffix ? `${BASE}?${suffix}` : BASE);
  },

  async stats(): Promise<FolderStats> {
    return apiFetch<FolderStats>(`${BASE}/stats`);
  },

  async get(id: number): Promise<FolderDto> {
    return apiFetch<FolderDto>(`${BASE}/${id}`);
  },

  async create(request: FolderRequest): Promise<FolderDto> {
    return apiFetch<FolderDto>(BASE, { method: "POST", body: JSON.stringify(request) });
  },

  async update(id: number, request: FolderUpdateRequest): Promise<FolderDto> {
    return apiFetch<FolderDto>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(request) });
  },

  async remove(id: number): Promise<void> {
    await apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
  },

  async listDocuments(folderId: number): Promise<DocumentDto[]> {
    return apiFetch<DocumentDto[]>(`${BASE}/${folderId}/documents`);
  },

  async uploadDocument(folderId: number, file: File, documentTypeId?: number): Promise<DocumentDto> {
    const form = new FormData();
    form.append("file", file);
    if (documentTypeId != null) {
      form.append("documentTypeId", String(documentTypeId));
    }
    return apiFetch<DocumentDto>(`${BASE}/${folderId}/documents`, { method: "POST", body: form });
  },

  async downloadDocument(documentId: number): Promise<Blob> {
    return apiFetchBlob(`${BASE}/documents/${documentId}/file`);
  },

  async deleteDocument(documentId: number): Promise<void> {
    await apiFetch<void>(`${BASE}/documents/${documentId}`, { method: "DELETE" });
  },

  async verify(id: number, approved: boolean, observations?: string): Promise<FolderDto> {
    return apiFetch<FolderDto>(`${BASE}/${id}/verify`, {
      method: "POST",
      body: JSON.stringify({ approved, observations }),
    });
  },

  async listObservations(folderId: number): Promise<ObservationDto[]> {
    return apiFetch<ObservationDto[]>(`${BASE}/${folderId}/observations`);
  },

  async addObservation(folderId: number, content: string, documentId?: number): Promise<ObservationDto> {
    return apiFetch<ObservationDto>(`${BASE}/${folderId}/observations`, {
      method: "POST",
      body: JSON.stringify({ content, documentId }),
    });
  },

  async listHistory(folderId: number): Promise<HistoryDto[]> {
    return apiFetch<HistoryDto[]>(`${BASE}/${folderId}/history`);
  },

  async recentHistory(limit = 20): Promise<RecentHistoryDto[]> {
    return apiFetch<RecentHistoryDto[]>(`${BASE}/history/recent?limit=${limit}`);
  },
};
