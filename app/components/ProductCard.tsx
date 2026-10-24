import Image from "next/image";
import { categories } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const cat = categories.find((c) => c.slug === product.category);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-600/30 hover:shadow-xl motion-reduce:transform-none">
      {/* Visuel */}
      <div className="relative isolate flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 to-sky-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
          />
        ) : (
          <span
            aria-hidden="true"
            className="text-7xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none"
          >
            {cat?.icon ?? "📦"}
          </span>
        )}

        {/* Catégorie en pastille */}
        {cat && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
            {cat.title}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-slate-900">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {product.description}
          </p>
        )}

        <div className="mt-auto border-t border-slate-100 pt-5">
          <p className="mb-3 text-xl font-bold tracking-tight text-brand-700">
            {formatPrice(product.price)}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}