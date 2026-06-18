import { getProducts } from "@/lib/actions/products";
import { QuoteBuilderForm } from "@/components/forms/QuoteBuilderForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Quote Builder | Esmae" };

export default async function QuoteBuilderPage({
  params,
}: {
  params: { locale: string };
}) {
  const result = await getProducts(params.locale);
  const products = result.success ? (result.data as any[]) : [];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "72px", minHeight: "100vh", background: "var(--light-section)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem clamp(1rem,4vw,2rem)" }}>
          <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              <span className="eyebrow-line" />
              <span className="eyebrow-text">Instant Pricing</span>
              <span className="eyebrow-line" />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem,4vw,3rem)",
                fontWeight: 300,
                color: "var(--deep-luxury)",
              }}
            >
              Build Your{" "}
              <em style={{ fontStyle: "italic", color: "var(--primary)" }}>Quote</em>
            </h1>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#7a6b8a",
                fontWeight: 300,
                marginTop: "0.75rem",
              }}
            >
              Configure your print order and get an instant price — no waiting, no surprises.
            </p>
          </div>

          <QuoteBuilderForm products={products} locale={params.locale} />
        </div>
      </main>
      <Footer />
    </>
  );
}
