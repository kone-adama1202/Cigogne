import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { categories } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import ProductAdminActions from "../../components/ProductAdminActions";

export default async function AdminProduitsPage() {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  const products = (data ?? []) as Product[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-slate-600">{products.length} produit(s)</p>
        <Link
          href="/admin/produits/nouveau"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Ajouter un produit
        </Link>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">Erreur : {error.message}</p>}

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => {
              const cat = categories.find((c) => c.slug === p.category);
              return (
                <tr key={p.id} className={p.active ? "" : "bg-slate-50 text-slate-500"}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-brand-50">
                        {p.image_url ? (
                          <Image src={p.image_url} alt="" fill sizes="48px" className="object-cover" />
                        ) : (
                          <span className="text-xl">{cat?.icon ?? "📦"}</span>
                        )}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{cat?.title ?? p.category}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className={`px-4 py-3 font-medium ${p.stock === 0 ? "text-red-600" : p.stock < 5 ? "text-amber-600" : ""}`}>
                    {p.stock}
                  </td>
                  <td className="px-4 py-3">{p.active ? "Visible" : "Masqué"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/produits/${p.id}`}
                        className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
                      >
                        Modifier
                      </Link>
                      <ProductAdminActions id={p.id} active={p.active} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}