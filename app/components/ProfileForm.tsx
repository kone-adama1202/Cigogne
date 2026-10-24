"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({
  userId,
  email,
  fullName,
  phone,
}: {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("full_name")).trim();
    const tel = String(form.get("phone")).trim();

    if (name.length < 2) {
      setOk(false);
      setMessage("Entrez votre nom complet.");
      return;
    }
    if (tel.replace(/\D/g, "").length < 8) {
      setOk(false);
      setMessage("Numéro de téléphone invalide.");
      return;
    }

    setSaving(true);
    const { error } = await createClient()
      .from("profiles")
      .update({ full_name: name, phone: tel })
      .eq("id", userId);
    setSaving(false);

    setOk(!error);
    setMessage(error ? "Erreur : " + error.message : "Profil mis à jour ✅");
    if (!error) {
      router.refresh();
      setTimeout(() => setMessage(""), 4000);
    }
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">E-mail</label>
        <input value={email} disabled className={input + " bg-slate-100 text-slate-500"} />
        <p className="mt-1 text-xs text-slate-500">L&apos;e-mail ne peut pas être modifié ici.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Nom complet</label>
        <input name="full_name" defaultValue={fullName} required className={input} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Téléphone</label>
        <input name="phone" type="tel" defaultValue={phone} required className={input} placeholder="+223 ..." />
      </div>
      {message && (
        <p className={`text-sm ${ok ? "text-green-700" : "text-red-600"}`}>{message}</p>
      )}
      <button
        disabled={saving}
        className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}