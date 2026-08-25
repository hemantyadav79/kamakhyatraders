-- =============================================================================
-- Hero section settings (carousel images + overlay). Run once in SQL Editor,
-- AFTER schema.sql. Safe to re-run.
-- =============================================================================

create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz default now()
);

-- Public can read settings (needed to render the hero); writes only via the
-- server (service-role key), same pattern as products.
alter table public.site_settings enable row level security;

drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
  on public.site_settings
  for select
  using (true);

-- Seed the default hero config (no slides yet → site shows the built-in design).
insert into public.site_settings (key, value)
values (
  'hero',
  '{"overlay": 55, "autoplay": true, "interval": 5, "slides": []}'::jsonb
)
on conflict (key) do nothing;
