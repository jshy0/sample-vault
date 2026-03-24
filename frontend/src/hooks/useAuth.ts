import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { login, register } from "@/api/auth";

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: login,
    onSuccess: ({ token }) => setToken(token),
  });
}

export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: register,
    onSuccess: ({ token }) => setToken(token),
  });
}

export function useLogout() {
  const clearToken = useAuthStore((s) => s.clearToken);
  return clearToken;
}
