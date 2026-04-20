/**
 * api.ts — Centralised API client for SmartWave ERP
 *
 * CHANGE: All backend communication is funnelled through this file.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

export interface SupplierDTO {
  id: number;
  name: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export interface PurchaseOrderItemResponse {
  id: number;
  variantId: number;
  productName: string;
  variantDetails: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrderResponse {
  id: number;
  supplierName: string;
  createdByFullName: string;
  approvedByFullName?: string;
  poDate: string;
  status: string;
  totalAmount: number;
  items: PurchaseOrderItemResponse[];
}

export interface PurchaseOrderRequest {
  supplierId: number;
  items: {
    variantId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('smartwave_token');
}

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

export function clearAuthData(): void {
  localStorage.removeItem('smartwave_token');
  localStorage.removeItem('smartwave_user');
}

export function getStoredUser(): AuthResponse | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('smartwave_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as AuthResponse;
  } catch {
    return null;
  }
}

function authHeader(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ----------------------------------------------------------------
// Auth API
// ----------------------------------------------------------------
export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message ?? `Login failed (${res.status})`);
    }
    return res.json();
  },

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
    return res.json();
  },
};

// ----------------------------------------------------------------
// User Management API
// ----------------------------------------------------------------
export const userApi = {
  getAll: async (): Promise<UserDTO[]> => {
    const res = await fetch(`${API_BASE}/api/users`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
    return res.json();
  },

  getById: async (id: number): Promise<UserDTO> => {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch user ${id} (${res.status})`);
    return res.json();
  },

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

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to delete user ${id} (${res.status})`);
  },

  changeRole: async (id: number, role: string): Promise<UserDTO> => {
    const res = await fetch(`${API_BASE}/api/users/${id}/role?role=${role}`, {
      method: 'PATCH',
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to change role for user ${id} (${res.status})`);
    return res.json();
  },

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
// Supplier API
// ----------------------------------------------------------------
export const supplierApi = {
  getAll: async (): Promise<SupplierDTO[]> => {
    const res = await fetch(`${API_BASE}/api/suppliers`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch suppliers (${res.status})`);
    return res.json();
  },

  getById: async (id: number): Promise<SupplierDTO> => {
    const res = await fetch(`${API_BASE}/api/suppliers/${id}`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch supplier ${id} (${res.status})`);
    return res.json();
  },

  create: async (payload: Omit<SupplierDTO, 'id'>): Promise<SupplierDTO> => {
    const res = await fetch(`${API_BASE}/api/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to create supplier (${res.status})`);
    return res.json();
  },

  update: async (id: number, payload: Partial<SupplierDTO>): Promise<SupplierDTO> => {
    const res = await fetch(`${API_BASE}/api/suppliers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update supplier ${id} (${res.status})`);
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/suppliers/${id}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to delete supplier ${id} (${res.status})`);
  },
};

// ----------------------------------------------------------------
// Procurement API
// ----------------------------------------------------------------
export const procurementApi = {
  getAll: async (): Promise<PurchaseOrderResponse[]> => {
    const res = await fetch(`${API_BASE}/api/procurement`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch POs (${res.status})`);
    const body = await res.json();
    return body.data ?? body;
  },

  getById: async (id: number): Promise<PurchaseOrderResponse> => {
    const res = await fetch(`${API_BASE}/api/procurement/${id}`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch PO ${id} (${res.status})`);
    const body = await res.json();
    return body.data ?? body;
  },

  create: async (payload: PurchaseOrderRequest): Promise<PurchaseOrderResponse> => {
    const res = await fetch(`${API_BASE}/api/procurement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message ?? `Failed to create PO (${res.status})`);
    }
    const body = await res.json();
    return body.data ?? body;
  },

  updateStatus: async (id: number, status: string): Promise<PurchaseOrderResponse> => {
    const res = await fetch(`${API_BASE}/api/procurement/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: { ...authHeader() },
    });
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message ?? `Failed to update status (${res.status})`);
    }
    const body = await res.json();
    return body.data ?? body;
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/procurement/${id}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
    });
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message ?? `Failed to delete PO (${res.status})`);
    }
  }
};

export interface ProductVariantDTO {
  id: number;
  barcode: string;
  brand?: string;
  size?: string;
  color?: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  status: string;
}

export interface ProductDTO {
  id: number;
  productName: string;
  category: string;
  variants: ProductVariantDTO[];
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
// ... (existing helpers remain)

// ----------------------------------------------------------------
// Product API — maps to /api/inventory/products/** (protected)
// ----------------------------------------------------------------
export const productApi = {
  /** Fetch all products */
  getAll: async (): Promise<ProductDTO[]> => {
    const res = await fetch(`${API_BASE}/api/inventory/products`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
    return res.json();
  },

  /** Fetch a specific product */
  getById: async (id: number): Promise<ProductDTO> => {
    const res = await fetch(`${API_BASE}/api/inventory/products/${id}`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to fetch product ${id} (${res.status})`);
    return res.json();
  },

  /** Create a new product */
  create: async (payload: Omit<ProductDTO, 'id'>): Promise<ProductDTO> => {
    const res = await fetch(`${API_BASE}/api/inventory/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message ?? `Failed to create product (${res.status})`);
    }
    return res.json();
  },

  /** Update an existing product */
  update: async (id: number, payload: Partial<ProductDTO>): Promise<ProductDTO> => {
    const res = await fetch(`${API_BASE}/api/inventory/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message ?? `Failed to update product ${id} (${res.status})`);
    }
    return res.json();
  },

  /** Delete a product */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/inventory/products/${id}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message ?? `Failed to delete product ${id} (${res.status})`);
    }
  },

  /** Add a variant to a product */
  addVariant: async (productId: number, payload: Omit<ProductVariantDTO, 'id'>): Promise<ProductVariantDTO> => {
    const res = await fetch(`${API_BASE}/api/inventory/products/${productId}/variants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to add variant");
    return res.json();
  },

  /** Fetch variant by barcode */
  getVariantByBarcode: async (barcode: string): Promise<ProductVariantDTO> => {
    const res = await fetch(`${API_BASE}/api/inventory/products/variants/barcode/${barcode}`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Variant not found for barcode: ${barcode}`);
    return res.json();
  },

  /** Fetch variant by id */
  getVariantById: async (variantId: number): Promise<ProductVariantDTO> => {
    const res = await fetch(`${API_BASE}/api/inventory/products/variants/${variantId}`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Variant not found for id: ${variantId}`);
    return res.json();
  },

  /** Update an existing variant */
  updateVariant: async (variantId: number, payload: Partial<ProductVariantDTO>): Promise<ProductVariantDTO> => {
    const res = await fetch(`${API_BASE}/api/inventory/products/variants/${variantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update variant ${variantId}`);
    return res.json();
  },

  /** Delete a variant */
  deleteVariant: async (variantId: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/inventory/products/variants/${variantId}`, {
      method: 'DELETE',
      headers: { ...authHeader() },
    });
    if (!res.ok) throw new Error(`Failed to delete variant ${variantId}`);
  },
};

// ----------------------------------------------------------------
// Health API
// ----------------------------------------------------------------
export const healthApi = {
  check: async (): Promise<{ status: string; service: string; version: string }> => {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error('Health check failed');
    const body = await res.json();
    return body.data ?? body;
  },
};
