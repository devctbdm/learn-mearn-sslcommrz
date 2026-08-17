"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutFailurePage() {
  const [reason, setReason] = useState("Payment was not completed");

  useEffect(() => {
    const timer = setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      setReason(searchParams.get("reason") || "Payment was not completed");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-red-50 px-4">
      <div className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-lg ring-1 ring-red-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
          ⚠️
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">
          Payment Failed
        </h1>
        <p className="mt-3 text-slate-600">{reason}</p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/checkout"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Try again
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            Back to shop
          </Link>
        </div>
      </div>
    </main>
  );
}
