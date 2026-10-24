"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/commandes", label: "Commandes", icon: "📦" },
  { href: "/admin/produits", label: "Produits", icon: "🛍️" },
];

export default function AdminNav({ pending }: { pending: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-brand-50"
            }`}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
            {l.href === "/admin/commandes" && pending > 0 && (
              <span className="ml-auto rounded-full bg-accent-500 px-2 text-xs font-bold text-slate-900">
                {pending}
              </span>
            )}
          </Link>
        );
      })}
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 lg:mt-4 lg:border-t lg:border-slate-200 lg:pt-4"
      >
        ↩ Voir le site
      </Link>
    </nav>
  );
}