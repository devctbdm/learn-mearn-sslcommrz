"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const shipping = useCartStore((state) => state.getShipping());
  const total = useCartStore((state) => state.getTotal());
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "Demo User",
    email: "demo@example.com",
    phone: "01700000000",
    address: "21 Road 12, Dhanmondi",
    city: "Dhaka",
    zip: "1209",
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!cartItems.length) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingAddress: {
            address: form.address,
            city: form.city,
            zip: form.zip,
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.gateway_url) {
        const orderMeta = {
          tran_id: data.order?.tran_id || `demo_${Date.now()}`,
          amount: Number(data.order?.amount ?? total),
        };

        localStorage.setItem("demo-order-meta", JSON.stringify(orderMeta));
        // Don't clear cart here - will be cleared on success page after payment
        // Simulate slight delay for UX before redirect
        setTimeout(() => {
          window.location.href = data.gateway_url;
        }, 600);
        return;
      }

      const message = data.message || "SSLCommerz session creation failed.";
      window.alert(message);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      window.alert("SSLCommerz session creation failed.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900">
        <h1 className="text-2xl font-bold">Checkout</h1>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">No products in cart</h1>
          <p className="mt-3 text-slate-600">
            Add some items before checking out.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
          >
            Go back to shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
            Checkout
          </p>
          <h1 className="mt-2 text-3xl font-bold">Complete your order</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Full name
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, name: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-emerald-500"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-emerald-500"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Phone
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      phone: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-emerald-500"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                ZIP code
                <input
                  value={form.zip}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, zip: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-emerald-500"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                Address
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      address: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-emerald-500"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                City
                <input
                  value={form.city}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, city: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-emerald-500"
                />
              </label>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-full px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 ${
                  isSubmitting
                    ? "cursor-not-allowed bg-emerald-400 opacity-90"
                    : "bg-emerald-500 hover:bg-emerald-400 active:scale-95"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative h-4 w-4">
                      <div className="absolute inset-0 rounded-full border-2 border-slate-300 border-t-slate-950 animate-spin"></div>
                    </div>
                    <span>Redirecting to payment...</span>
                  </div>
                ) : (
                  "Pay with SSLCommerz"
                )}
              </button>
            </div>
          </form>

          <aside className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
            <h2 className="text-xl font-semibold">Order summary</h2>
            <div className="mt-5 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm text-slate-200"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-700 pt-5 text-sm text-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳{shipping}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white">
                <span>Total</span>
                <span>৳{total}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
