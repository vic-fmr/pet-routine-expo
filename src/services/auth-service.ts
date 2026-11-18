import { apiFetch } from './api';
import { useAuthStore } from '../store/use-auth-store';
import { usePetStore } from '../store/use-pet-store';
import type { AuthUser } from '../types/auth';

type AuthResponse = { token: string; user: AuthUser };

export async function loginUser(email: string, password: string) {
  const result = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  useAuthStore.getState().setSession(result.token, result.user);
}

export async function signupUser(name: string, email: string, password: string) {
  const result = await apiFetch<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, seedInitialPets: false }),
  });
  useAuthStore.getState().setSession(result.token, result.user);
}

export async function logoutUser() {
  try {
    await apiFetch<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
  } finally {
    useAuthStore.getState().clearSession();
    usePetStore.getState().clearPets();
  }
}
