"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart";
import { agences } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export default function CheckoutForm({
  fullName,
  phone,
}: {
  fullName: string;
  phone: string;
}) {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [mode, setMode] = useState<"retrait" | "livraison">("retrait");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const agence = String(form.get("agence"));

    const supabase = createClient();
    const { data, error } = await supabase.rpc("create_order", {
      p_items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      p_agence: agence,
      p_delivery_mode: mode,
      p_address: String(form.get("address") ?? ""),
      p_note: String(form.get("note") ?? ""),
      p_name: String(form.get("name")),
      p_phone: String(form.get("phone")),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    clear();
    router.push(`/commande/succes?ref=${data}&agence=${encodeURIComponent(agence)}`);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
        <p className="text-slate-600">Votre panier est vide.</p>
        <Link href="/produits" className="mt-3 inline-block font-semibold text-brand-600">
          Voir nos produits →
        </Link>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nom complet</label>
          <input name="name" defaultValue={fullName} required className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Téléphone</label>
          <input name="phone" defaultValue={phone} required className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Agence</label>
          <select name="agence" className={input}>
            {agences.map((a) => (
              <option key={a.ville} value={a.ville}>
                {a.ville}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium">Mode de réception</p>
          <div className="flex gap-3">
            {(["retrait", "livraison"] as const).map((m) => (
              <label
                key={m}
                className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium ${
                  mode === m ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={mode === m}
                  onChange={() => setMode(m)}
                />
                {m === "retrait" ? "Retrait en agence" : "Livraison"}
              </label>
            ))}
          </div>
        </div>

        {mode === "livraison" && (
          <div>
            <label className="mb-1 block text-sm font-medium">Adresse de livraison</label>
            <input name="address" required className={input} placeholder="Quartier, rue, repère..." />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Note (facultatif)</label>
          <textarea name="note" rows={3} className={input} />
        </div>
      </div>

      <aside className="h-fit rounded-xl bg-brand-50 p-5">
        <h2 className="font-bold text-slate-900">Votre commande</h2>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-2">
              <span>
                {i.quantity} × {i.name}
              </span>
              <span className="shrink-0">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-brand-100 pt-3 text-lg">
          <span>Total</span>
          <span className="font-bold text-brand-700">{formatPrice(total)}</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Paiement à la réception ou en agence. Les frais de livraison éventuels vous seront confirmés.
        </p>

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Envoi..." : "Confirmer la commande"}
        </button>
      </aside>
    </form>
  );
}