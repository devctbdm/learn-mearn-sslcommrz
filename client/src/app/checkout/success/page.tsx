"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const fallbackMetaRaw =
    typeof window !== "undefined"
      ? localStorage.getItem("demo-order-meta")
      : null;
  const fallbackMeta = fallbackMetaRaw ? JSON.parse(fallbackMetaRaw) : null;

  const amountValue =
    searchParams.get("amount") ||
    searchParams.get("total_amount") ||
    searchParams.get("totalAmount") ||
    fallbackMeta?.amount ||
    "0";

  const tranIdValue =
    searchParams.get("tran_id") ||
    searchParams.get("transaction_id") ||
    searchParams.get("tranId") ||
    fallbackMeta?.tran_id ||
    "demo-order";

  const params = {
    tranId: tranIdValue,
    amount: String(amountValue),
    isDemo: searchParams.get("demo") === "true",
  };

  const formattedAmount = Number.parseFloat(params.amount || "0");

  // Clear cart when payment is successful
  useEffect(() => {
    clearCart();
    // Clear the order meta from localStorage
    localStorage.removeItem("demo-order-meta");
  }, [clearCart]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4">
      <div className="max-w-xl rounded-4xl bg-white p-8 text-center shadow-lg ring-1 ring-emerald-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✅
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">
          Payment Successful
        </h1>
        <p className="mt-3 text-slate-600">
          {params.isDemo
            ? "This is a demo SSLCommerz flow for learning and testing."
            : "Your transaction was processed successfully."}
        </p>

        <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-left text-sm text-slate-700">
          <div className="flex justify-between gap-4 py-2">
            <span>Transaction ID</span>
            <strong>{params.tranId}</strong>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span>Amount</span>
            <strong>
              ৳
              {Number.isFinite(formattedAmount)
                ? formattedAmount.toLocaleString("en-BD")
                : "0"}
            </strong>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Continue shopping
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            View cart
          </Link>
        </div>
      </div>
    </main>
  );
}
