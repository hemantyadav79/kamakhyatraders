import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { productSchema } from '@/lib/validation';

export const runtime = 'nodejs';

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

// List all products (admin view).
export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) return notConfigured();

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfigured();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: false });

  if (error) {
    console.error('[admin/products GET]', error);
    return NextResponse.json({ error: 'Could not load products.' }, { status: 500 });
  }
  return NextResponse.json({ products: data ?? [] });
}

// Create a product.
export async function POST(req: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) return notConfigured();

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfigured();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid product data.' },
      { status: 422 },
    );
  }

  const { data, error } = await supabase
    .from('products')
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A product with this slug already exists.' },
        { status: 409 },
      );
    }
    console.error('[admin/products POST]', error);
    return NextResponse.json({ error: 'Could not save the product.' }, { status: 500 });
  }
  revalidateStorefront();
  return NextResponse.json({ product: data }, { status: 201 });
}
