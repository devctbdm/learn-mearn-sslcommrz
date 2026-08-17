"use client";

import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
      <div className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-lg ring-1 ring-amber-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
          ⏸️
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">
          Payment Cancelled
        </h1>
        <p className="mt-3 text-slate-600">
          The payment process was cancelled before completion.
        </p>

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
