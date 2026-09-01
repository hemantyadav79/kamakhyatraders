import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductReviews } from '@/components/ProductReviews';
import { ProductCard } from '@/components/ProductCard';
import { getAllProducts, getProductBySlug } from '@/lib/products';
import { getApprovedReviews, isProductId } from '@/lib/reviews';
import { siteConfig } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 300;

// Pre-render the built-in products at build time (DB products render on demand).
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return pageMetadata({ title: 'Product not found', description: '', path: `/products/${slug}` });

  return pageMetadata({
    title: `${product.name} Dealer in Danapur & Patna — Price on Call`,
    description: `${product.summary} Buy ${product.name} (${product.nameHindi}) from Kamakhya Traders — building materials supplier in Danapur, Patna, serving Neora, Khagaul, Bihta & Phulwari Sharif. Call ${siteConfig.phones.primaryDisplay} for today's rate.`,
    path: `/products/${product.slug}`,
    keywords: [
      `${product.name} Patna`,
      `${product.name} Danapur`,
      `${product.name} price in Patna`,
      `${product.name} price Danapur`,
      `${product.name} dealer in Danapur`,
      `${product.name} supplier Patna`,
      `${product.name} shop near me`,
    ],
  });
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Reviews live in their own table (visitors write them, the owner moderates).
  // `canReview` is false for the built-in fallback catalogue, whose ids are
  // slugs rather than database uuids — there would be no row to attach to.
  const canReview = isProductId(product.id);
  const reviews = await getApprovedReviews(product.id);

  // Sibling products, for visitors browsing around and for search engines:
  // without these, each product page was a dead end that only linked back up
  // to /products, which is part of why the deeper pages were slow to be indexed.
  const allProducts = await getAllProducts();
  const related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  // Google requires a Product to include at least one of `offers`, `review`,
  // or `aggregateRating` to be considered valid — this business has no fixed
  // price ("Call for Price"), so inventing a price would be misleading.
  // Instead: only emit Product JSON-LD once the product has real customer
  // reviews, computed from — and matching — the approved reviews actually
  // rendered on the page below. No reviews yet → no Product markup at all,
  // which stays fully valid (just without the enhancement) rather than
  // being "invalid".
  const hasReviews = reviews.length > 0;
  const averageRating = hasReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const productJsonLd = hasReviews
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        category: product.category,
        image: `${siteConfig.url}${product.image}`,
        brand: { '@type': 'Brand', name: siteConfig.name },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: Number(averageRating.toFixed(1)),
          reviewCount: reviews.length,
        },
        review: reviews.map((r) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.author },
          reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
          reviewBody: r.comment || undefined,
          datePublished: r.createdAt ? r.createdAt.slice(0, 10) : undefined,
        })),
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Products', path: '/products' },
              { name: product.name, path: `/products/${product.slug}` },
            ]),
          ),
        }}
      />

      <section className="bg-background py-10 md:py-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Breadcrumb */}
          <nav className="font-body text-label-sm text-on-surface-variant mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-secondary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-secondary">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter lg:gap-12">
            {/* Image gallery / carousel */}
            <ProductGallery
              images={[product.image, ...(product.images ?? [])].filter(Boolean)}
              alt={product.imageAlt}
              badge={product.badge}
            />

            {/* Details */}
            <div className="flex flex-col">
              <p className="font-heading text-label-bold text-secondary uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <div className="flex items-baseline gap-3 mb-4">
                <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary">
                  {product.name}
                </h1>
                <span className="text-outline font-body text-headline-md" lang="hi">{product.nameHindi}</span>
              </div>

              <p className="font-body text-body-lg text-on-surface-variant mb-6">{product.description}</p>

              {/* Price + stock */}
              <div className="flex items-center gap-6 mb-6 p-5 bg-surface-container-low rounded border border-surface-variant">
                <div>
                  <p className="font-body text-label-sm text-outline uppercase tracking-wide">Price</p>
                  <p className="font-heading text-headline-md text-primary">{product.priceLabel}</p>
                </div>
                <div className="border-l border-surface-variant pl-6">
                  <p className="font-body text-label-sm text-outline uppercase tracking-wide">Sold by</p>
                  <p className="font-heading text-primary">{product.unit}</p>
                </div>
              </div>

              {/* Uses */}
              {product.uses.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-heading text-label-bold text-primary uppercase tracking-wider mb-3">Common Uses</h2>
                  <ul className="flex flex-wrap gap-2">
                    {product.uses.map((u) => (
                      <li key={u} className="bg-surface-container-high text-on-surface font-body text-body-md px-3 py-1 rounded">
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <a
                  href={siteConfig.telPrimary}
                  className="flex-1 bg-secondary text-on-secondary px-6 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  Call for Price
                </a>
                <a
                  href={siteConfig.whatsappLink(`Hello Kamakhya Traders, I want to enquire about ${product.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-whatsapp text-white px-6 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-whatsapp-dark transition-colors flex items-center justify-center gap-2"
                >
                  WhatsApp Enquiry
                </a>
              </div>
            </div>
          </div>

          <ProductReviews
            reviews={reviews}
            productId={product.id}
            productName={product.name}
            canReview={canReview}
          />

          {/* Related materials — keeps visitors browsing and gives every
              product page inbound links from its siblings. */}
          {related.length > 0 && (
            <section className="mt-16 pt-10 border-t-2 border-surface-variant">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-heading text-headline-md text-primary mb-1">
                    Other Building Materials We Supply
                  </h2>
                  <p className="font-body text-body-md text-on-surface-variant">
                    Available at our shop in Danapur, Patna — and delivered nearby.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="text-secondary font-heading text-label-bold uppercase tracking-wide hover:text-secondary-container transition-colors inline-flex items-center gap-1 group"
                >
                  View All Materials
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    east
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
