"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SignInSchema, type SignInData } from "@/lib/validators/schemas";

export function SignInForm({
  locale,
  callbackUrl,
  error: initialError,
}: {
  locale: string;
  callbackUrl?: string;
  error?: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState(
    initialError === "CredentialsSignin" ? "Invalid email or password." : ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInData>({ resolver: zodResolver(SignInSchema) });

  async function onSubmit(data: SignInData) {
    setServerError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl ?? `/${locale}/dashboard`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        background: "#fff",
        border: "1px solid var(--primary-20)",
        borderRadius: "6px",
        padding: "2rem",
      }}
    >
      {serverError && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#fff0f0",
            border: "1px solid #fcc",
            borderRadius: "2px",
            fontSize: "0.78rem",
            color: "#c00",
            marginBottom: "1.25rem",
          }}
        >
          {serverError}
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label className="form-label">Email</label>
        <input
          {...register("email")}
          type="email"
          className="form-input"
          placeholder="your@email.com"
          autoComplete="email"
        />
        {errors.email && (
          <span style={{ fontSize: "0.7rem", color: "#c62828", display: "block", marginTop: "0.25rem" }}>
            {errors.email.message}
          </span>
        )}
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <label className="form-label" style={{ margin: 0 }}>Password</label>
          <a
            href={`/${locale}/forgot-password`}
            style={{ fontSize: "0.68rem", color: "var(--primary)", textDecoration: "none" }}
          >
            Forgot?
          </a>
        </div>
        <input
          {...register("password")}
          type="password"
          className="form-input"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password && (
          <span style={{ fontSize: "0.7rem", color: "#c62828", display: "block", marginTop: "0.25rem" }}>
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          opacity: isSubmitting ? 0.7 : 1,
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
