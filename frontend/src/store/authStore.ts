import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  credits: number | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  setCredits: (credits: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoggedIn: false,
      credits: null,
      setToken: (token) => set({ token, isLoggedIn: true }),
      clearToken: () => set({ token: null, isLoggedIn: false, credits: null }),
      setCredits: (credits) => set({ credits }),
    }),
    {
      name: "auth",
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoggedIn = !!state.token;
      },
    },
  ),
);
