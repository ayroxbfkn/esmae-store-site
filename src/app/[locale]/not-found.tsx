import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/Navbar";

export default function NotFoundPage({
  params,
}: {
  params: { locale: string };
}) {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          paddingTop: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--light-section)",
          textAlign: "center",
          padding: "5rem 2rem",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "8rem",
              fontWeight: 300,
              color: "var(--primary-20)",
              lineHeight: 1,
              marginBottom: "1rem",
            }}
          >
            404
          </div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2.5rem",
              fontWeight: 300,
              color: "var(--deep-luxury)",
              marginBottom: "1rem",
            }}
          >
            Page Not Found
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#7a6b8a",
              fontWeight: 300,
              maxWidth: "360px",
              margin: "0 auto 2rem",
              lineHeight: 1.8,
            }}
          >
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a
            href={`/${params?.locale ?? "en"}`}
            className="btn-primary"
          >
            Return Home
          </a>
        </div>
      </main>
    </>
  );
}
