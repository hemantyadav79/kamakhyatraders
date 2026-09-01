import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { adminReviewUpdateSchema } from '@/lib/validation';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

const uuidSchema = z.string().uuid();

function notConfigured() {
  return NextResponse.json(
    { error: 'Database not configured. Add your Supabase keys to .env.local.' },
    { status: 503 },
  );
}

/** Shared entry checks: valid session, DB configured, well-formed id. */
async function prepare(params: Params['params']) {
  if (!(await getSession())) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!isSupabaseConfigured()) return { error: notConfigured() };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: notConfigured() };

  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return { error: NextResponse.json({ error: 'Review not found.' }, { status: 404 }) };
  }
  return { supabase, id };
}

/**
 * Refresh the product page a review belongs to, so an approval or a deletion
 * shows on the storefront straight away instead of after the 5-minute revalidate.
 */
async function revalidateProduct(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  productId: string,
) {
  const { data } = await supabase.from('products').select('slug').eq('id', productId).maybeSingle();
  if (data?.slug) revalidatePath(`/products/${data.slug}`);
}

// Edit a review, and/or approve / reject it.
export async function PUT(req: Request, { params }: Params) {
  const ready = await prepare(params);
  if (ready.error) return ready.error;
  const { supabase, id } = ready;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = adminReviewUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid review data.' },
      { status: 422 },
    );
  }

  const patch: Record<string, unknown> = { ...parsed.data };
  // Once the owner has ruled on a review, the filter's note is history — keep
  // the row's reason in step with its status rather than leaving a stale
  // "contains a link" note on a review that has since been approved by hand.
  if (parsed.data.status && parsed.data.status !== 'pending') {
    patch.hold_reason = null;
  }

  const { data, error } = await supabase
    .from('product_reviews')
    .update(patch)
    .eq('id', id)
    .select('id, product_id')
    .maybeSingle();

  if (error) {
    console.error('[admin/reviews PUT]', error);
    return NextResponse.json({ error: 'Could not update the review.' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
  }

  await revalidateProduct(supabase, data.product_id as string);
  return NextResponse.json({ ok: true });
}

// Delete a review permanently.
export async function DELETE(_req: Request, { params }: Params) {
  const ready = await prepare(params);
  if (ready.error) return ready.error;
  const { supabase, id } = ready;

  const { data, error } = await supabase
    .from('product_reviews')
    .delete()
    .eq('id', id)
    .select('product_id');

  if (error) {
    console.error('[admin/reviews DELETE]', error);
    return NextResponse.json({ error: 'Could not delete the review.' }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
  }

  await revalidateProduct(supabase, data[0].product_id as string);
  return NextResponse.json({ ok: true });
}
