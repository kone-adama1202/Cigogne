"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { statusInfo } from "@/lib/orders";

export default function AdminStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    if (
      next === "annulee" &&
      !window.confirm("Annuler cette commande ? Le stock sera remis et l'action est définitive.")
    ) {
      e.target.value = status;
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.rpc("admin_set_order_status", {
      p_order_id: orderId,
      p_status: next,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      e.target.value = status;
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <select
        defaultValue={status}
        key={status}
        onChange={onChange}
        disabled={loading || status === "annulee"}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:bg-slate-100"
      >
        {Object.entries(statusInfo).map(([value, info]) => (
          <option key={value} value={value}>
            {info.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}