/**
 * api.ts — Centralised API client for SmartWave ERP
 *
 * CHANGE: All backend communication is funnelled through this file.
 * The base URL is read from NEXT_PUBLIC_API_BASE_URL (set in .env.local)
 * instead of being hardcoded in each component.
 *
 * Usage:
 *   import { authApi } from '@/lib/api';
 *   const response = await authApi.login('admin', 'password');
 */

// ----------------------------------------------------------------
// Base URL — sourced from .env.local
// Falls back to localhost:8080 for safety in case the var is missing.
// ----------------------------------------------------------------
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

// ----------------------------------------------------------------
// Types — mirror the backend DTOs
// ----------------------------------------------------------------

/** Shape returned by POST /auth/login and POST /auth/register */
export interface AuthResponse {
  token: string;
  type: string;       // always "Bearer"
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;       // "ADMIN" | "MANAGER" | "CASHIER" | "INVENTORY_CLERK"
}

/** Shape expected by POST /auth/register */
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;      // defaults to "CASHIER" if omitted
}

/** Shape returned by GET /api/users and GET /api/users/:id */
export interface UserDTO {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

/**
 * Retrieve the JWT token stored after login.
 * Returns null if the user is not authenticated.
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null; // SSR guard
  return localStorage.getItem('smartwave_token');
}

/**
 * Save the full auth response to localStorage after a successful login.
 * Components can call getStoredToken() to get the JWT for protected requests.
 */
export function saveAuthData(data: AuthResponse): void {
  localStorage.setItem('smartwave_token', data.token);
  localStorage.setItem('smartwave_user', JSON.stringify({
    id: data.id,
    username: data.username,
    email: data.email,
    fullName: data.fullName,
    role: data.role,
  }));
}

/** Remove all auth data (used on logout). */
export function clearAuthData(): void {
  localStorage.removeItem('smartwave_token');
  localStorage.removeItem('smartwave_user');
}

/** Build the Authorization header for protected API calls. */
function authHeader(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ----------------------------------------------------------------
// Auth API  — maps to /auth/** (public, no token required)
// ----------------------------------------------------------------
export const authApi = {
  /**
   * POST /auth/login
   * Authenticates a user and returns a JWT token + user info.
   *
   * Body: { username, password }
   * Response: AuthResponse
   */
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      // Attempt to parse an error message from the backend response
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message ?? `Login failed (${res.status})`);
    }

    return res.json() as Promise<AuthResponse>;
  },

  /**
   * POST /auth/register
   * Registers a new user and returns a JWT token + user info.
   *
   * Body: { username, email, password, fullName, role? }
   * Response: AuthResponse
   * Requires: ADMIN role (enforced server-side)
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message ?? `Registration failed (${res.status})`);
    }

    return res.json() as Promise<AuthResponse>;
  },
};

// ----------------------------------------------------------------
// User Management API  — maps to /api/users/** (protected)
// ----------------------------------------------------------------
export const userApi = {
  /**
   * GET /api/users
   * Returns all users.
   * Requires: ADMIN or MANAGER role.
   */
  getAll: async (): Promise<UserDTO[]> => {
    const res = await fetch(`${API_BASE}/api/users`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
    return res.json();
  },

  /**
   * GET /api/users/:id
   * Returns a single user by ID.
   * Requires: ADMIN or MANAGER role.
   */
  getById: async (id: number): Promise<UserDTO> => {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch user ${id} (${res.status})`);
    return res.json();
  },

  /**
   * PUT /api/users/:id
   * Updates a user's details.
   * Requires: ADMIN role.
   */
  update: async (id: number, data: Partial<UserDTO>): Promise<UserDTO> => {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update user ${id} (${res.status})`);
    return res.json();
  },

  /**
   * DELETE /api/users/:id
   * Deletes a user.
   * Requires: ADMIN role.
   */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to delete user ${id} (${res.status})`);
  },

  /**
   * PATCH /api/users/:id/role?role=ADMIN
   * Changes a user's role.
   * Requires: ADMIN role.
   */
  changeRole: async (id: number, role: string): Promise<UserDTO> => {
    const res = await fetch(`${API_BASE}/api/users/${id}/role?role=${role}`, {
      method: 'PATCH',
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to change role for user ${id} (${res.status})`);
    return res.json();
  },

  /**
   * PATCH /api/users/:id/toggle-status
   * Toggles a user's active/inactive status.
   * Requires: ADMIN role.
   */
  toggleStatus: async (id: number): Promise<UserDTO> => {
    const res = await fetch(`${API_BASE}/api/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to toggle status for user ${id} (${res.status})`);
    return res.json();
  },
};

// ----------------------------------------------------------------
// Health API  — maps to GET /api/health (public)
// ----------------------------------------------------------------
export const healthApi = {
  /**
   * GET /api/health
   * Checks if the backend is up.
   */
  check: async (): Promise<{ status: string; service: string; version: string }> => {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error('Health check failed');
    const body = await res.json();
    return body.data ?? body; // HealthController wraps in ApiResponse
  },
};
