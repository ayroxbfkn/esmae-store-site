"use client";

import { useState, useCallback } from "react";
import { getPriceCalculation, createQuoteDraft } from "@/lib/actions/pricing";
import type { PriceBreakdown } from "@/lib/pricing/engine";

type Step = 1 | 2 | 3 | 4 | 5;

interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  nameFr: string;
  category: string;
  basePrice: number;
  minQuantity: number;
  options: Array<{
    id: string;
    key: string;
    labelEn: string;
    value: string;
    multiplier: number;
    addedCost: number;
    isDefault: boolean;
  }>;
}

type CustomerInfo = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  wilaya: string;
  notes: string;
};

function StepIndicator({ step, current }: { step: number; current: number }) {
  const done = current > step;
  const active = current === step;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.78rem",
          fontWeight: 700,
          background: done ? "var(--primary)" : active ? "var(--deep-luxury)" : "var(--primary-10)",
          color: done || active ? "#fff" : "var(--primary)",
          border: active ? "2px solid var(--primary-soft)" : "none",
          transition: "all 0.3s",
        }}
      >
        {done ? "✓" : step}
      </div>
    </div>
  );
}

export function QuoteBuilderForm({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
}) {
  const [step, setStep] = useState<Step>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    wilaya: "",
    notes: "",
  });

  const STEPS = ["Product", "Configure", "Upload", "Contact", "Order"];

  // Group products by category
  const byCategory = products.reduce<Record<string, Product[]>>((acc, p) => {
    acc[p.category] = acc[p.category] ?? [];
    acc[p.category].push(p);
    return acc;
  }, {});

  function selectProduct(p: Product) {
    setSelectedProduct(p);
    // Default options
    const defaults: Record<string, string> = {};
    const seen = new Set<string>();
    for (const opt of p.options) {
      if (!seen.has(opt.key)) {
        if (opt.isDefault) {
          defaults[opt.key] = opt.value;
          seen.add(opt.key);
        }
      }
    }
    setSelectedOptions(defaults);
    setQuantity(p.minQuantity);
    setPriceBreakdown(null);
  }

  const calculatePrice = useCallback(async () => {
    if (!selectedProduct) return;
    setCalculating(true);
    setError("");
    const result = await getPriceCalculation({
      productId: selectedProduct.id,
      quantity,
      selectedOptions,
    });
    if (result.success && result.data) {
      setPriceBreakdown(result.data);
    } else {
      setError(result.error ?? "Pricing error");
    }
    setCalculating(false);
  }, [selectedProduct, quantity, selectedOptions]);

  async function handleSubmitQuote() {
    if (!selectedProduct || !priceBreakdown) return;
    const requiredFields: Array<keyof CustomerInfo> = [
      "fullName",
      "phone",
      "address",
      "city",
      "wilaya",
    ];
    const missingField = requiredFields.some((field) => customerInfo[field].trim().length === 0);

    if (missingField) {
      setError("Please add your name, phone, address, city, and wilaya before submitting.");
      return;
    }

    if (customerInfo.phone.trim().length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (
      customerInfo.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email.trim())
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");
    const result = await createQuoteDraft([
      {
        productId: selectedProduct.id,
        quantity,
        selectedOptions,
      },
    ], customerInfo);
    if (result.success && result.data) {
      setQuoteId((result.data as any).id);
      setStep(5);
    } else {
      setError(result.error ?? "Failed to create quote");
    }
    setSubmitting(false);
  }

  // Group product options by key
  const optionGroups = selectedProduct
    ? selectedProduct.options.reduce<Record<string, typeof selectedProduct.options>>(
        (acc, o) => {
          acc[o.key] = acc[o.key] ?? [];
          acc[o.key].push(o);
          return acc;
        },
        {}
      )
    : {};

  const nameKey = locale === "ar" ? "nameAr" : locale === "fr" ? "nameFr" : "nameEn";

  return (
    <div>
      {/* Step indicators */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2.5rem",
          background: "#fff",
          padding: "1.25rem 1.5rem",
          borderRadius: "6px",
          border: "1px solid var(--primary-20)",
        }}
      >
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <StepIndicator step={i + 1} current={step} />
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: step === i + 1 ? "var(--primary)" : "#9a8aaa",
                  marginTop: "0.4rem",
                  textAlign: "center",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: step > i + 1 ? "var(--primary)" : "var(--primary-20)",
                  maxWidth: "60px",
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Product */}
      {step === 1 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            padding: "2rem",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 300, color: "var(--deep-luxury)", marginBottom: "1.5rem" }}>
            Select a Product
          </h2>
          {Object.entries(byCategory).map(([cat, prods]) => (
            <div key={cat} style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a8aaa", marginBottom: "0.75rem" }}>
                {cat.replace(/_/g, " ")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                {prods.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectProduct(p)}
                    style={{
                      padding: "1rem",
                      border: selectedProduct?.id === p.id ? "2px solid var(--primary)" : "1px solid var(--primary-20)",
                      borderRadius: "4px",
                      background: selectedProduct?.id === p.id ? "var(--light-section)" : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--deep-luxury)", marginBottom: "0.3rem" }}>
                      {(p as any)[nameKey]}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 500 }}>
                      from {Number(p.basePrice).toLocaleString()} DZD
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#9a8aaa", fontSize: "0.82rem" }}>
              No products available. Please check back later.
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedProduct}
              className="btn-primary"
              style={{ opacity: !selectedProduct ? 0.5 : 1, cursor: !selectedProduct ? "not-allowed" : "pointer" }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configure */}
      {step === 2 && selectedProduct && (
        <div style={{ background: "#fff", border: "1px solid var(--primary-20)", borderRadius: "6px", padding: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 300, color: "var(--deep-luxury)", marginBottom: "1.5rem" }}>
            Configure: {(selectedProduct as any)[nameKey]}
          </h2>

          {/* Quantity */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="form-label">Quantity (min. {selectedProduct.minQuantity})</label>
            <input
              type="number"
              value={quantity}
              min={selectedProduct.minQuantity}
              step={50}
              onChange={(e) => setQuantity(Math.max(selectedProduct.minQuantity, Number(e.target.value)))}
              className="form-input"
              style={{ maxWidth: "200px" }}
            />
          </div>

          {/* Options */}
          {Object.entries(optionGroups).map(([key, options]) => (
            <div key={key} style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">{key.replace(/_/g, " ")}</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedOptions((prev) => ({ ...prev, [key]: opt.value }))}
                    style={{
                      padding: "0.5rem 1rem",
                      border: selectedOptions[key] === opt.value ? "2px solid var(--primary)" : "1px solid var(--primary-20)",
                      borderRadius: "2px",
                      background: selectedOptions[key] === opt.value ? "var(--light-section)" : "#fff",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: selectedOptions[key] === opt.value ? 600 : 400,
                      color: selectedOptions[key] === opt.value ? "var(--primary)" : "var(--text-dark)",
                      transition: "all 0.2s",
                    }}
                  >
                    {opt.labelEn}
                    {Number(opt.addedCost) > 0 && (
                      <span style={{ fontSize: "0.65rem", color: "#9a8aaa", marginLeft: "0.3rem" }}>
                        +{Number(opt.addedCost).toLocaleString()}
                      </span>
                    )}
                    {Number(opt.multiplier) !== 1 && (
                      <span style={{ fontSize: "0.65rem", color: "#9a8aaa", marginLeft: "0.3rem" }}>
                        ×{Number(opt.multiplier)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Price preview */}
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--light-section)", borderRadius: "4px" }}>
            <button
              onClick={calculatePrice}
              disabled={calculating}
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--primary)",
                background: "none",
                border: "1px solid var(--primary-40)",
                padding: "0.5rem 1.2rem",
                borderRadius: "2px",
                cursor: calculating ? "not-allowed" : "pointer",
                marginBottom: "0.75rem",
              }}
            >
              {calculating ? "Calculating..." : "Calculate Price"}
            </button>

            {priceBreakdown && !calculating && (
              <div style={{ fontSize: "0.8rem", color: "var(--text-dark)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ color: "#7a6b8a" }}>Subtotal:</span>
                  <span>{priceBreakdown.subtotal.toLocaleString()} DZD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ color: "#7a6b8a" }}>Tax (19%):</span>
                  <span>{priceBreakdown.taxAmount.toLocaleString()} DZD</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ color: "#7a6b8a" }}>Delivery:</span>
                  <span>{priceBreakdown.deliveryCost === 0 ? "Free" : `${priceBreakdown.deliveryCost.toLocaleString()} DZD`}</span>
                </div>
                {priceBreakdown.quantityDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", color: "#2e7d32" }}>
                    <span>Quantity Discount:</span>
                    <span>-{priceBreakdown.quantityDiscount.toLocaleString()} DZD</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid var(--primary-20)",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    color: "var(--deep-luxury)",
                  }}
                >
                  <span>Total:</span>
                  <span style={{ color: "var(--primary)" }}>
                    {priceBreakdown.total.toLocaleString()} DZD
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div style={{ fontSize: "0.75rem", color: "#c62828", marginTop: "0.5rem" }}>
                {error}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
            <button onClick={() => { calculatePrice(); setStep(3); }} className="btn-primary">
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Upload */}
      {step === 3 && (
        <div style={{ background: "#fff", border: "1px solid var(--primary-20)", borderRadius: "6px", padding: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 300, color: "var(--deep-luxury)", marginBottom: "1rem" }}>
            Upload Your Design File
          </h2>
          <p style={{ fontSize: "0.82rem", color: "#7a6b8a", fontWeight: 300, marginBottom: "1.5rem" }}>
            Accepted formats: PDF, AI, EPS, PSD, PNG (300 DPI+). Max 100MB.
          </p>
          <div
            style={{
              border: "2px dashed var(--primary-40)",
              borderRadius: "6px",
              padding: "3rem",
              textAlign: "center",
              background: "var(--light-section)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem", opacity: 0.5 }}>📁</div>
            <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--primary)", marginBottom: "0.5rem" }}>
              Drag & drop your file here
            </div>
            <div style={{ fontSize: "0.75rem", color: "#9a8aaa" }}>or click to browse</div>
            <input type="file" accept=".pdf,.ai,.eps,.psd,.png,.jpg" style={{ display: "none" }} />
          </div>
          <p style={{ fontSize: "0.72rem", color: "#9a8aaa", marginTop: "0.75rem" }}>
            You can also skip this step and send your file by email after submitting the quote.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <button onClick={() => setStep(2)} className="btn-ghost">← Back</button>
            <button onClick={() => setStep(4)} className="btn-primary">
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && selectedProduct && (
        <div style={{ background: "#fff", border: "1px solid var(--primary-20)", borderRadius: "6px", padding: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 300, color: "var(--deep-luxury)", marginBottom: "1.5rem" }}>
            Review Your Quote
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ padding: "1.25rem", background: "var(--light-section)", borderRadius: "4px" }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a8aaa", marginBottom: "1rem" }}>
                Product
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--deep-luxury)", marginBottom: "0.5rem" }}>
                {(selectedProduct as any)[nameKey]}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#7a6b8a" }}>
                Quantity: <strong>{quantity.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ padding: "1.25rem", background: "var(--light-section)", borderRadius: "4px" }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a8aaa", marginBottom: "1rem" }}>
                Configuration
              </div>
              {Object.entries(selectedOptions).map(([key, val]) => (
                <div key={key} style={{ fontSize: "0.78rem", color: "#7a6b8a", marginBottom: "0.3rem" }}>
                  <span style={{ textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>: <strong>{val}</strong>
                </div>
              ))}
            </div>
          </div>

          {priceBreakdown && (
            <div style={{ padding: "1.25rem", border: "1px solid var(--primary-20)", borderRadius: "4px" }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a8aaa", marginBottom: "1rem" }}>
                Price Breakdown
              </div>
              {[
                { label: "Subtotal", value: `${priceBreakdown.subtotal.toLocaleString()} DZD` },
                { label: "Tax (19%)", value: `${priceBreakdown.taxAmount.toLocaleString()} DZD` },
                { label: "Delivery", value: priceBreakdown.deliveryCost === 0 ? "Free" : `${priceBreakdown.deliveryCost.toLocaleString()} DZD` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#7a6b8a", marginBottom: "0.4rem" }}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid var(--primary-20)", fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}>
                <span>Total</span>
                <span>{priceBreakdown.total.toLocaleString()} DZD</span>
              </div>
            </div>
          )}

          <div style={{ marginTop: "1.5rem", padding: "1.25rem", border: "1px solid var(--primary-20)", borderRadius: "4px" }}>
            <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a8aaa", marginBottom: "1rem" }}>
              Customer Information
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div>
                <label className="form-label">Full name *</label>
                <input
                  value={customerInfo.fullName}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="form-input"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="form-label">Phone / WhatsApp *</label>
                <input
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                  className="form-input"
                  placeholder="0550 00 00 00"
                  required
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                  className="form-input"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="form-label">Wilaya *</label>
                <input
                  value={customerInfo.wilaya}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, wilaya: e.target.value }))}
                  className="form-input"
                  placeholder="Alger"
                  required
                />
              </div>
              <div>
                <label className="form-label">City *</label>
                <input
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, city: e.target.value }))}
                  className="form-input"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="form-label">Address *</label>
                <input
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                  className="form-input"
                  placeholder="Delivery address"
                  required
                />
              </div>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <label className="form-label">Additional notes</label>
              <textarea
                value={customerInfo.notes}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))}
                className="form-input"
                rows={3}
                placeholder="Preferred contact time, special delivery notes, or anything else we should know"
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: "0.75rem 1rem", background: "#fff0f0", border: "1px solid #fcc", borderRadius: "2px", fontSize: "0.78rem", color: "#c00", marginTop: "1rem" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <button onClick={() => setStep(3)} className="btn-ghost">← Back</button>
            <button
              onClick={handleSubmitQuote}
              disabled={submitting}
              className="btn-primary"
              style={{ opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Submitting..." : "Submit Quote →"}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirmation */}
      {step === 5 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--primary-20)",
            borderRadius: "6px",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 300, color: "var(--deep-luxury)", marginBottom: "0.75rem" }}>
            Quote Submitted!
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#7a6b8a", fontWeight: 300, maxWidth: "400px", margin: "0 auto 2rem" }}>
            We've received your quote request. Our team will review it and get back to you within 24 hours with confirmation and payment details.
          </p>
          {quoteId && (
            <div style={{ fontSize: "0.75rem", color: "#9a8aaa", marginBottom: "2rem" }}>
              Quote reference: <strong style={{ color: "var(--primary)" }}>{quoteId.slice(0, 8).toUpperCase()}</strong>
            </div>
          )}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <a href={`/${locale}`} className="btn-ghost">Return Home</a>
            <a href={`/${locale}/dashboard`} className="btn-primary">View Dashboard</a>
          </div>
        </div>
      )}
    </div>
  );
}
