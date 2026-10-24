import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import type { Product } from "@/lib/types";
import ProductForm from "../../../components/ProductForm";

export default async function ModifierProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await requireAdmin();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div>
      <h2 className="mb-5 text-xl font-bold">Modifier le produit</h2>
      <ProductForm product={data as Product} />
    </div>
  );
}