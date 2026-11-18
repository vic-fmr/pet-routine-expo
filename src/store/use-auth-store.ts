import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthUser } from '../types/auth';

type AuthStore = {
  sessionToken: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  setSession: (sessionToken: string, user: AuthUser) => void;
  clearSession: () => void;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      sessionToken: null,
      user: null,
      isHydrated: false,
      setSession: (sessionToken, user) => set({ sessionToken, user }),
      clearSession: () => set({ sessionToken: null, user: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: '@petroutine:auth-session',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({
        sessionToken: state.sessionToken,
        user: state.user,
      }),
    }
  )
);
