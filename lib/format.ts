export function formatPrice(n: number) {
    return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
  }