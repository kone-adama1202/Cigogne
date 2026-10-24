import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { categories } from "@/lib/data";
import type { Product } from "@/lib/types";
import ProductCard from "../components/ProductCard";

export const metadata: Metadata = {
  title: "Nos produits | Cigogne du Mandé",
  description:
    "Ordinateurs, téléphones, écrans, imprimantes, encres, toners et fournitures de bureau.",
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

type Filter = { slug: string; title: string };

function FilterList({
  filters,
  active,
}: {
  filters: Filter[];
  active?: string;
}) {
  return (
    <ul className="space-y-1">
      {filters.map((f) => {
        const isActive = (f.slug || null) === (active ?? null);
        const href = f.slug ? `/produits?categorie=${f.slug}` : "/produits";
        return (
          <li key={f.slug || "all"}>
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`block rounded-r-md border-l-2 py-2 pl-3 pr-2 text-sm transition-colors ${
                isActive
                  ? "border-brand-600 bg-brand-600/5 font-semibold text-brand-700"
                  : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
              } ${focusRing}`}
            >
              {f.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const active = categories.find((c) => c.slug === categorie)?.slug;

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (active) query = query.eq("category", active);

  const { data, error } = await query;
  if (error) console.error("Erreur chargement produits :", error.message);
  const products = (data ?? []) as Product[];

  const filters: Filter[] = [{ slug: "", title: "Tous les produits" }, ...categories];
  const activeTitle = active
    ? categories.find((c) => c.slug === active)?.title
    : null;

  return (
    <>
      {/* ------------------------------------------------------------ */}
      {/* EN-TÊTE                                                       */}
      {/* ------------------------------------------------------------ */}
      <section className="border-b border-brand-600/15 bg-brand-600/5">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <span
            aria-hidden="true"
            className="block h-1 w-10 rounded-full bg-brand-600"
          />
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand-700">
            Boutique
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {activeTitle ?? "Nos produits"}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Commandez en ligne, puis retirez en agence ou faites-vous livrer.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* FILTRES + PRODUITS                                            */}
      {/* ------------------------------------------------------------ */}
      <div className="bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:py-14 lg:grid-cols-[220px_1fr] lg:gap-10">
          {/* Filtres : mobile (repliable) */}
          <details className="group rounded-xl border border-slate-200 bg-white lg:hidden">
            <summary
              className={`flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden ${focusRing}`}
            >
              <span>
                Filtrer par catégorie
                {activeTitle && (
                  <span className="ml-2 font-normal text-brand-700">
                    · {activeTitle}
                  </span>
                )}
              </span>
              <span
                aria-hidden="true"
                className="text-slate-400 transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <nav
              aria-label="Filtrer par catégorie"
              className="border-t border-slate-200 p-3"
            >
              <FilterList filters={filters} active={active} />
            </nav>
          </details>

          {/* Filtres : ordinateur (colonne fixe) */}
          <aside className="hidden lg:block">
            <nav
              aria-label="Filtrer par catégorie"
              className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4"
            >
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-700">
                Catégories
              </h2>
              <FilterList filters={filters} active={active} />
            </nav>
          </aside>

          {/* Produits */}
          <div>
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                Impossible de charger les produits pour le moment. Merci de
                réessayer dans quelques instants.
              </p>
            )}

            {products.length === 0 && !error ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Aucun produit pour le moment
                </p>
                <p className="mt-2 text-slate-600">
                  Revenez bientôt, notre catalogue est mis à jour régulièrement.
                </p>
                {active && (
                  <Link
                    href="/produits"
                    className={`mt-6 inline-flex items-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 ${focusRing}`}
                  >
                    Voir tous les produits
                  </Link>
                )}
              </div>
            ) : (
              products.length > 0 && (
                <>
                  <p className="mb-6 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {products.length} produit{products.length > 1 ? "s" : ""}
                    </span>
                    {activeTitle ? ` · ${activeTitle}` : ""}
                  </p>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}