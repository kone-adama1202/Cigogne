import { requireAdmin } from "@/lib/admin";
import ProductForm from "../../../components/ProductForm";

export default async function NouveauProduitPage() {
  await requireAdmin();
  return (
    <div>
      <h2 className="mb-5 text-xl font-bold">Ajouter un produit</h2>
      <ProductForm />
    </div>
  );
}