import { auth } from '../firebase';

// Runtime API URL resolution — tries env var first, then hardcoded Render URL, then relative
const RENDER_URL = 'https://edupredict-ai-api-v90y.onrender.com/api';
function getApiBase(): string {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  // If served from GitHub Pages, use the Render backend
  if (window.location.hostname.includes('github.io')) return RENDER_URL;
  return '/api';
}

const API_BASE = getApiBase();

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const a: any = auth;
  if (a?.currentUser) {
    const token = await a.currentUser.getIdToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options?: RequestInit, timeoutMs = 30000): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const authHeaders = await getAuthHeaders();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { ...authHeaders, ...options?.headers },
      signal: controller.signal,
      ...options,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Network error' }));
      const detail = error.detail || error.message || `HTTP ${res.status}`;
      const message = Array.isArray(detail) ? detail.map((d: { msg: string }) => d.msg).join('; ') : detail;
      throw new Error(message);
    }
    return res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. The server may be starting up (free tier cold start ~30s). Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
};
