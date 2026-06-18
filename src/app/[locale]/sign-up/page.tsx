import { SignUpForm } from "@/components/forms/SignUpForm";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = { title: "Register | Esmae" };

export default function SignUpPage({ params }: { params: { locale: string } }) {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          paddingTop: "72px",
          background: "var(--light-section)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem clamp(1rem,4vw,2rem)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "2rem",
                fontWeight: 300,
                color: "var(--deep-luxury)",
                marginBottom: "0.5rem",
              }}
            >
              Create Account
            </div>
            <div
              style={{
                fontFamily: "var(--font-noto-arabic)",
                fontSize: "1rem",
                color: "var(--primary)",
                opacity: 0.8,
              }}
            >
              أَسْـٰمَێَ
            </div>
          </div>

          <SignUpForm locale={params.locale} />

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.78rem",
              color: "#9a8aaa",
            }}
          >
            Already have an account?{" "}
            <a
              href={`/${params.locale}/sign-in`}
              style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}
            >
              Sign In
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
