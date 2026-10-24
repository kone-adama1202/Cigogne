export const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/produits", label: "Nos produits" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export const entreprise = {
  nom: "Cigogne du Mandé",
  slogan: "Transformons vos idées en solutions numériques",
  accroche: "Nous imprimons vos empreintes de A à Z",
};

/* -------------------------------------------------------------------------- */
/*                                  Contacts                                  */
/* -------------------------------------------------------------------------- */

export const telephones = [
  "+223 72 25 66 36",
  "+223 78 57 94 58",
  "+223 75 03 03 07",
];

// "+223 72 25 66 36" -> "22372256636"
export const digits = (t: string) => t.replace(/\D/g, "");

export const agences = [
  {
    ville: "Bamako",
    adresse: "Bamako, Mali",
    telephone: telephones[0],
    whatsapp: digits(telephones[0]),
    horaires: "Lun - Sam : 8h - 18h",
  },
  {
    ville: "Sikasso",
    adresse: "Sikasso, Mali",
    telephone: telephones[1],
    whatsapp: digits(telephones[1]),
    horaires: "Lun - Sam : 8h - 18h",
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Services                                  */
/* -------------------------------------------------------------------------- */

export const services = [
  {
    slug: "reprographie",
    title: "Reprographie",
    description: "Photocopie, numérisation et impression en grand volume.",
  },
  {
    slug: "installation-maintenance",
    title: "Installation & maintenance",
    description:
      "Installation, entretien et dépannage de vos équipements informatiques.",
  },
  {
    slug: "vente-materiels",
    title: "Vente de matériels & consommables",
    description:
      "Matériels informatiques, fournitures de bureau, papiers, encres et toners.",
  },
  {
    slug: "confection-pose",
    title: "Confection & pose",
    description:
      "Conception, fabrication et pose de bâches publicitaires, d'affiches et d'enseignes.",
  },
  {
    slug: "impression-graphique",
    title: "Impression & conception graphique",
    description:
      "Cartes de visite, flyers, logos et supports de communication.",
  },
  {
    slug: "personnalisation",
    title: "Personnalisation d'articles",
    description:
      "T-shirts, mugs, casquettes et autres articles à l'image de votre marque.",
  },
  {
    slug: "formation-bureautique",
    title: "Formation en bureautique",
    description:
      "Formation pratique sur Word, Excel et PowerPoint : traitement de texte, tableaux, calculs et présentations professionnelles.",
  },
];



/* -------------------------------------------------------------------------- */
/*                                 Catégories                                 */
/* -------------------------------------------------------------------------- */

export const categories = [
  { slug: "ordinateurs", title: "Ordinateurs", text: "Portables et ordinateurs de bureau" },
  { slug: "telephones", title: "Téléphones", text: "Smartphones et accessoires" },
  { slug: "ecrans", title: "Écrans", text: "Moniteurs et écrans pour le bureau" },
  { slug: "imprimantes", title: "Imprimantes", text: "Imprimantes et photocopieurs" },
  { slug: "consommables", title: "Encres & toners", text: "Cartouches, toners et papiers" },
  { slug: "fournitures", title: "Fournitures de bureau", text: "Tout pour équiper votre bureau" },
];