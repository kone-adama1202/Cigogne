import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { categories } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { formatDate, statusInfo } from "@/lib/orders";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  agence: string;
  customer_name: string | null;
  created_at: string;
};

function StatCard({
  icon,
  label,
  value,
  hint,
  href,
  tone = "bg-white",
}: {
  icon: string;
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: string;
}) {
  const content = (
    <div className={`rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:shadow-md ${tone}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default async function AdminDashboardPage() {
  const supabase = await requireAdmin();

  const [ordersRes, lowStockRes, productsCountRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, status, total, agence, customer_name, created_at")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("products")
      .select("id, name, category, stock")
      .eq("active", true)
      .lt("stock", 5)
      .order("stock", { ascending: true })
      .limit(8),
    supabase.from("products").select("id", { count: "exact", head: true }),
  ]);

  const orders = (ordersRes.data ?? []) as OrderRow[];
  const lowStock = lowStockRes.data ?? [];

  // Dates (le Mali est en UTC+0, donc l'UTC convient)
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const pending = orders.filter((o) => o.status === "en_attente").length;
  const today = orders.filter((o) => new Date(o.created_at) >= startOfDay).length;
  const monthRevenue = orders
    .filter((o) => o.status === "livree" && new Date(o.created_at) >= startOfMonth)
    .reduce((sum, o) => sum + o.total, 0);
  const inProgress = orders.filter((o) =>
    ["confirmee", "en_preparation", "prete"].includes(o.status)
  ).length;

  const byStatus = Object.keys(statusInfo).map((key) => ({
    key,
    count: orders.filter((o) => o.status === key).length,
  }));
  const maxCount = Math.max(1, ...byStatus.map((s) => s.count));

  const byAgence = ["Bamako", "Sikasso"].map((ville) => ({
    ville,
    count: orders.filter((o) => o.agence === ville && o.status !== "annulee").length,
  }));

  const recent = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-sm text-slate-500">Vue d&apos;ensemble de votre activité.</p>
      </div>

      {/* Chiffres clés */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="⏳"
          label="Commandes en attente"
          value={pending}
          hint={pending > 0 ? "À confirmer rapidement" : "Tout est traité"}
          href="/admin/commandes?statut=en_attente"
          tone={pending > 0 ? "bg-amber-50" : "bg-white"}
        />
        <StatCard icon="🆕" label="Commandes aujourd'hui" value={today} hint={`${inProgress} en cours de traitement`} href="/admin/commandes" />
        <StatCard icon="💰" label="CA du mois (livrées)" value={formatPrice(monthRevenue)} hint="Commandes livrées ou retirées" />
        <StatCard
          icon="⚠️"
          label="Stock bas ou épuisé"
          value={lowStock.length}
          hint={`${productsCountRes.count ?? 0} produits au catalogue`}
          href="/admin/produits"
          tone={lowStock.length > 0 ? "bg-red-50" : "bg-white"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Répartition par statut */}
        <div className="rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Commandes par statut</h2>
          <ul className="mt-4 space-y-3">
            {byStatus.map(({ key, count }) => (
              <li key={key}>
                <Link href={`/admin/commandes?statut=${key}`} className="block">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{statusInfo[key].label}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            {byAgence.map((a) => (
              <div key={a.ville} className="rounded-xl bg-brand-50 p-3 text-center">
                <p className="text-xl font-bold text-brand-700">{a.count}</p>
                <p className="text-xs text-slate-600">Commandes à {a.ville}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stock bas */}
        <div className="rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Produits à réapprovisionner</h2>
            <Link href="/admin/produits" className="text-sm font-semibold text-brand-600">
              Gérer →
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-500">✅ Tous vos stocks sont suffisants.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {lowStock.map((p) => {
                const cat = categories.find((c) => c.slug === p.category);
                return (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="min-w-0 truncate">
                      {cat?.icon} {p.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.stock === 0 ? "Épuisé" : `${p.stock} restant(s)`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-sm font-semibold text-brand-600">
            Tout voir →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-6 text-center text-sm text-slate-500">Aucune commande pour le moment.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="py-2 pr-3">Réf.</th>
                  <th className="py-2 pr-3">Client</th>
                  <th className="py-2 pr-3">Agence</th>
                  <th className="py-2 pr-3">Total</th>
                  <th className="py-2 pr-3">Statut</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((o) => {
                  const info = statusInfo[o.status];
                  return (
                    <tr key={o.id}>
                      <td className="py-2.5 pr-3 font-mono font-bold">#{o.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-2.5 pr-3">{o.customer_name ?? "—"}</td>
                      <td className="py-2.5 pr-3">{o.agence}</td>
                      <td className="py-2.5 pr-3 font-medium">{formatPrice(o.total)}</td>
                      <td className="py-2.5 pr-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${info?.badge}`}>
                          {info?.label ?? o.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-500">{formatDate(o.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}