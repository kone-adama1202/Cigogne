-- PROFILS (un par utilisateur)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('client','admin')),
  created_at timestamptz not null default now()
);

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'phone');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Savoir si l'utilisateur connecté est admin
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- PRODUITS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  price integer not null check (price >= 0),   -- en FCFA
  image_url text,
  stock integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- COMMANDES
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'en_attente'
    check (status in ('en_attente','confirmee','en_preparation','prete','livree','annulee')),
  total integer not null default 0,
  agence text not null,
  delivery_mode text not null default 'retrait' check (delivery_mode in ('retrait','livraison')),
  address text,
  note text,
  customer_name text,
  customer_phone text,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0)
);

-- SÉCURITÉ (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profils : chacun voit et modifie le sien, l'admin voit tout
create policy "profil lecture" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "profil modification" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
-- Un client ne peut modifier que son nom et son téléphone (pas son rôle)
revoke update on public.profiles from authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

-- Produits : visibles par tous, gérés par l'admin
create policy "produits lecture" on public.products for select
  using (active = true or public.is_admin());
create policy "produits admin" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- Commandes : le client voit les siennes, l'admin voit et modifie tout
create policy "commandes lecture" on public.orders for select
  using (user_id = auth.uid() or public.is_admin());
create policy "commandes admin modification" on public.orders for update
  using (public.is_admin()) with check (public.is_admin());

create policy "lignes lecture" on public.order_items for select
  using (
    public.is_admin() or exists (
      select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
    )
  );