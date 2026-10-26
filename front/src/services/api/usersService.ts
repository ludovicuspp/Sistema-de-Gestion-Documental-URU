import { apiFetch } from "./http";

export interface UserDto {
  id: number;
  email: string;
  username: string;
  role: string;
  active: boolean;
  createdAt?: string | null;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  username: string;
  /** Solo "Verificador" o "Asistente" (el backend lo valida). */
  role: string;
}

const BASE = "/api/v1/users";

export const usersService = {
  async list(query = ""): Promise<UserDto[]> {
    return apiFetch<UserDto[]>(query ? `${BASE}?query=${encodeURIComponent(query)}` : BASE);
  },

  async create(request: CreateUserRequest): Promise<UserDto> {
    return apiFetch<UserDto>(BASE, { method: "POST", body: JSON.stringify(request) });
  },

  async deactivate(id: number): Promise<void> {
    await apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" });
  },
};
