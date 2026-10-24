import CartView from "../components/CartView";

export default function PanierPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Mon panier</h1>
      <CartView />
    </div>
  );
}