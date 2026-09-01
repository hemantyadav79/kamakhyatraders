import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/products';
import { getHeroSettings } from '@/lib/settings';
import { ProductCard } from '@/components/ProductCard';
import { Hero } from '@/components/Hero';
import { Reveal } from '@/components/Reveal';
import { siteConfig } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

// Rebuild from the database at most every 5 min (admin edits also trigger an
// instant refresh via revalidatePath). Keeps the site fast but fresh.
export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: 'Kamakhya Traders — Building Materials in Danapur, Patna',
  description:
    'Building materials supplier in Danapur, Patna (Bihar – 801113) — at Neora, near Railway Gumti. Quality cement, iron rods (chhad), stone chips (gitti), sand (balu), bricks, bamboo & plywood at fair prices. Serving Danapur, Neora, Khagaul, Bihta, Phulwari Sharif & all of Patna. Call for today’s rate.',
  path: '/',
  keywords: ['building materials in Patna Danapur', 'building material shop Danapur', 'cement shop Danapur Patna', 'sariya rate Danapur', 'gitti balu Danapur Patna', 'building material supplier near me Patna'],
});

const trustPoints = [
  { icon: 'diamond', title: 'Behtareen Quality', desc: 'Only well-sourced, reliable materials — from branded cement to strong iron rods.' },
  { icon: 'account_balance_wallet', title: 'Uchit Mulya', desc: 'Fair, honest prices for both retail buyers and bulk contractors.' },
  { icon: 'handshake', title: 'Aapki Santushti', desc: 'Your satisfaction is our identity — trusted by builders across Patna & Danapur.' },
];

export default async function HomePage() {
  const [products, hero] = await Promise.all([getAllProducts(), getHeroSettings()]);
  const featured = products.slice(0, 6);

  return (
    <>
      {/* Hero (carousel + overlay controlled from the admin panel) */}
      <Hero settings={hero} />

      {/* Trust strip */}
      <section className="bg-surface-bright py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {trustPoints.map((t, i) => (
              <Reveal key={t.title} delay={i * 120}>
                <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded h-full card-lift hover:border-secondary group">
                  <div className="w-14 h-14 bg-primary text-on-primary flex items-center justify-center rounded mb-5 transition-colors group-hover:bg-secondary">
                    <span className="material-symbols-outlined text-3xl">{t.icon}</span>
                  </div>
                  <h3 className="font-heading text-headline-md text-primary mb-3">{t.title}</h3>
                  <p className="font-body text-body-md text-on-surface-variant">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <Reveal className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b-2 border-surface-variant pb-6 mb-10">
            <div>
              <h2 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Our Materials</h2>
              <p className="font-body text-body-md text-on-surface-variant">
                Everything your site needs, under one roof.
              </p>
            </div>
            <Link
              href="/products"
              className="text-secondary font-heading text-label-bold uppercase tracking-wide hover:text-secondary-container transition-colors inline-flex items-center gap-1 group"
            >
              View Full Catalog
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 120}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us + CTA */}
      <section className="relative bg-primary text-on-primary py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
          <div>
            <h2 className="font-heading text-headline-lg-mobile md:text-headline-lg mb-6">Why Kamakhya Traders?</h2>
            <ul className="space-y-5">
              {[
                { icon: 'local_shipping', title: 'Supply for Every Need', desc: 'From a few bags to full truckloads for big sites.' },
                { icon: 'verified_user', title: 'Reliable Quality', desc: 'Materials you can build on, load after load.' },
                { icon: 'currency_rupee', title: 'Fair, Negotiable Rates', desc: 'Call us for the best current price on any material.' },
              ].map((f) => (
                <li key={f.title} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-tertiary-fixed mt-1">{f.icon}</span>
                  <div>
                    <h4 className="font-heading text-label-bold text-tertiary-fixed mb-1">{f.title}</h4>
                    <p className="font-body text-body-md text-on-primary-container">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-primary-container border border-surface-tint/40 rounded p-8 md:p-10">
            <h3 className="font-heading text-headline-md text-tertiary-fixed mb-3">Get Today&apos;s Rate</h3>
            <p className="font-body text-body-md text-on-primary-container mb-6">
              Prices for cement, sariya, gitti and balu change often. Call or WhatsApp us for the latest rate and availability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={siteConfig.telPrimary} className="flex-1 bg-secondary text-on-secondary px-6 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px]">call</span>
                Call Now
              </a>
              <a href={siteConfig.whatsappLink('Hello Kamakhya Traders, please share the current rate.')} target="_blank" rel="noopener noreferrer" className="flex-1 bg-whatsapp text-white px-6 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-whatsapp-dark transition-colors flex items-center justify-center gap-2">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
