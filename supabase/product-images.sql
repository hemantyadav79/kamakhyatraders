-- =============================================================================
-- Add a gallery (multiple images) to each product for the detail-page carousel.
-- Run once in the SQL Editor, AFTER schema.sql. Safe to re-run.
-- The existing `image` column stays as the main/primary image; `images` holds
-- any additional photos shown in the carousel.
-- =============================================================================

alter table public.products
  add column if not exists images text[] not null default '{}';
