import Link from "next/link";
import { agences } from "@/lib/data";

export default async function SuccesPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; agence?: string }>;
}) {
  const { ref = "", agence = "" } = await searchParams;
  const shortRef = ref.slice(0, 8).toUpperCase();
  const a = agences.find((x) => x.ville === agence);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-6xl">✅</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Commande enregistrée !</h1>
      <p className="mt-2 text-slate-600">
        Référence : <span className="font-mono font-bold">{shortRef}</span>
      </p>
      <p className="mt-1 text-slate-600">
        L&apos;agence vous contactera pour confirmer. Vous pouvez suivre l&apos;état de votre commande dans « Mes commandes ».
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {a && (
          <a
            href={`https://wa.me/${a.whatsapp}?text=${encodeURIComponent(
              `Bonjour, je viens de passer la commande ${shortRef} sur votre site.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700"
          >
            Prévenir l&apos;agence sur WhatsApp
          </a>
        )}
        <Link href="/commande" className="rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700">
          Voir mes commandes
        </Link>
        <Link href="/produits" className="text-sm font-semibold text-brand-600">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}