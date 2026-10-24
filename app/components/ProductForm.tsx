"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { categories } from "@/lib/data";
import type { Product } from "@/lib/types";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    let image_url = product?.image_url ?? null;
    const file = form.get("image") as File | null;

    if (file && file.size > 0) {
      if (file.size > 2 * 1024 * 1024) {
        setError("La photo dépasse 2 Mo.");
        setLoading(false);
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("products")
        .upload(path, file, { contentType: file.type });
      if (upErr) {
        setError("Échec du téléversement : " + upErr.message);
        setLoading(false);
        return;
      }
      image_url = supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
    }

    const values = {
      name: String(form.get("name")).trim(),
      description: String(form.get("description") ?? "").trim() || null,
      category: String(form.get("category")),
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
      active: form.get("active") === "on",
      image_url,
    };

    const { error } = product
      ? await supabase.from("products").update(values).eq("id", product.id)
      : await supabase.from("products").insert(values);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/produits");
    router.refresh();
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nom du produit</label>
        <input name="name" required defaultValue={product?.name} className={input} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea name="description" rows={3} defaultValue={product?.description ?? ""} className={input} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-3 sm:col-span-1">
          <label className="mb-1 block text-sm font-medium">Catégorie</label>
          <select name="category" defaultValue={product?.category ?? categories[0].slug} className={input}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-sm font-medium">Prix (FCFA)</label>
          <input name="price" type="number" min={0} step={1} required defaultValue={product?.price} className={input} />
        </div>
        <div className="col-span-1">
          <label className="mb-1 block text-sm font-medium">Stock</label>
          <input name="stock" type="number" min={0} step={1} required defaultValue={product?.stock ?? 0} className={input} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Photo (JPG, PNG ou WebP, 2 Mo max)</label>
        {preview && (
          <div className="relative mb-2 h-40 w-40 overflow-hidden rounded-lg border border-slate-200">
            <Image src={preview} alt="Aperçu" fill unoptimized className="object-cover" />
          </div>
        )}
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="text-sm" />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input name="active" type="checkbox" defaultChecked={product?.active ?? true} className="h-4 w-4" />
        Visible sur le site
      </label>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button
          disabled={loading}
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Enregistrement..." : product ? "Enregistrer" : "Ajouter le produit"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produits")}
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold hover:bg-slate-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}