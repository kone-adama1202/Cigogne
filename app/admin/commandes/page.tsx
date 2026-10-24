import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import { formatDate, statusInfo, type Order } from "@/lib/orders";
import AdminStatusSelect from "../../components/AdminStatusSelect";

type AdminOrder = Order & {
  customer_name: string | null;
  customer_phone: string | null;
};

export default async function AdminCommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const supabase = await requireAdmin();
  const { statut } = await searchParams;
  const active = statut && statusInfo[statut] ? statut : undefined;

  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (active) query = query.eq("status", active);

  const { data, error } = await query;
  const orders = (data ?? []) as AdminOrder[];

  const chip = (on: boolean) =>
    `shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
      on ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`;

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Link href="/admin/commandes" className={chip(!active)}>
          Toutes
        </Link>
        {Object.entries(statusInfo).map(([value, info]) => (
          <Link key={value} href={`/admin/commandes?statut=${value}`} className={chip(active === value)}>
            {info.label}
          </Link>
        ))}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">Erreur : {error.message}</p>}
      {orders.length === 0 && !error && (
        <p className="mt-10 text-center text-slate-500">Aucune commande.</p>
      )}

      <div className="mt-5 space-y-4">
        {orders.map((o) => {
          const info = statusInfo[o.status];
          const phone = (o.customer_phone ?? "").replace(/\D/g, "");
          return (
            <article key={o.id} className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-bold">#{o.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-slate-500">{formatDate(o.created_at)}</p>
                  <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${info?.badge}`}>
                    {info?.label ?? o.status}
                  </span>
                </div>
                <AdminStatusSelect orderId={o.id} status={o.status} />
              </div>

              <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <p className="font-semibold">{o.customer_name}</p>
                  <p className="mt-1 flex flex-wrap gap-3">
                    <a href={`tel:${o.customer_phone}`} className="text-brand-600 hover:underline">
                      📞 {o.customer_phone}
                    </a>
                    {phone && (
                      <a
                        href={`https://wa.me/${phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 hover:underline"
                      >
                        WhatsApp
                      </a>
                    )}
                  </p>
                  <p className="mt-2 text-slate-600">
                    {o.delivery_mode === "retrait"
                      ? `🏬 Retrait à ${o.agence}`
                      : `🚚 Livraison : ${o.address} (agence de ${o.agence})`}
                  </p>
                  {o.note && <p className="mt-1 text-slate-500">📝 {o.note}</p>}
                </div>

                <div>
                  <ul className="divide-y divide-slate-100">
                    {o.order_items.map((i) => (
                      <li key={i.id} className="flex justify-between gap-3 py-1.5">
                        <span>
                          {i.quantity} × {i.product_name}
                        </span>
                        <span className="shrink-0 text-slate-600">{formatPrice(i.unit_price * i.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-bold">
                    <span>Total</span>
                    <span className="text-brand-700">{formatPrice(o.total)}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}