// -----------------------------------------------------------------------------
// Default product catalogue for Kamakhya Traders.
//
// This is the built-in fallback list: the site renders these even before
// Supabase is connected, and the same rows are used to seed the database
// (see supabase/seed.sql). Once the admin panel + Supabase are live, products
// are read from the DB and this file is only the fallback.
//
// Pricing model: prices are NOT shown as numbers. `priceLabel` defaults to
// "Negotiable"; the owner can add real prices later from the admin panel.
// The call-to-action on every product is "Call for Price".
// -----------------------------------------------------------------------------

export type Product = {
  id: string;
  slug: string;
  name: string;
  nameHindi: string;
  category: string;
  /** Short one-liner shown on cards. */
  summary: string;
  /** Longer description on the detail page. */
  description: string;
  /** Common uses / where it's used. */
  uses: string[];
  /** Unit customers usually buy in (Bag, Tonne, Piece...). */
  unit: string;
  /** Display label for price. "Negotiable" by default; can be a real rate later. */
  priceLabel: string;
  /** Main/primary image path. Replaced by Cloudinary image via admin. */
  image: string;
  imageAlt: string;
  /** Additional gallery images for the detail-page carousel. */
  images?: string[];
  inStock: boolean;
  badge?: string;
  /** Higher = shown earlier. */
  sortOrder: number;
  /** When the row last changed in the database. Drives sitemap <lastmod>. */
  updatedAt?: string;
};

export const products: Product[] = [
  {
    id: 'cement',
    slug: 'cement',
    name: 'Cement',
    nameHindi: 'सीमेंट',
    category: 'Cement',
    summary: 'Branded PPC & OPC cement (UltraTech and more) for strong, lasting construction.',
    description:
      'We supply top-brand cement including UltraTech PPC (Portland Pozzolana Cement) and OPC grades. Ideal for foundations, RCC work, plastering, and brickwork. Fresh stock, correct weight, and fair rates for both retail buyers and bulk contractors.',
    uses: ['Foundations & RCC', 'Plastering', 'Brickwork & masonry', 'Flooring'],
    unit: 'Bag (50 kg)',
    priceLabel: 'Negotiable',
    image: '/images/products/cement.svg',
    imageAlt: 'Stacked bags of branded cement',
    inStock: true,
    badge: 'Best Seller',
    sortOrder: 100,
  },
  {
    id: 'iron-rods',
    slug: 'iron-rods',
    name: 'Iron Rods',
    nameHindi: 'छड़',
    category: 'Iron & Steel',
    summary: 'High-strength iron rods (sariya) for strong, safe structural work.',
    description:
      'Quality iron rods / bars (chhad) in commonly used sizes for columns, beams, slabs and foundations. Strong, well-finished, and reliably sourced so your structure stays safe for decades. Available for small jobs and large site orders.',
    uses: ['Columns & pillars', 'Beams & slabs', 'Foundations', 'Reinforcement work'],
    unit: 'Per Kg / Tonne',
    priceLabel: 'Negotiable',
    image: '/images/products/iron-rods.svg',
    imageAlt: 'Bundle of iron reinforcement rods',
    inStock: true,
    badge: 'In Stock',
    sortOrder: 95,
  },
  {
    id: 'stone-chips',
    slug: 'stone-chips',
    name: 'Stone Chips (Gitti)',
    nameHindi: 'गिट्टी',
    category: 'Aggregates',
    summary: 'Clean, graded crushed stone chips for high-grade concrete.',
    description:
      'Uniformly graded crushed stone aggregates (gitti) in common sizes such as 10 mm and 20 mm. Clean and strong — essential for durable concrete in slabs, columns and road work. Supplied by the required quantity for homes and large projects alike.',
    uses: ['Concrete mixing', 'RCC slabs & columns', 'Road & flooring base'],
    unit: 'Per CFT / Tractor',
    priceLabel: 'Negotiable',
    image: '/images/products/stone-chips.svg',
    imageAlt: 'Pile of crushed grey stone chips',
    inStock: true,
    badge: 'In Stock',
    sortOrder: 90,
  },
  {
    id: 'sand',
    slug: 'sand',
    name: 'Sand (Balu)',
    nameHindi: 'बालू',
    category: 'Aggregates',
    summary: 'Clean river sand, low in silt — perfect for plaster and concrete.',
    description:
      'Good quality river sand (balu), screened to keep it low in silt and impurities. Suitable for plastering, mortar and concrete work. We supply both fine sand for finishing and coarse sand for masonry.',
    uses: ['Plastering & finishing', 'Mortar for brickwork', 'Concrete mixing'],
    unit: 'Per CFT / Tractor',
    priceLabel: 'Negotiable',
    image: '/images/products/sand.svg',
    imageAlt: 'Heap of fine river sand',
    inStock: true,
    badge: 'In Stock',
    sortOrder: 85,
  },
  {
    id: 'bricks',
    slug: 'bricks',
    name: 'Bricks (Eet)',
    nameHindi: 'ईंट',
    category: 'Bricks & Blocks',
    summary: 'Strong, well-fired red clay bricks for durable walls.',
    description:
      'Well-fired red clay bricks (eet) with good shape and strength for long-lasting walls and masonry. Available in bulk for construction projects, with consistent quality load after load.',
    uses: ['Wall construction', 'Boundary walls', 'Masonry & partitions'],
    unit: 'Per 1000 pcs',
    priceLabel: 'Negotiable',
    image: '/images/products/bricks.svg',
    imageAlt: 'Stack of red clay bricks',
    inStock: true,
    badge: 'Bulk Available',
    sortOrder: 80,
  },
  {
    id: 'bamboo',
    slug: 'bamboo',
    name: 'Bamboo (Baans)',
    nameHindi: 'बाँस',
    category: 'Construction Support',
    summary: 'Sturdy bamboo for scaffolding, shuttering support and site work.',
    description:
      'Strong, straight bamboo (baans) used for scaffolding, centering/shuttering support and general site work. Available in useful lengths and thicknesses for construction needs.',
    uses: ['Scaffolding', 'Shuttering / centering support', 'Temporary structures'],
    unit: 'Per Piece',
    priceLabel: 'Negotiable',
    image: '/images/products/bamboo.svg',
    imageAlt: 'Bundle of bamboo poles',
    inStock: true,
    sortOrder: 75,
  },
  {
    id: 'plywood',
    slug: 'plywood',
    name: 'Plywood',
    nameHindi: 'पलाई',
    category: 'Plywood & Boards',
    summary: 'All types of plywood available for construction and furniture.',
    description:
      'All types of plywood (palai) available — for shuttering/centering work as well as furniture and interior use. Come in and tell us the grade and thickness you need; we help you pick the right board for the job.',
    uses: ['Shuttering / centering', 'Furniture & interiors', 'Doors & panels'],
    unit: 'Per Sheet',
    priceLabel: 'Negotiable',
    image: '/images/products/plywood.svg',
    imageAlt: 'Stacked sheets of plywood',
    inStock: true,
    badge: 'All Types',
    sortOrder: 70,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
