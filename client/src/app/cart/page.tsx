"use client";

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeFromCart);

  const subtotal = useCartStore((state) => state.getSubtotal());
  const shipping = useCartStore((state) => state.getShipping());
  const total = useCartStore((state) => state.getTotal());

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
              Cart
            </p>
            <h1 className="mt-2 text-3xl font-bold">Your shopping cart</h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
              Cart
            </p>
            <h1 className="mt-2 text-3xl font-bold">Your shopping cart</h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-white"
          >
            Continue shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
            >
              Shop products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm md:flex-row md:items-center"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="h-28 w-full rounded-2xl object-cover md:w-32"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {item.category}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold">
                          {item.name}
                        </h2>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-medium text-red-500"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-slate-200 px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-8 w-8 rounded-full bg-slate-100 text-lg"
                        >
                          −
                        </button>
                        <span className="min-w-5 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-8 w-8 rounded-full bg-slate-100 text-lg"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-bold">
                        ৳{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
              <h2 className="text-xl font-semibold">Order summary</h2>
              <div className="mt-6 space-y-3 text-sm text-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>৳{shipping}</span>
                </div>
                <div className="my-3 h-px bg-slate-700" />
                <div className="flex justify-between text-base font-semibold text-white">
                  <span>Total</span>
                  <span>৳{total}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block rounded-full bg-emerald-500 px-5 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Proceed to checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
