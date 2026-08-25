import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/ProductGallery';
import { getAllProducts, getProductBySlug } from '@/lib/products';
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
    title: `${product.name} in Patna & Danapur`,
    description: `${product.summary} Buy ${product.name} (${product.nameHindi}) from Kamakhya Traders, Danapur, Patna. Call ${siteConfig.phones.primaryDisplay} for the best price.`,
    path: `/products/${product.slug}`,
    keywords: [`${product.name} Patna`, `${product.name} price Danapur`, `${product.name} dealer near me`],
  });
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // NOTE: no `offers` block. Google's Product structured data requires a
  // real numeric `price` whenever `offers` is present — this business runs
  // on a "Call for Price" model with no fixed price, so including `offers`
  // without one is invalid (and inventing a fake price would be misleading
  // structured data, which Google explicitly disallows). The rest of the
  // Product fields below don't require a price and remain fully valid.
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    image: `${siteConfig.url}${product.image}`,
    brand: { '@type': 'Brand', name: siteConfig.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
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
        </div>
      </section>
    </>
  );
}
