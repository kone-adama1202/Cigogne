"use client";

import { useState } from "react";
import { agences, services } from "@/lib/data";

export default function ContactForm() {
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const agence = agences.find((a) => a.ville === String(form.get("agence")));
    if (!agence) {
      setError("Choisissez une agence.");
      return;
    }

    const message = [
      "Bonjour, je vous contacte depuis votre site.",
      `Nom : ${String(form.get("name")).trim()}`,
      `Téléphone : ${String(form.get("phone")).trim()}`,
      `Sujet : ${String(form.get("subject"))}`,
      "",
      String(form.get("message")).trim(),
    ].join("\n");

    window.open(
      `https://wa.me/${agence.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Nom complet</label>
          <input name="name" required className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Téléphone</label>
          <input name="phone" type="tel" required className={input} placeholder="+223 ..." />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
          <label className="mb-1 block text-sm font-medium">Sujet</label>
          <select name="subject" className={input}>
            <option>Demande de devis</option>
            <option>Commande de produits</option>
            {services.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>Autre</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Votre message</label>
        <textarea name="message" rows={5} required className={input} />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-green-700">
        Envoyer via WhatsApp
      </button>
      <p className="text-xs text-slate-500">
        Le bouton ouvre WhatsApp avec votre message déjà rédigé : il vous reste à l&apos;envoyer.
      </p>
    </form>
  );
}