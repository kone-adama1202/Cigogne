

import Link from "next/link";
import { agences, siteConfig, whatsappLink } from "@/lib/config";
import { services } from "@/lib/data";

const stats = [
  { valeur: "2", label: "Agences" },
  { valeur: "7", label: "Services" },
  { valeur: "A→Z", label: "De l'idée à l'impression" },
  { valeur: "30 000 F", label: "Formation Office" },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function Accueil() {
  const lienDevis = whatsappLink(agences[0].whatsapp, "Bonjour, je souhaite un devis.");

  return (
    <section className="border-b-4 border-rouge bg-marine text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-24">
        {/* Texte principal */}
        <div>
          <p className="inline-flex items-center gap-2 border border-white/25 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80">
            <span className="h-1.5 w-1.5 bg-orange" aria-hidden="true" />
            Bamako · Sikasso
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-[3.4rem]">
            Transformons vos idées en <span className="text-orange">solutions numériques</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Reprographie, impression, matériels, personnalisation d'articles et formation.{" "}
            <span className="font-semibold text-white">{siteConfig.tagline}.</span>
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/produits"
              className={`inline-flex items-center gap-2 rounded-md bg-rouge px-7 py-3.5 font-semibold text-white hover:bg-rouge/90 ${focusRing}`}
            >
              Voir nos produits
              <span aria-hidden="true">→</span>
            </Link>

            <a
              href={lienDevis}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center rounded-md border border-white/40 px-7 py-3.5 font-semibold text-white hover:bg-white hover:text-marine ${focusRing}`}
            >
              Demander un devis
            </a>
          </div>

          {/* Chiffres clés */}
          <dl className="mt-12 grid grid-cols-2 border border-white/20 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-4 py-5 ${i % 2 === 1 ? "border-l border-white/20" : ""} ${
                  i > 1 ? "border-t border-white/20 sm:border-t-0" : ""
                } ${i > 0 ? "sm:border-l sm:border-white/20" : ""}`}
              >
                <dt className="text-2xl font-bold text-orange">{s.valeur}</dt>
                <dd className="mt-1 text-xs leading-snug text-white/70">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Liste des services */}
        <aside className="border border-white/20 bg-white text-slate-900">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-marine">
              Ce que nous faisons
            </h2>
          </div>

          <ul>
            {services.map((s, i) => (
              <li
                key={s.titre}
                className="flex items-center gap-4 border-b border-slate-100 px-6 py-3.5 last:border-b-0"
              >
                <span className="w-6 text-sm font-semibold tabular-nums text-rouge">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] font-medium text-slate-800">{s.titre}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}