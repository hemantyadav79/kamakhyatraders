import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { getAllReviewsForAdmin } from '@/lib/reviews';

export const runtime = 'nodejs';

// List every review (pending first) together with the product each belongs to,
// so the moderation screen can show "Ravi Kumar — on Cement" without the client
// having to stitch two lists together.
export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured. Add your Supabase keys to .env.local.' },
      { status: 503 },
    );
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Add your Supabase keys to .env.local.' },
      { status: 503 },
    );
  }

  const [reviews, productsRes] = await Promise.all([
    getAllReviewsForAdmin(),
    supabase.from('products').select('id, name, slug'),
  ]);

  if (productsRes.error) {
    console.error('[admin/reviews GET]', productsRes.error);
    return NextResponse.json({ error: 'Could not load reviews.' }, { status: 500 });
  }

  const byId = new Map(
    (productsRes.data ?? []).map((p) => [p.id as string, p as { id: string; name: string; slug: string }]),
  );

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      ...r,
      productName: byId.get(r.productId)?.name ?? 'Unknown product',
      productSlug: byId.get(r.productId)?.slug ?? '',
    })),
  });
}
