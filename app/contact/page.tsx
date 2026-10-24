import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Cigogne du Mandé",
  description:
    "Contactez Cigogne du Mandé à Bamako et Sikasso : demande de devis, question ou commande.",
};

export default function ContactPage() {
  return (
    <>
      {/* ------------------------------------------------------------ */}
      {/* EN-TÊTE                                                       */}
      {/* ------------------------------------------------------------ */}
      <section className="border-b border-brand-600/15 bg-brand-600/5">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <span
            aria-hidden="true"
            className="block h-1 w-10 rounded-full bg-brand-600"
          />
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand-700">
            Contact
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Écrivez-nous, nous vous répondons vite.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Un devis, une question, une commande ? Décrivez votre besoin, nous
            revenons vers vous rapidement.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* FORMULAIRE                                                    */}
      {/* ------------------------------------------------------------ */}
      <div className="bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
          {/* Texte d'introduction */}
          <div className="lg:col-span-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Envoyez-nous un message
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Plus votre message est précis, plus notre réponse sera utile :
              indiquez le service concerné, les quantités ou les délais si vous
              les connaissez.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Vous préférez appeler ou écrire sur WhatsApp ? Les coordonnées de
              nos agences de Bamako et Sikasso sont en bas de page.
            </p>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}