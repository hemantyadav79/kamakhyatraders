-- =============================================================================
-- Customer reviews — visitor-submitted, owner-moderated.
--
-- Replaces the old `products.reviews` jsonb column (see product-reviews.sql).
-- A real table is needed now that visitors write reviews themselves:
--   * two people reviewing at the same moment would overwrite each other in a
--     jsonb column (read-modify-write race) — rows can't lose each other;
--   * each review needs its own moderation status and id;
--   * the admin panel needs one list across every product.
--
-- The old column is left in place (nothing reads it any more) so this migration
-- is reversible. Run once in the Supabase SQL Editor, AFTER schema.sql.
-- Safe to re-run.
-- =============================================================================

create table if not exists public.product_reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  author      text not null,
  rating      smallint not null default 5 check (rating between 1 and 5),
  comment     text not null default '',
  -- 'approved' → visible on the site. 'pending' → held for the owner to check
  -- (the spam/abuse filter flagged it). 'rejected' → kept but never shown.
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'rejected')),
  -- Why the filter held it, e.g. 'contains a link'. Null when auto-approved.
  hold_reason text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Product pages read "approved reviews for this product, newest first".
create index if not exists product_reviews_product_idx
  on public.product_reviews (product_id, status, created_at desc);

-- The admin panel reads "everything, pending first, newest first".
create index if not exists product_reviews_status_idx
  on public.product_reviews (status, created_at desc);

-- Reuse the updated_at trigger function defined in schema.sql.
drop trigger if exists product_reviews_updated_at on public.product_reviews;
create trigger product_reviews_updated_at
  before update on public.product_reviews
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row-Level Security.
--
-- The public/anon key may read ONLY approved reviews — so even if the storefront
-- code had a bug, a pending or rejected review could not leak to a visitor.
-- There is deliberately NO insert policy: new reviews are written by the server
-- (service_role, which bypasses RLS) via /api/reviews, so rate limiting, the
-- honeypot and the abuse filter can never be skipped by posting straight to
-- Supabase with the publishable key.
-- ---------------------------------------------------------------------------
alter table public.product_reviews enable row level security;

drop policy if exists "Public can read approved reviews" on public.product_reviews;
create policy "Public can read approved reviews"
  on public.product_reviews
  for select
  using (status = 'approved');

-- ---------------------------------------------------------------------------
-- One-time migration: copy any reviews already stored in products.reviews
-- (added from the admin panel before this table existed) across as approved.
-- The NOT EXISTS guard makes re-running this file a no-op.
-- ---------------------------------------------------------------------------
insert into public.product_reviews (product_id, author, rating, comment, status, created_at)
select
  p.id,
  coalesce(nullif(trim(r ->> 'author'), ''), 'Customer'),
  least(5, greatest(1, coalesce(nullif(r ->> 'rating', '')::int, 5))),
  coalesce(r ->> 'comment', ''),
  'approved',
  coalesce(nullif(r ->> 'date', '')::timestamptz, now())
from public.products p
cross join lateral jsonb_array_elements(
  case when jsonb_typeof(p.reviews) = 'array' then p.reviews else '[]'::jsonb end
) as r
where not exists (
  select 1
  from public.product_reviews pr
  where pr.product_id = p.id
    and pr.author = coalesce(nullif(trim(r ->> 'author'), ''), 'Customer')
    and pr.comment = coalesce(r ->> 'comment', '')
);
