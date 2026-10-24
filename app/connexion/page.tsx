import Image from "next/image";
import Link from "next/link";
import AuthForm from "../components/AuthForm";

export const metadata = {
  title: "Connexion | Cigogne du Mandé",
  description: "Connectez-vous à votre compte pour suivre vos commandes.",
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

function ArrowLeftIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Flèche de retour */}
      <Link
        href="/"
        className={`group absolute left-4 top-4 z-10 inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white pl-3 pr-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md sm:left-6 sm:top-6 ${focusRing}`}
      >
        <ArrowLeftIcon className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Retour
        <span className="sr-only"> à l&apos;accueil</span>
      </Link>

      <div className="mx-auto grid min-h-screen max-w-6xl gap-12 px-4 pb-10 pt-24 md:pb-14 lg:pt-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center lg:gap-20">
        {/* ---------------------------------------------------------------- */}
        {/* CONTEXTE (desktop)                                               */}
        {/* ---------------------------------------------------------------- */}
        <aside className="hidden lg:block">
          <Link
            href="/"
            aria-label="Retour à l'accueil"
            className={`inline-block ${focusRing}`}
          >
            <Image
              src="/logo.png"
              alt="Cigogne du Mandé"
              width={200}
              height={72}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>

          <p className="mt-12 text-sm font-medium text-slate-500">
            Espace client
          </p>

          <h1 className="mt-4 max-w-md text-4xl font-semibold leading-[1.15] tracking-tight text-slate-900">
            Connectez-vous à votre espace.
          </h1>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600">
            Retrouvez vos commandes, vos devis et vos informations en un seul
            endroit — sans perdre de temps.
          </p>

          <ul className="mt-10 space-y-4 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400"
              />
              Suivi de commande en temps réel
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400"
              />
              Historique de vos demandes de devis
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400"
              />
              Informations de livraison enregistrées
            </li>
          </ul>
        </aside>

        {/* ---------------------------------------------------------------- */}
        {/* CARTE FORMULAIRE                                                 */}
        {/* ---------------------------------------------------------------- */}
        <main className="w-full">
          {/* Logo + retour (mobile / tablette) */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link
              href="/"
              aria-label="Retour à l'accueil"
              className={focusRing}
            >
              <Image
                src="/logo.png"
                alt="Cigogne du Mandé"
                width={200}
                height={72}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Connexion
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Accédez à votre compte pour continuer.
              </p>
            </div>

            <AuthForm mode="connexion" next={next} />
          </div>

          {/* Pied de carte */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Pas encore de compte ?{" "}
            <Link
              href="/inscription"
              className="font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              Créer un compte
            </Link>
          </p>

        </main>
      </div>
    </div>
  );
}