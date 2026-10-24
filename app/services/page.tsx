import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos services | Cigogne du Mandé",
  description:
    "Reprographie, installation et maintenance, vente de matériel, bâches et enseignes, impression, personnalisation et formation bureautique à Bamako et Sikasso.",
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

/* -------------------------------------------------------------------------- */
/* Photos : à enregistrer dans /public/services/                              */
/* -------------------------------------------------------------------------- */

type Photo = {
  src: string;
  alt: string;
  label: string;
  position: string;
  ratio: string;
};

const photos = {
  copieur: {
    src: "/services/photocopieur.jpg",
    alt: "Photocopieur Canon de l'agence Cigogne du Mandé",
    label: "Reprographie",
    position: "50% 40%",
    ratio: "aspect-[3/4]",
  },
  photo: {
    src: "/services/imprimante-photo.jpg",
    alt: "Imprimante photo Canon Selphy",
    label: "Impression photo",
    position: "50% 45%",
    ratio: "aspect-square",
  },
  grandFormat: {
    src: "/services/grand-format.jpg",
    alt: "Imprimante grand format pour bâches et enseignes",
    label: "Bâches et enseignes",
    position: "45% 50%",
    ratio: "aspect-square",
  },
  ordinateur: {
    src: "/services/ordinateur.jpg",
    alt: "Ordinateur portable neuf dans son emballage",
    label: "Matériel",
    position: "50% 60%",
    ratio: "aspect-[3/4]",
  },
} satisfies Record<string, Photo>;

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PinIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/** Une photo du collage. */
function Tile({ photo }: { photo: Photo }) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-3xl bg-slate-200 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.4)] ring-4 ring-white ${photo.ratio}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 1024px) 25vw, 45vw"
        style={{ objectPosition: photo.position }}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent"
      />
      <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-md">
        {photo.label}
      </figcaption>
    </figure>
  );
}

export default function ServicesPage() {
  return (
    <>
      {/* ------------------------------------------------------------ */}
      {/* EN-TÊTE                                                       */}
      {/* ------------------------------------------------------------ */}
      <section className="px-3 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-brand-50 via-white to-slate-50 px-6 py-12 shadow-[0_10px_40px_-14px_rgba(15,23,42,0.16)] sm:px-10 md:py-16 lg:px-14">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-brand-600/5 blur-3xl"
          />

          <div className="relative">
            <span className="inline-flex items-center rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
              Nos services
            </span>

            <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 md:text-5xl md:leading-[1.1]">
              Tout pour votre entreprise, au même endroit
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Impression, informatique et communication à Bamako et Sikasso.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* COLLAGE + LISTE                                               */}
      {/* ------------------------------------------------------------ */}
      <section className="px-3 py-10 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Collage de photos */}
          <div className="relative lg:sticky lg:top-28 lg:col-span-6">
            {/* Décor derrière les photos */}
            <span
              aria-hidden="true"
              className="absolute -left-4 top-6 h-40 w-40 rounded-full bg-brand-100 blur-2xl sm:h-56 sm:w-56"
            />
            <span
              aria-hidden="true"
              className="absolute -right-4 bottom-10 h-40 w-40 rounded-full bg-amber-200/50 blur-2xl sm:h-56 sm:w-56"
            />

            <div className="relative mx-auto grid max-w-xl grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <Tile photo={photos.copieur} />
                <Tile photo={photos.photo} />
              </div>

              {/* Colonne décalée pour un effet "mosaïque" */}
              <div className="space-y-3 pt-8 sm:space-y-4 sm:pt-14">
                <Tile photo={photos.grandFormat} />
                <Tile photo={photos.ordinateur} />
              </div>

              {/* Pastille flottante */}
              <span className="absolute -bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-xl ring-1 ring-slate-200/70">
                <PinIcon className="h-4 w-4 text-brand-600" />
                Bamako · Sikasso
              </span>
            </div>
          </div>

          {/* Liste des services */}
          <div className="lg:col-span-6 lg:pt-4">
            <span
              aria-hidden="true"
              className="block h-1 w-10 rounded-full bg-brand-600"
            />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Ce que nous faisons
            </h2>

            <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
              {services.map((s) => (
                <li key={s.slug} id={s.slug} className="scroll-mt-28">
                  <p className="py-3.5 text-base text-slate-800 sm:text-lg">
                    {s.title}
                  </p>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline ${focusRing}`}
            >
              Demander un devis
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}