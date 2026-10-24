export const statusInfo: Record<string, { label: string; badge: string }> = {
    en_attente: { label: "En attente", badge: "bg-amber-100 text-amber-800" },
    confirmee: { label: "Confirmée", badge: "bg-blue-100 text-blue-800" },
    en_preparation: { label: "En préparation", badge: "bg-indigo-100 text-indigo-800" },
    prete: { label: "Prête", badge: "bg-teal-100 text-teal-800" },
    livree: { label: "Livrée / retirée", badge: "bg-green-100 text-green-800" },
    annulee: { label: "Annulée", badge: "bg-red-100 text-red-800" },
  };
  
  // Étapes du suivi (dans l'ordre)
  export const statusSteps = ["en_attente", "confirmee", "en_preparation", "prete", "livree"];
  
  export type OrderItem = {
    id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  };
  
  export type Order = {
    id: string;
    status: string;
    total: number;
    agence: string;
    delivery_mode: "retrait" | "livraison";
    address: string | null;
    note: string | null;
    created_at: string;
    order_items: OrderItem[];
  };
  
  export function formatDate(iso: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Africa/Bamako",
    }).format(new Date(iso));
  }