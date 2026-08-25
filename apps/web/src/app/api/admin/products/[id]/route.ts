import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { productSchema } from '@/lib/validation';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

const uuidSchema = z.string().uuid();

// Refresh the public storefront so admin changes appear immediately.
function revalidateStorefront() {
  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath('/products/[slug]', 'page');
  revalidatePath('/sitemap.xml');
}

function notConfigured() {
  return NextResponse.json(
    { error: 'Database not configured. Add your Supabase keys to .env.local.' },
    { status: 503 },
  );
}

/**
 * Shared entry checks: valid session, DB configured, well-formed id.
 * Returns either an error response or the ready-to-use client + id.
 */
async function prepare(params: Params['params']) {
  if (!(await getSession())) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!isSupabaseConfigured()) return { error: notConfigured() };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: notConfigured() };

  const { id } = await params;
  // Without this, a malformed id reaches Postgres and surfaces a raw DB error.
  if (!uuidSchema.safeParse(id).success) {
    return { error: NextResponse.json({ error: 'Product not found.' }, { status: 404 }) };
  }

  return { supabase, id };
}

// Update a product.
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

  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid product data.' },
      { status: 422 },
    );
  }

  // An empty payload would produce a meaningless UPDATE with no SET clause.
  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    // Duplicate slug is the one case worth naming for the user.
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Another product already uses this slug.' },
        { status: 409 },
      );
    }
    console.error('[admin/products PUT]', error);
    return NextResponse.json({ error: 'Could not update the product.' }, { status: 500 });
  }
  // maybeSingle() returns null when no row matched the id.
  if (!data) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  revalidateStorefront();
  return NextResponse.json({ product: data });
}

// Delete a product.
export async function DELETE(_req: Request, { params }: Params) {
  const ready = await prepare(params);
  if (ready.error) return ready.error;
  const { supabase, id } = ready;

  // `select()` lets us tell "deleted" apart from "never existed".
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    console.error('[admin/products DELETE]', error);
    return NextResponse.json({ error: 'Could not delete the product.' }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  revalidateStorefront();
  return NextResponse.json({ ok: true });
}
