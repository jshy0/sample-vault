import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { login, register as registerUser } from "@/api/auth";
import { isAxiosError } from "axios";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FormValues = z.infer<typeof schema>;
type Tab = "sign-in" | "register";

export default function SignInPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const [tab, setTab] = useState<Tab>("sign-in");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function switchTab(next: Tab) {
    setTab(next);
    setServerError("");
    reset();
  }

  async function onSubmit(data: FormValues) {
    setServerError("");
    try {
      const { token } =
        tab === "sign-in" ? await login(data) : await registerUser(data);
      setToken(token);
      navigate("/");
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : null;
      setServerError(message ?? "Something went wrong.");
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {tab === "sign-in"
              ? "Sign in to your account"
              : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tab === "sign-in"
              ? "Welcome back!"
              : "Start storing and sharing your samples."}
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 rounded-lg border p-1 gap-1">
          <button
            type="button"
            onClick={() => switchTab("sign-in")}
            className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
              tab === "sign-in"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
              tab === "register"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              autoComplete={
                tab === "sign-in" ? "current-password" : "new-password"
              }
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? tab === "sign-in"
                ? "Signing in…"
                : "Creating account…"
              : tab === "sign-in"
                ? "Sign In"
                : "Register"}
          </Button>
        </form>
      </div>
    </main>
  );
}
