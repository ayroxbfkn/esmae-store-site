"use client";

import { useState, useCallback, useRef } from "react";
import type { PriceBreakdownDisplay } from "@/types";

interface UsePriceOptions {
  productId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
}

interface UsePriceReturn {
  breakdown: PriceBreakdownDisplay | null;
  loading: boolean;
  error: string | null;
  calculate: () => Promise<void>;
  reset: () => void;
}

export function usePrice({
  productId,
  quantity,
  selectedOptions,
}: UsePriceOptions): UsePriceReturn {
  const [breakdown, setBreakdown] = useState<PriceBreakdownDisplay | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const calculate = useCallback(async () => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, selectedOptions }),
        signal: abortRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Pricing error");
      }

      setBreakdown(data.data);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to calculate price");
    } finally {
      setLoading(false);
    }
  }, [productId, quantity, selectedOptions]);

  const reset = useCallback(() => {
    setBreakdown(null);
    setError(null);
  }, []);

  return { breakdown, loading, error, calculate, reset };
}
