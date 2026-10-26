import { apiFetch, type PageResponse } from "./http";

export interface RequestDocumentDto {
  documentTypeId?: number | null;
  name: string;
}

export interface RequestDto {
  id: number;
  trackingCode: string;
  ci: string;
  fullName: string;
  email: string;
  phone?: string | null;
  comment?: string | null;
  status: string;
  createdAt: string;
  documents: RequestDocumentDto[];
}

export interface RequestStats {
  total: number;
  received: number;
  inProgress: number;
  completed: number;
}

export interface PublicRequestPayload {
  ci: string;
  fullName: string;
  email: string;
  phone?: string;
  comment?: string;
  documents: { documentTypeId?: number; name: string }[];
}

export interface PublicRequestReceipt {
  trackingCode: string;
  status: string;
  createdAt: string;
}

const BASE = "/api/v1/requests";
const PUBLIC_BASE = "/api/v1/public/requests";

export const requestsService = {
  async list(status?: string, page = 0, size = 20): Promise<PageResponse<RequestDto>> {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) query.set("status", status);
    return apiFetch<PageResponse<RequestDto>>(`${BASE}?${query.toString()}`);
  },

  async stats(): Promise<RequestStats> {
    return apiFetch<RequestStats>(`${BASE}/stats`);
  },

  async get(id: number): Promise<RequestDto> {
    return apiFetch<RequestDto>(`${BASE}/${id}`);
  },

  async updateStatus(id: number, status: string): Promise<RequestDto> {
    return apiFetch<RequestDto>(`${BASE}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

export const publicRequestsService = {
  async create(payload: PublicRequestPayload): Promise<PublicRequestReceipt> {
    return apiFetch<PublicRequestReceipt>(PUBLIC_BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async tracking(trackingCode: string): Promise<PublicRequestReceipt> {
    return apiFetch<PublicRequestReceipt>(
      `${PUBLIC_BASE}/${encodeURIComponent(trackingCode.trim().toUpperCase())}`,
    );
  },
};
