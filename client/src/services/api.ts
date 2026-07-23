import { auth } from '../firebase';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const a: any = auth;
  if (a?.currentUser) {
    const token = await a.currentUser.getIdToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const authHeaders = await getAuthHeaders();
  const res = await fetch(url, {
    headers: { ...authHeaders, ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Network error' }));
    const detail = error.detail || error.message || `HTTP ${res.status}`;
    const message = Array.isArray(detail) ? detail.map((d: { msg: string }) => d.msg).join('; ') : detail;
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
};
