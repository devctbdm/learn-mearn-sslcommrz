"use client";

import { products } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const addToCart = useCartStore((state) => state.addToCart);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const handleAddToCart = (product: any) => {
    setLoadingProductId(product.id);

    // Simulate API call with smooth animation
    setTimeout(() => {
      addToCart(product);
      setLoadingProductId(null);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              New arrivals
            </p>
            <h2 className="text-5xl font-black leading-tight">
              Upgrade your everyday essentials.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              A simple demo storefront built to practice SSLCommerz checkout
              flows locally before connecting a real payment system.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Shop now
              </a>
              <Link
                href="/checkout"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Checkout demo
              </Link>
            </div>
          </div>

          <div className="rounded-4xl bg-linear-to-br from-slate-900 via-slate-800 to-emerald-600 p-6 shadow-xl">
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="rounded-[1.2rem] bg-white p-4 text-slate-900 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Best seller
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    Hot
                  </span>
                </div>
                <Image
                  src={products[2].image}
                  alt={products[2].name}
                  width={400}
                  height={300}
                  className="mt-4 h-64 w-full rounded-2xl object-cover"
                  loading="eager"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">{products[2].name}</p>
                    <p className="text-sm text-slate-500">
                      {products[2].category}
                    </p>
                  </div>
                  <p className="text-xl font-black">৳{products[2].price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
              Products
            </p>
            <h3 className="mt-2 text-3xl font-bold">Featured collection</h3>
          </div>
          <Link
            href="/cart"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            View cart →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-slate-200"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  loading="eager"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {product.category}
                  </p>
                  <span className="text-lg font-bold text-slate-900">
                    ৳{product.price}
                  </span>
                </div>
                <h4 className="mt-3 text-xl font-bold">{product.name}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.description}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingProductId === product.id}
                  className={`mt-5 w-full rounded-full px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 ${
                    loadingProductId === product.id
                      ? "bg-emerald-400 cursor-not-allowed opacity-90"
                      : "bg-emerald-500 hover:bg-emerald-400 active:scale-95"
                  }`}
                >
                  {loadingProductId === product.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative h-4 w-4">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-300 border-t-slate-950 animate-spin"></div>
                      </div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    "Add to cart"
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                Learning
              </p>
              <h4 className="mt-2 text-2xl font-bold">
                SSLCommerz practice setup
              </h4>
            </div>
            <div className="text-slate-300">
              <p>
                This store simulates a real payment flow without storing live
                customer data.
              </p>
            </div>
            <div className="text-slate-300">
              <p>
                Use the values in the server environment to connect your real
                SSLCommerz credentials later.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
