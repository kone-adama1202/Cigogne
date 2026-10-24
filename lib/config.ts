export const siteConfig = {
    name: "Cigogne du Mandé",
    slogan: "Transformons vos idées en solutions numériques",
    tagline: "Nous imprimons vos empreintes de A à Z",
  };
  
  export const agences = [
    {
      id: "bamako", 
      ville: "Bamako",
      quartier: "Mamaribougou",
      whatsapp: "22372256636", // à confirmer
      telephones: ["72 25 66 36", "78 57 94 58", "75 03 03 07"],
    },
    {
      id: "sikasso",
      ville: "Sikasso",
      quartier: "Centre-ville", // à remplacer
      whatsapp: "22378579458", // à confirmer
      telephones: ["78 57 94 58"], // à confirmer
    },
  ];
  
  export function whatsappLink(numero: string, message: string) {
    return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
  }