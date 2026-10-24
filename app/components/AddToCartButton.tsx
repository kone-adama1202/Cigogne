"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-4 w-4",
  "aria-hidden": true,
};

function CartIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...iconProps} strokeWidth={3}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function BanIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </svg>
  );
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Évite de modifier l'état d'un composant déjà retiré de la page
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (product.stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-slate-100 py-2.5 text-sm font-semibold text-slate-400"
      >
        <BanIcon />
        Rupture de stock
      </button>
    );
  }

  function onClick() {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_url: product.image_url,
    });
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  }

  return (
    <>
      {product.stock <= 5 && (
        <p className="mb-2 text-xs font-medium text-amber-600">
          Plus que {product.stock} en stock
        </p>
      )}
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98] motion-reduce:transform-none ${
          added
            ? "bg-emerald-600 shadow-emerald-600/25"
            : "bg-brand-600 shadow-brand-600/25 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
        } ${focusRing}`}
      >
        {added ? <CheckIcon /> : <CartIcon />}
        <span aria-live="polite">
          {added ? "Ajouté au panier" : "Ajouter au panier"}
        </span>
      </button>
    </>
  );
}