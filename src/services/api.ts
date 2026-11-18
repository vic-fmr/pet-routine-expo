import { useAuthStore } from '../store/use-auth-store';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().sessionToken;
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (response.status === 401 || response.status === 403) {
    useAuthStore.getState().clearSession();
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    if (typeof data === 'object' && data !== null && 'error' in data) {
      const errorValue = data.error;
      throw new Error(typeof errorValue === 'string' ? errorValue : 'Falha na requisição.');
    }
    throw new Error(typeof data === 'string' ? data : 'Falha na requisição.');
  }
  // Generic result boundary: the HTTP response shape is guaranteed by each typed caller.
  return data as T;
}
