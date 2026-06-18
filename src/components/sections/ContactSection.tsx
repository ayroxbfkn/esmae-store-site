"use client";

import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormSchema, type ContactFormData } from "@/lib/validators/schemas";
import { submitContact } from "@/lib/actions/contact";
import { useState } from "react";

const SERVICES = [
  "Business Stationery",
  "Wedding & Events",
  "Luxury Packaging",
  "Large Format",
  "Corporate Publishing",
  "Partnership",
  "Other",
];

export function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setError("");
    const result = await submitContact(data);
    if (result.success) {
      setSubmitted(true);
      reset();
    } else {
      setError(result.error || "Something went wrong.");
    }
  }

  const INFO = [
    {
      icon: "📍",
      label: t("info.location"),
      value: t("info.locationValue"),
    },
    { icon: "📞", label: t("info.phone"), value: t("info.phoneValue") },
    { icon: "✉", label: t("info.email"), value: t("info.emailValue") },
    { icon: "⏰", label: t("info.hours"), value: t("info.hoursValue") },
  ];

  return (
    <section id="contact" className="section-wrapper">
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">{t("eyebrow")}</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem,3.5vw,3rem)",
              fontWeight: 300,
              color: "var(--deep-luxury)",
            }}
          >
            {t("title")}
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: "5rem",
          }}
        >
          {/* Contact Info */}
          <div>
            {INFO.map(({ icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1.2rem 0",
                  borderBottom: "1px solid var(--primary-20)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    flexShrink: 0,
                    border: "1px solid var(--primary-40)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--primary)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-dark)",
                      fontWeight: 300,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  background: "var(--light-section)",
                  border: "1px solid var(--primary-20)",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{ fontSize: "2rem", marginBottom: "1rem" }}
                >
                  ✓
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.5rem",
                    color: "var(--deep-luxury)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Message Sent
                </h3>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#7a6b8a",
                    fontWeight: 300,
                  }}
                >
                  We'll be in touch within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-ghost"
                  style={{ marginTop: "1.5rem" }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <label className="form-label">{t("form.name")}</label>
                    <input
                      {...register("name")}
                      className="form-input"
                      placeholder={t("form.namePlaceholder")}
                    />
                    {errors.name && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#e05",
                          marginTop: "0.25rem",
                          display: "block",
                        }}
                      >
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">{t("form.email")}</label>
                    <input
                      {...register("email")}
                      type="email"
                      className="form-input"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#e05",
                          marginTop: "0.25rem",
                          display: "block",
                        }}
                      >
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <label className="form-label">{t("form.phone")}</label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="form-input"
                      placeholder="+213..."
                    />
                  </div>
                  <div>
                    <label className="form-label">{t("form.service")}</label>
                    <select
                      {...register("service")}
                      className="form-input"
                      style={{ cursor: "pointer" }}
                    >
                      <option value="">Select...</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#e05",
                          marginTop: "0.25rem",
                          display: "block",
                        }}
                      >
                        {errors.service.message}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="form-label">{t("form.message")}</label>
                  <textarea
                    {...register("message")}
                    className="form-input"
                    placeholder={t("form.messagePlaceholder")}
                    style={{ resize: "vertical", minHeight: "110px" }}
                  />
                  {errors.message && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#e05",
                        marginTop: "0.25rem",
                        display: "block",
                      }}
                    >
                      {errors.message.message}
                    </span>
                  )}
                </div>

                {error && (
                  <div
                    style={{
                      padding: "0.8rem 1rem",
                      background: "#fff0f0",
                      border: "1px solid #fcc",
                      borderRadius: "2px",
                      fontSize: "0.78rem",
                      color: "#c00",
                      marginBottom: "1rem",
                    }}
                  >
                    {error}
                  </div>
                )}

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
                  {isSubmitting ? "Sending..." : `${t("form.submit")} →`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
