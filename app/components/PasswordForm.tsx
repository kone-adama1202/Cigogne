"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const password = String(form.get("password"));

    if (password !== String(form.get("confirm"))) {
      setOk(false);
      setMessage("Les deux mots de passe sont différents.");
      return;
    }

    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);
    setOk(!error);
    setMessage(error ? error.message : "Mot de passe modifié ✅");
    if (!error) formEl.reset();
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nouveau mot de passe</label>
        <input name="password" type="password" required minLength={6} className={input} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Confirmer</label>
        <input name="confirm" type="password" required minLength={6} className={input} />
      </div>
      {message && (
        <p className={`text-sm ${ok ? "text-green-700" : "text-red-600"}`}>{message}</p>
      )}
      <button
        disabled={loading}
        className="rounded-lg border border-brand-600 px-5 py-2.5 font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-60"
      >
        {loading ? "Modification..." : "Changer le mot de passe"}
      </button>
    </form>
  );
}