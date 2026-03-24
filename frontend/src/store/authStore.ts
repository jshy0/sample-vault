import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoggedIn: false,
      setToken: (token) => set({ token, isLoggedIn: true }),
      clearToken: () => set({ token: null, isLoggedIn: false }),
    }),
    {
      name: "auth",
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoggedIn = !!state.token;
      },
    },
  ),
);
