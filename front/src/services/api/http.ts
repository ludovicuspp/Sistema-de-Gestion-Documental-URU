/**
 * Cliente HTTP unico para la API.
 * En Docker, Nginx sirve la SPA y hace proxy de /api/v1/* (mismo origen).
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "sidae.token";
const USER_KEY = "sidae.user";

export interface ApiErrorBody {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiErrorBody;
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export interface SessionUser {
  email: string;
  username: string;
  role: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export function saveSession(token: string, user: SessionUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.error?.code ?? "HTTP_ERROR",
      payload?.error?.message ?? `Error ${response.status}`,
      response.status,
    );
  }
  return payload.data;
}

/** Respuesta paginada del backend (ApiResponse.data). */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** Query string para endpoints paginados (?page=&size=). */
export function pageParams(page: number, size: number): string {
  return `page=${page}&size=${size}`;
}

/** Descarga binaria (el backend exige Authorization, asi que no sirve un <a href> directo). */
export async function apiFetchBlob(path: string): Promise<Blob> {
  const headers = new Headers();
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${BASE_URL}${path}`, { headers });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
    throw new ApiError(
      payload?.error?.code ?? "HTTP_ERROR",
      payload?.error?.message ?? `Error ${response.status}`,
      response.status,
    );
  }
  return response.blob();
}
