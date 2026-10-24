import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  quantity: number;
};

const KEY = "cigogne-cart";
const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    items = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    items = EMPTY;
  }
}

function save(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  load();
  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

function add(item: Omit<CartItem, "quantity">, qty = 1) {
  load();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    save(
      items.map((i) =>
        i.id === item.id
          ? { ...i, stock: item.stock, quantity: Math.min(item.stock, i.quantity + qty) }
          : i
      )
    );
  } else {
    save([...items, { ...item, quantity: Math.min(item.stock, qty) }]);
  }
}

function setQuantity(id: string, quantity: number) {
  load();
  save(
    items.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) } : i
    )
  );
}

function remove(id: string) {
  load();
  save(items.filter((i) => i.id !== id));
}

function clear() {
  save(EMPTY);
}

export function useCart() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = list.reduce((n, i) => n + i.quantity, 0);
  const total = list.reduce((n, i) => n + i.price * i.quantity, 0);
  return { items: list, count, total, add, setQuantity, remove, clear };
}