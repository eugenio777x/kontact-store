-- ═══════════════════════════════════════════════
--  KONTACT — Supabase Schema
--  Run in: Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- Extensions
create extension if not exists "uuid-ossp";

-- ── CATEGORIES ──
create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ── PRODUCTS ──
create table public.products (
  id            uuid primary key default uuid_generate_v4(),
  category_id   uuid references public.categories(id) on delete set null,
  name          text not null,
  slug          text not null unique,
  description   text,
  price         numeric(10,2) not null,
  compare_price numeric(10,2),
  images        text[] default '{}',
  is_active     boolean default true,
  is_featured   boolean default false,
  metadata      jsonb default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── PRODUCT VARIANTS (talla/color) ──
create table public.product_variants (
  id         uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  size       text,
  color      text,
  color_hex  text,
  sku        text unique,
  stock      int not null default 0,
  price_mod  numeric(10,2) default 0,
  created_at timestamptz default now()
);

-- ── ORDERS ──
create table public.orders (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid references auth.users(id) on delete set null,
  stripe_session_id  text unique,
  stripe_payment_id  text,
  status             text not null default 'pending'
                     check (status in ('pending','paid','shipped','delivered','cancelled','refunded')),
  subtotal           numeric(10,2) not null,
  shipping_cost      numeric(10,2) default 0,
  total              numeric(10,2) not null,
  currency           text default 'mxn',
  customer_email     text not null,
  customer_name      text,
  customer_phone     text,
  shipping_address   jsonb,
  notes              text,
  tracking_number    text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- ── ORDER ITEMS ──
create table public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  variant_id  uuid references public.product_variants(id) on delete set null,
  name        text not null,
  variant_label text,
  price       numeric(10,2) not null,
  quantity    int not null default 1,
  image_url   text
);

-- ── UPDATED_AT TRIGGER ──
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger trg_products_updated before update on public.products
  for each row execute function update_updated_at();

create trigger trg_orders_updated before update on public.orders
  for each row execute function update_updated_at();

-- ── RLS POLICIES ──
alter table public.categories      enable row level security;
alter table public.products        enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;

-- Public read for products & categories
create policy "public read categories"     on public.categories      for select using (true);
create policy "public read products"       on public.products        for select using (is_active = true);
create policy "public read variants"       on public.product_variants for select using (true);

-- Orders: owner or admin
create policy "user read own orders"       on public.orders          for select using (auth.uid() = user_id);
create policy "service insert orders"      on public.orders          for insert with check (true);
create policy "service update orders"      on public.orders          for update using (true);

create policy "user read own order items"  on public.order_items     for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "service insert order items" on public.order_items     for insert with check (true);

-- Admin role (set via Supabase Auth custom claims or service role)
create policy "admin all categories"       on public.categories      for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin all products"         on public.products        for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin all variants"         on public.product_variants for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin all orders"           on public.orders          for all using (auth.jwt() ->> 'role' = 'admin');
create policy "admin all order items"      on public.order_items     for all using (auth.jwt() ->> 'role' = 'admin');

-- ── STORAGE BUCKET ──
insert into storage.buckets (id, name, public) values ('products', 'products', true);

create policy "public read product images" on storage.objects
  for select using (bucket_id = 'products');

create policy "admin upload product images" on storage.objects
  for insert with check (bucket_id = 'products' and auth.jwt() ->> 'role' = 'admin');

create policy "admin delete product images" on storage.objects
  for delete using (bucket_id = 'products' and auth.jwt() ->> 'role' = 'admin');

-- ── SEED DATA ──
insert into public.categories (name, slug, sort_order) values
  ('Guantes', 'guantes', 1),
  ('Protección', 'proteccion', 2),
  ('Entrenamiento', 'entrenamiento', 3),
  ('Ropa', 'ropa', 4),
  ('Económicos', 'economicos', 5);

-- ── FUNCTION: decrement stock on order ──
create or replace function decrement_stock(p_variant_id uuid, p_qty int)
returns void as $$
begin
  update public.product_variants
  set stock = stock - p_qty
  where id = p_variant_id and stock >= p_qty;
  if not found then
    raise exception 'Insufficient stock for variant %', p_variant_id;
  end if;
end;
$$ language plpgsql security definer;
