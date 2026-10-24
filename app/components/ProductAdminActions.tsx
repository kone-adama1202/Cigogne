"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProductAdminActions({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    setLoading(true);
    setError("");
    const { error } = await createClient().from("products").update({ active: !active }).eq("id", id);
    setLoading(false);
    if (error) return setError(error.message);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Supprimer ce produit définitivement ? Les anciennes commandes sont conservées.")) return;
    setLoading(true);
    setError("");
    const { error } = await createClient().from("products").delete().eq("id", id);
    setLoading(false);
    if (error) return setError(error.message);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={toggle}
        disabled={loading}
        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
      >
        {active ? "Masquer" : "Afficher"}
      </button>
      <button
        onClick={remove}
        disabled={loading}
        className="rounded-md border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Supprimer
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}