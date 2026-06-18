"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RegisterSchema, type RegisterData } from "@/lib/validators/schemas";
import { registerUser } from "@/lib/actions/auth";

export function SignUpForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(RegisterSchema) });

  async function onSubmit(data: RegisterData) {
    setServerError("");
    const result = await registerUser(data);

    if (!result.success) {
      setServerError(result.error ?? "Registration failed.");
      return;
    }

    // Auto sign-in after registration
    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.ok) {
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } else {
      router.push(`/${locale}/sign-in`);
    }
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
        <label className="form-label">Full Name</label>
        <input
          {...register("name")}
          type="text"
          className="form-input"
          placeholder="Your full name"
          autoComplete="name"
        />
        {errors.name && (
          <span style={{ fontSize: "0.7rem", color: "#c62828", display: "block", marginTop: "0.25rem" }}>
            {errors.name.message}
          </span>
        )}
      </div>

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

      <div style={{ marginBottom: "1rem" }}>
        <label className="form-label">Phone (optional)</label>
        <input
          {...register("phone")}
          type="tel"
          className="form-input"
          placeholder="+213..."
          autoComplete="tel"
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label className="form-label">Password</label>
        <input
          {...register("password")}
          type="password"
          className="form-input"
          placeholder="Min 8 chars, upper, lower, number"
          autoComplete="new-password"
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
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>

      <p
        style={{
          fontSize: "0.7rem",
          color: "#9a8aaa",
          textAlign: "center",
          marginTop: "1rem",
          lineHeight: 1.6,
        }}
      >
        By registering, you agree to our{" "}
        <a href={`/${locale}/privacy`} style={{ color: "var(--primary)" }}>
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href={`/${locale}/terms`} style={{ color: "var(--primary)" }}>
          Terms of Service
        </a>
        .
      </p>
    </form>
  );
}
