-- =============================================================================
-- Kamakhya Traders — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query) once.
-- =============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  name_hindi   text,
  category     text,
  summary      text,
  description  text,
  uses         text[] default '{}',
  unit         text,
  price_label  text default 'Negotiable',
  image        text,
  image_alt    text,
  in_stock     boolean default true,
  badge        text,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists products_sort_idx on public.products (sort_order desc);

-- Keep updated_at fresh on every change.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row-Level Security: anyone may READ products (public storefront), but nobody
-- can write through the public/anon key. The admin API uses the service_role
-- key, which bypasses RLS — so writes are only possible from the server.
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  using (true);

-- Intentionally NO insert/update/delete policies for anon or authenticated.
