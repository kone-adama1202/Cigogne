import type { Metadata } from "next";
import Link from "next/link";
import { agences, entreprise, services } from "@/lib/data";
import PhotoFrame from "../components/PhotoFrame";

export const metadata: Metadata = {
  title: "À propos | Cigogne du Mandé",
  description:
    "Cigogne du Mandé : impression, informatique et communication pour les entreprises de Bamako et Sikasso.",
};

/* -------------------------------------------------------------------------- */
/* À personnaliser                                                            */
/* -------------------------------------------------------------------------- */

/** Photo : à enregistrer dans /public/fondateur.jpg */
const fondateur = {
  nom: "Mamadou Boubou Bathily", // ← à remplacer
  role: "Fondateur",
  photo: "/fondateur.jpg",
  message:
    "Notre métier : vous accompagner de l'idée jusqu'au résultat imprimé, avec un seul interlocuteur.", // ← à remplacer par son vrai mot
};

/** Photos des agences : /public/agences/bamako.jpg et /public/agences/sikasso.jpg */
const agencePhoto = (ville: string) =>
  `/agences/${ville
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")}.jpg`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

/* -------------------------------------------------------------------------- */
/* Utilitaires et icônes                                                      */
/* -------------------------------------------------------------------------- */

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  viewBox: "0 0 24 24",
};

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4 shrink-0" }: { className?: string }) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-4 w-4 shrink-0" }: { className?: string }) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.6A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M8.5 8.5c.5 2.5 2.5 4.5 5 5l1.2-1.2 2 .8c-.2 1.3-1.3 2-2.5 1.8-3.5-.6-6.5-3.6-7.1-7.1-.2-1.2.5-2.3 1.8-2.5l.8 2Z" />
    </svg>
  );
}

function ClockIcon({ className = "h-4 w-4 shrink-0" }: { className?: string }) {
  return (
    <svg {...iconBase} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon({ className = "h-4 w-4 shrink-0" }: { className?: string }) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function telHref(telephone: string) {
  const digits = telephone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("+") ? digits : `+${digits}`}`;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AProposPage() {
  const chiffres = [
    { valeur: String(services.length), label: "services" },
    { valeur: String(agences.length), label: "agences" },
    { valeur: "A à Z", label: "de l'idée à l'impression" },
  ];

  return (
    <>
      

      {/* ------------------------------------------------------------ */}
      {/* QUI SOMMES-NOUS + FONDATEUR                                   */}
      {/* ------------------------------------------------------------ */}
      <section className="px-3 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Photo du fondateur */}
          <div className="lg:col-span-5">
            <figure className="group relative mx-auto max-w-sm lg:max-w-none">
              <span
                aria-hidden="true"
                className="absolute -bottom-4 -right-4 h-full w-full rounded-[32px] bg-brand-100"
              />
              <PhotoFrame
                src={fondateur.photo}
                alt={`Portrait de ${fondateur.nom}, ${fondateur.role.toLowerCase()} de ${entreprise.nom}`}
                fallbackText={fondateur.nom.charAt(0)}
                position="50% 25%"
                sizes="(min-width: 1024px) 40vw, 90vw"
                priority
                className="relative aspect-[4/5] rounded-[32px] shadow-[0_24px_60px_-20px_rgba(15,23,42,0.4)] ring-4 ring-white"
              />
              <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
                <p className="text-sm font-bold text-slate-900">
                  {fondateur.nom}
                </p>
                <p className="text-xs text-slate-500">{fondateur.role}</p>
              </figcaption>
            </figure>
          </div>

          {/* Texte */}
          <div className="lg:col-span-7">
            <span
              aria-hidden="true"
              className="block h-1 w-10 rounded-full bg-brand-600"
            />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {entreprise.accroche}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Impression, informatique et communication : nous accompagnons les
              entreprises de Bamako et Sikasso avec {services.length} services
              réunis chez un seul interlocuteur.
            </p>

            <blockquote className="mt-7 max-w-xl rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <p className="text-base leading-relaxed text-slate-700">
                « {fondateur.message} »
              </p>
              <footer className="mt-3 text-sm font-semibold text-brand-700">
                {fondateur.nom}
              </footer>
            </blockquote>

            <dl className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {chiffres.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl bg-brand-50 px-4 py-4 text-center ring-1 ring-brand-100"
                >
                  <dt className="sr-only">{c.label}</dt>
                  <dd className="text-2xl font-bold text-brand-700 md:text-3xl">
                    {c.valeur}
                  </dd>
                  <p
                    aria-hidden="true"
                    className="mt-1 text-xs leading-snug text-slate-600"
                  >
                    {c.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>


      {/* ------------------------------------------------------------ */}
      {/* NOS AGENCES                                                   */}
      {/* ------------------------------------------------------------ */}
      <section className="px-3 pb-12 sm:px-6 md:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span
            aria-hidden="true"
            className="block h-1 w-10 rounded-full bg-brand-600"
          />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Nos agences
          </h2>

          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {agences.map((agence) => (
              <li key={agence.ville}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_40px_-18px_rgba(15,23,42,0.18)]">
                  <div className="relative">
                    <PhotoFrame
                      src={agencePhoto(agence.ville)}
                      alt={`Agence de ${agence.ville}`}
                      fallbackText={agence.ville.charAt(0)}
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="aspect-[16/10]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"
                    />
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-900 shadow-md">
                      <PinIcon className="h-4 w-4 text-brand-600" />
                      {agence.ville}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm leading-relaxed text-slate-700">
                      {agence.adresse}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <ClockIcon className="h-4 w-4 shrink-0" />
                      {agence.horaires}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <a
                        href={telHref(agence.telephone)}
                        className={`inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md ${focusRing}`}
                      >
                        <PhoneIcon />
                        {agence.telephone}
                      </a>

                      <a
                        href={`https://wa.me/${agence.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex h-11 items-center gap-2 rounded-full bg-emerald-700 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl ${focusRing}`}
                      >
                        <WhatsAppIcon />
                        WhatsApp
                        <span className="sr-only">
                          {" "}
                          de l&apos;agence de {agence.ville} (nouvel onglet)
                        </span>
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      
    </>
  );
}