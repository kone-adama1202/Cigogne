"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({
  mode,
  next = "/",
}: {
  mode: "connexion" | "inscription";
  next?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sécurité : on n'accepte que des chemins internes
  const destination = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = createClient();

    if (mode === "inscription") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: String(form.get("full_name")),
            phone: String(form.get("phone")),
          },
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (!data.session) {
        setError("Compte créé. Vérifiez votre e-mail pour confirmer, puis connectez-vous.");
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("E-mail ou mot de passe incorrect.");
        setLoading(false);
        return;
      }
    }

    router.push(destination);
    router.refresh();
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">
        {mode === "connexion" ? "Connexion" : "Créer un compte"}
      </h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "inscription" && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">Nom complet</label>
              <input name="full_name" required className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Téléphone</label>
              <input name="phone" type="tel" required className={input} placeholder="+223 ..." />
            </div>
          </>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium">E-mail</label>
          <input name="email" type="email" required className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mot de passe</label>
          <input name="password" type="password" required minLength={6} className={input} />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Patientez..." : mode === "connexion" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        {mode === "connexion" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href={`/inscription?next=${encodeURIComponent(destination)}`} className="font-semibold text-brand-600">
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <Link href={`/connexion?next=${encodeURIComponent(destination)}`} className="font-semibold text-brand-600">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </div>
  );
}