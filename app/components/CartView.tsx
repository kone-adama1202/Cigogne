"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export default function CartView() {
  const { items, total, setQuantity, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
        <p className="text-5xl">🛒</p>
        <p className="mt-3 text-slate-600">Votre panier est vide.</p>
        <Link href="/produits" className="mt-4 inline-block font-semibold text-brand-600">
          Voir nos produits →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">{i.name}</p>
              <p className="text-sm text-slate-500">{formatPrice(i.price)}</p>
              <button onClick={() => remove(i.id)} className="mt-1 text-xs text-red-600 hover:underline">
                Retirer
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(i.id, i.quantity - 1)}
                className="h-8 w-8 rounded-md border border-slate-300 hover:bg-slate-50"
                aria-label="Diminuer"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">{i.quantity}</span>
              <button
                onClick={() => setQuantity(i.id, i.quantity + 1)}
                disabled={i.quantity >= i.stock}
                className="h-8 w-8 rounded-md border border-slate-300 hover:bg-slate-50 disabled:opacity-40"
                aria-label="Augmenter"
              >
                +
              </button>
            </div>
            <p className="w-28 text-right font-semibold">{formatPrice(i.price * i.quantity)}</p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl bg-brand-50 p-5">
        <h2 className="font-bold text-slate-900">Récapitulatif</h2>
        <div className="mt-3 flex justify-between text-lg">
          <span>Total</span>
          <span className="font-bold text-brand-700">{formatPrice(total)}</span>
        </div>
        <Link
          href="/commande"
          className="mt-4 block rounded-lg bg-brand-600 py-2.5 text-center font-semibold text-white hover:bg-brand-700"
        >
          Passer la commande
        </Link>
        <button onClick={clear} className="mt-3 w-full text-sm text-slate-500 hover:text-red-600">
          Vider le panier
        </button>
      </aside>
    </div>
  );
}