import { requireAdmin } from "@/lib/admin";
import AdminNav from "../components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await requireAdmin();

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "en_attente");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:block">
            ⚙️ Administration
          </p>
          <AdminNav pending={count ?? 0} />
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}