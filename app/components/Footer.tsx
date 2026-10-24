import Image from "next/image";
import Link from "next/link";
import { agences, navLinks } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/* Styles partagés (alignés sur le Header)                                    */
/* -------------------------------------------------------------------------- */

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

const labelStyle =
  "text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400";

/* -------------------------------------------------------------------------- */
/* Icônes                                                                     */
/* -------------------------------------------------------------------------- */

type IconProps = { className?: string };

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  viewBox: "0 0 24 24",
};

function LocationIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4 shrink-0" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function ClockIcon({ className = "mt-0.5 h-4 w-4 shrink-0" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}



function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ArrowUpIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Utilitaires                                                                */
/* -------------------------------------------------------------------------- */

function telHref(telephone: string) {
  const digits = telephone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("+") ? digits : `+${digits}`}`;
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 px-3 pb-3 sm:px-6 sm:pb-5 lg:px-8 lg:pb-6">
      {/* Capsule flottante, même langage visuel que le header */}
      <div className="mx-auto max-w-7xl rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_40px_-14px_rgba(15,23,42,0.16)]">
        <div className="px-5 py-10 sm:px-8 md:py-12 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
            {/* Marque */}
            <div className="lg:col-span-3">
              <Link
                href="/"
                aria-label="Accueil"
                className={`group inline-flex items-center ${focusRing}`}
              >
                <Image
                  src="/logo.png"
                  alt="Cigogne du Mandé"
                  width={200}
                  height={72}
                  className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04] lg:h-14"
                />
              </Link>

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
                Impression, informatique et communication pour les entreprises
                de Bamako et Sikasso.
              </p>

              <Link
                href="/contact"
                className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl ${focusRing}`}
              >
                Demander un devis
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>

            {/* Navigation */}
            <nav aria-label="Navigation du pied de page" className="lg:col-span-2">
              <h2 className={labelStyle}>Navigation</h2>

              <ul className="mt-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950 ${focusRing}`}
                    >
                      {link.label}
                      <ArrowIcon className="h-4 w-4 -translate-x-1 text-slate-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Agences */}
            <section className="lg:col-span-7">
              <h2 className={labelStyle}>Nos agences</h2>

              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {agences.map((agence) => (
                  <li
                    key={agence.ville}
                    className="flex flex-col rounded-3xl border border-slate-200/80 bg-gradient-to-br from-brand-50/60 via-white to-slate-50 p-5 transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm ring-2 ring-white">
                        <LocationIcon />
                      </span>
                      <h3 className="text-base font-semibold text-slate-900">
                        {agence.ville}
                      </h3>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-700">
                      {agence.adresse}
                    </p>

                    <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-500">
                      <ClockIcon />
                      <span>{agence.horaires}</span>
                    </p>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `Cigogne du Mandé ${agence.ville} Mali`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-brand-700 underline-offset-4 hover:underline ${focusRing}`}
                    >
                      Voir l&apos;itinéraire
                      <ArrowIcon className="h-3.5 w-3.5" />
                      <span className="sr-only">(nouvel onglet)</span>
                    </a>

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200/80 pt-4">
                      <a
                        href={telHref(agence.telephone)}
                        className={`inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md ${focusRing}`}
                      >
                        <PhoneIcon />
                        {agence.telephone}
                      </a>

                     
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Bas de page */}
          <div className="mt-10 flex flex-col items-center gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
            <p className="text-xs leading-6 text-slate-500">
              © {year} Cigogne du Mandé. Tous droits réservés.
            </p>

            <a
              href="#"
              className={`inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md ${focusRing}`}
            >
              <ArrowUpIcon className="h-3.5 w-3.5" />
              Retour en haut
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}