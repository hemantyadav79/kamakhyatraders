-- =============================================================================
-- Add real customer reviews to each product, so Product structured data can
-- validly include `aggregateRating` (Google requires review/rating data in
-- structured markup to reflect genuine content that's also shown on the page
-- — these reviews are entered from real customer feedback and displayed on
-- the product page, not just hidden numbers).
-- Run once in the SQL Editor, AFTER schema.sql. Safe to re-run.
-- =============================================================================

alter table public.products
  add column if not exists reviews jsonb not null default '[]';

-- Shape of each element in `reviews`:
--   { "author": "Ravi Kumar", "rating": 5, "comment": "...", "date": "2026-08-20" }
