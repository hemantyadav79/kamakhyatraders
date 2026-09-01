import 'server-only';
import {
  products as fallbackProducts,
  getProductBySlug as getFallbackBySlug,
  type Product,
} from '@/data/products';
import { getSupabasePublic, getSupabaseAdmin } from '@/lib/supabase';

// -----------------------------------------------------------------------------
// Product data access. Reads from Supabase when configured, otherwise serves
// the built-in static catalogue. All functions are server-only.
//
// Supabase table shape (see supabase/schema.sql):
//   products(id, slug, name, name_hindi, category, summary, description,
//            uses text[], unit, price_label, image, image_alt, in_stock,
//            badge, sort_order, created_at)
// -----------------------------------------------------------------------------

type Row = {
  id: string;
  slug: string;
  name: string;
  name_hindi: string | null;
  category: string | null;
  summary: string | null;
  description: string | null;
  uses: string[] | null;
  unit: string | null;
  price_label: string | null;
  image: string | null;
  image_alt: string | null;
  images: string[] | null;
  in_stock: boolean | null;
  badge: string | null;
  sort_order: number | null;
  updated_at: string | null;
};

function rowToProduct(r: Row): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameHindi: r.name_hindi ?? '',
    category: r.category ?? 'Building Materials',
    summary: r.summary ?? '',
    description: r.description ?? '',
    uses: r.uses ?? [],
    unit: r.unit ?? '',
    priceLabel: r.price_label?.trim() || 'Negotiable',
    image: r.image || '/images/products/placeholder.svg',
    imageAlt: r.image_alt ?? r.name,
    images: Array.isArray(r.images) ? r.images.filter(Boolean) : [],
    inStock: r.in_stock ?? true,
    badge: r.badge ?? undefined,
    sortOrder: r.sort_order ?? 0,
    updatedAt: r.updated_at ?? undefined,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = getSupabasePublic();
  // Not configured → show the built-in seed catalogue.
  if (!supabase) {
    return [...fallbackProducts].sort((a, b) => b.sortOrder - a.sortOrder);
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: false });

  // Fall back to the seed ONLY when the database itself fails (connection/query
  // error). On a successful query the database is the single source of truth —
  // even if it returns an empty list — so anything you add/edit/delete in the
  // admin panel is exactly what the site shows. The seed never overrides live data.
  if (error) {
    console.warn('[products] Supabase query failed — using fallback seed:', error.message);
    return [...fallbackProducts].sort((a, b) => b.sortOrder - a.sortOrder);
  }
  return (data as Row[]).map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabasePublic();
  if (!supabase) return getFallbackBySlug(slug) ?? null;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  // Fall back to the seed only on a real DB error — not on "not found", so a
  // product you deleted stays deleted (it won't reappear from the seed).
  if (error) {
    console.warn('[products] Supabase lookup failed — using fallback seed:', error.message);
    return getFallbackBySlug(slug) ?? null;
  }
  return data ? rowToProduct(data as Row) : null;
}

export type { Product };
export { getSupabaseAdmin };
