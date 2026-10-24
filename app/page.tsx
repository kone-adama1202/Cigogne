import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { services } from "@/lib/data";
import type { Product } from "@/lib/types";
import ProductCard from "./components/ProductCard";
import Typewriter from "./components/Typewriter";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

const btnPrimary = `inline-flex items-center rounded-md bg-brand-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 ${focusRing}`;
const btnSecondary = `inline-flex items-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-800 transition-colors hover:bg-slate-50 ${focusRing}`;
const textLink = `font-medium text-brand-600 underline decoration-brand-600/30 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-700 ${focusRing}`;

function SectionHeader({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h2>
        {text && (
          <p className="mt-3 text-lg leading-relaxed text-slate-600">{text}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export default async function Home() {
  const reprographie = services.find((s) => s.slug === "reprographie");

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("category", "ordinateurs")
    .order("created_at", { ascending: false })
    .limit(4);
  const ordinateurs = (data ?? []) as Product[];

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidde">
        {/* Image d'arrière-plan : /public/logo.png (à remplacer par une photo) */}
        <Image
          src="/ApB.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover"
        />

        {/* Dégradé de couleur : lisibilité du texte + identité de marque */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-brand-700/60"
        />

        {/* Trame de points, qui s'efface vers le bas */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Halos lumineux */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-sky-400/20 blur-3xl"
        />

        <div className="relative z-10 mx-auto flex max-w-6xl items-center px-4 pb-28 pt-16 md:pb-36 md:pt-24 lg:min-h-[640px]">
          {/* Texte principal */}
          <div className="max-w-3xl">
         

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-5xl xl:text-6xl">
              <Typewriter text="Entreprise de prestation de services et de commerce général" />
            </h1>

            <span
              aria-hidden="true"
              className="mt-6 block h-1 w-20 rounded-full bg-gradient-to-r from-brand-600 to-sky-400"
            />

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/produits"
                className={`group inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/40 motion-reduce:transform-none ${focusRing}`}
              >
                Voir nos produits
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        {/* Courbe de transition vers la section suivante */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 z-0 h-10 w-full fill-white md:h-16"
        >
          <path d="M0 48C240 0 480 0 720 28s480 44 720-4v56H0Z" />
        </svg>
      </section>

      {/* SERVICES */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <SectionHeader
            title="Nos services"
            text="Tout ce dont votre entreprise a besoin, au même endroit."
            action={
              <Link href="/services" className={textLink}>
                Voir tous les services
              </Link>
            }
          />

          {reprographie && (
            <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                {/* Image : /public/reprographie.jpg */}
                <Image
                  src="/reprographie.jpg"
                  alt="Notre service de reprographie"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                  {reprographie.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">
                  {reprographie.description}
                </p>
                <Link
                  href={`/services#${reprographie.slug}`}
                  className={`${btnPrimary} mt-8`}
                >
                  Découvrir la reprographie
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRODUITS */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Trame de points discrète */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(15,23,42,0.08) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        {/* Halos décoratifs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 -z-10 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-10 -z-10 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          {/* En-tête centré */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-brand-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Boutique en ligne
            </span>
            <h2 className="mt-5 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
              Nos produits
            </h2>
            <span
              aria-hidden="true"
              className="mx-auto mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-sky-400"
            />
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Commandez en ligne, puis recevez chez vous ou retirez en agence.
            </p>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <li className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true"
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                Livraison chez vous
              </li>
              <li className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Retrait en agence
              </li>
            </ul>
          </div>

          {/* Sélection d'ordinateurs */}
          {ordinateurs.length > 0 && (
            <div className="mt-14">
              <div className="mb-8 flex items-center gap-4">
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                  Nos ordinateurs
                </h3>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent"
                />
                <Link href="/produits?categorie=ordinateurs" className={textLink}>
                  Voir les ordinateurs
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {ordinateurs.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}