import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { formatDate, statusInfo } from "@/lib/orders";
import ProfileForm from "../components/ProfileForm";
import PasswordForm from "../components/PasswordForm"; 

export const metadata: Metadata = { title: "Mon profil | Cigogne du Mandé" };

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/profil");

  const [profileRes, countRes, recentRes] = await Promise.all([
    supabase.from("profiles").select("full_name, phone, role").eq("id", user.id).single(),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase
      .from("orders")
      .select("id, status, total, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const profile = profileRes.data;
  const recent = recentRes.data ?? [];
  const name = profile?.full_name || user.email || "?";
  const memberSince = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
    new Date(user.created_at)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* En-tête */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
          <p className="text-sm text-slate-500">
            {user.email} · Membre depuis {memberSince}
            {profile?.role === "admin" && (
              <span className="ml-2 rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-slate-900">
                Admin
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Mes informations</h2>
            <ProfileForm
              userId={user.id}
              email={user.email ?? ""}
              fullName={profile?.full_name ?? ""}
              phone={profile?.phone ?? ""}
            />
          </section>

          <section className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Sécurité</h2>
            <PasswordForm />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-brand-50 p-5">
            <p className="text-sm text-slate-600">Commandes passées</p>
            <p className="text-3xl font-bold text-brand-700">{countRes.count ?? 0}</p>
            <Link href="/commandes" className="mt-2 inline-block text-sm font-semibold text-brand-600">
              Voir toutes mes commandes →
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Dernières commandes</h2>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Aucune commande pour le moment.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {recent.map((o) => {
                  const info = statusInfo[o.status];
                  return (
                    <li key={o.id} className="py-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold">#{o.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${info?.badge}`}>
                          {info?.label ?? o.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(o.created_at)} · {formatPrice(o.total)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}