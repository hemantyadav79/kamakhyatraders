import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { publicReviewSchema } from '@/lib/validation';
import { screenReview } from '@/lib/review-filter';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// -----------------------------------------------------------------------------
// Visitor-submitted product reviews.
//
// Writes use the service-role client rather than letting the browser talk to
// Supabase directly, so the rate limit, honeypot and abuse filter below cannot
// be bypassed (there is no public insert policy on the table either).
// -----------------------------------------------------------------------------

export async function POST(req: Request) {
  // Two separate limits. The wide one caps raw requests so the endpoint can't
  // be hammered; the narrow one caps reviews actually saved and is only spent
  // further down, once a submission is known to be good. Charging a customer's
  // quota for a typo would lock them out after three corrections.
  const ip = getClientIp(req.headers);
  const attempts = rateLimit(`review-attempt:${ip}`, 20, 60 * 60 * 1000);
  if (!attempts.success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(attempts.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = publicReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Please check your review.' },
      { status: 422 },
    );
  }
  const { productId, author, rating, comment, website } = parsed.data;

  // Honeypot: pretend it worked, but save nothing.
  if (website) {
    return NextResponse.json({ ok: true, status: 'approved' }, { status: 200 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Reviews are not available right now. Please call or WhatsApp us.' },
      { status: 503 },
    );
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Reviews are not available right now. Please call or WhatsApp us.' },
      { status: 503 },
    );
  }

  // The product must exist — this also stops reviews being attached to a random
  // uuid, and gives us the slug for the cache refresh below.
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, slug')
    .eq('id', productId)
    .maybeSingle();

  if (productError) {
    console.error('[reviews POST] product lookup failed:', productError);
    return NextResponse.json({ error: 'Could not save your review.' }, { status: 500 });
  }
  if (!product) {
    return NextResponse.json({ error: 'Unknown product.' }, { status: 404 });
  }

  // The submission is good, so now spend the real quota: at most 3 saved
  // reviews per hour from one visitor.
  const posts = rateLimit(`review-post:${ip}`, 3, 60 * 60 * 1000);
  if (!posts.success) {
    return NextResponse.json(
      { error: 'You have already posted a few reviews. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(posts.retryAfterSeconds) } },
    );
  }

  // Clean reviews go live immediately; anything that looks like abuse or spam
  // waits for the owner, so it is never shown publicly in the meantime.
  const verdict = screenReview(author, comment);
  const status = verdict.hold ? 'pending' : 'approved';

  const { error } = await supabase.from('product_reviews').insert({
    product_id: productId,
    author,
    rating,
    comment,
    status,
    hold_reason: verdict.hold ? verdict.reason : null,
  });

  if (error) {
    console.error('[reviews POST] insert failed:', error);
    return NextResponse.json({ error: 'Could not save your review.' }, { status: 500 });
  }

  // Only an approved review changes what the page renders.
  if (status === 'approved') {
    revalidatePath(`/products/${product.slug}`);
  }

  return NextResponse.json({ ok: true, status }, { status: 201 });
}
