import { apiFetch, clearSession, getSessionUser, saveSession, type SessionUser } from "./http";

export interface AuthResponse {
  token: string;
  email: string;
  username: string;
  role: string;
}

export interface MeResponse {
  userId: number;
  email: string;
  username: string;
  role: string;
  active: boolean;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiFetch<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveSession(response.token, {
      email: response.email,
      username: response.username,
      role: response.role,
    });
    return response;
  },

  async me(): Promise<MeResponse> {
    return apiFetch<MeResponse>("/api/v1/auth/me");
  },

  currentUser(): SessionUser | null {
    return getSessionUser();
  },

  logout(): void {
    clearSession();
  },
};
