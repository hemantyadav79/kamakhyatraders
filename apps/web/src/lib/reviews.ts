import 'server-only';
import { getSupabasePublic, getSupabaseAdmin } from '@/lib/supabase';

// -----------------------------------------------------------------------------
// Customer review data access (table: product_reviews — see
// supabase/product-reviews-table.sql). Server-only.
//
// Public reads go through the anon client, whose RLS policy allows only
// `status = 'approved'` rows. Admin reads/writes go through the service-role
// client, which sees every row.
// -----------------------------------------------------------------------------

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  holdReason: string | null;
  createdAt: string;
};

type Row = {
  id: string;
  product_id: string;
  author: string;
  rating: number | null;
  comment: string | null;
  status: ReviewStatus;
  hold_reason: string | null;
  created_at: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The built-in fallback catalogue uses slugs as ids ("cement"), not uuids. */
export function isProductId(value: string): boolean {
  return UUID_RE.test(value);
}

function rowToReview(r: Row): Review {
  return {
    id: r.id,
    productId: r.product_id,
    author: r.author,
    rating: Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5))),
    comment: r.comment ?? '',
    status: r.status,
    holdReason: r.hold_reason,
    createdAt: r.created_at,
  };
}

/**
 * Approved reviews for one product, newest first. Returns [] whenever reviews
 * are unavailable (Supabase not configured, static fallback product, or a
 * query error) so a product page never fails because of its reviews.
 */
export async function getApprovedReviews(productId: string): Promise<Review[]> {
  if (!isProductId(productId)) return [];
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.warn('[reviews] could not load approved reviews:', error.message);
    return [];
  }
  return (data as Row[]).map(rowToReview);
}

/** Every review across every product, pending first then newest — admin view. */
export async function getAllReviewsForAdmin(): Promise<Review[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[reviews] admin list failed:', error.message);
    return [];
  }
  const reviews = (data as Row[]).map(rowToReview);
  // Pending first so anything waiting on the owner is impossible to miss.
  const rank = (s: ReviewStatus) => (s === 'pending' ? 0 : s === 'approved' ? 1 : 2);
  return reviews.sort((a, b) => rank(a.status) - rank(b.status));
}

/** How many reviews are waiting for the owner — drives the admin badge. */
export async function countPendingReviews(): Promise<number> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from('product_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (error) return 0;
  return count ?? 0;
}
