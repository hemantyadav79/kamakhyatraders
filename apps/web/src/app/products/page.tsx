import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { siteConfig } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd, productListJsonLd } from '@/lib/seo';

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: 'Building Materials in Danapur, Patna — Cement, Sariya, Gitti, Balu & More',
  description:
    'Full range of building materials from Kamakhya Traders, Danapur, Patna: cement, iron rods (chhad), stone chips (gitti), sand (balu), bricks, bamboo & plywood. Supplied across Danapur, Neora, Khagaul, Bihta, Phulwari Sharif & Patna. Call for the best price.',
  path: '/products',
  keywords: ['building materials list Danapur Patna', 'cement price Danapur Patna', 'iron rod dealer Danapur', 'gitti supplier Danapur', 'plywood shop Patna', 'sariya rate Danapur'],
});

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Products', path: '/products' },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd(products)) }}
      />

      {/* Page header */}
      <section className="bg-primary text-on-primary py-14 md:py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <p className="font-heading text-label-bold text-tertiary-fixed uppercase tracking-wider mb-3">
            Our Catalog
          </p>
          <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg mb-4">
            Building Materials in Danapur, Patna
          </h1>
          <p className="font-body text-body-lg text-primary-fixed-dim max-w-2xl">
            Everything for your construction — supplied fresh from our shop at Neora, near Railway
            Gumti, Danapur, across Khagaul, Bihta, Phulwari Sharif &amp; the rest of Patna.
            Tap <strong className="text-tertiary-fixed">Call for Price</strong> on any item for today&apos;s rate.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-background py-14 md:py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 110}>
                <ProductCard product={p} />
              </Reveal>
            ))}

            {/* Bulk-order help card */}
            <div className="bg-primary text-on-primary rounded flex flex-col justify-center items-center text-center p-8 min-h-[360px]">
              <span className="material-symbols-outlined text-6xl text-tertiary-fixed mb-4">support_agent</span>
              <h3 className="font-heading text-headline-md mb-2">Need a Bulk Order?</h3>
              <p className="font-body text-body-md text-on-primary-container mb-6">
                Building a home or a big project? Call us directly for wholesale rates and delivery.
              </p>
              <a
                href={siteConfig.telPrimary}
                className="w-full bg-secondary text-on-secondary font-heading text-label-bold uppercase tracking-wide py-3 rounded hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                {siteConfig.phones.primaryDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
