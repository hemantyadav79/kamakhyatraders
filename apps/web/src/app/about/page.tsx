import type { Metadata } from 'next';
import Image from 'next/image';
import { siteConfig } from '@/lib/site';
import { getAboutSettings } from '@/lib/settings';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: 'About Us — Trusted Building Materials Supplier in Danapur, Patna',
  description:
    'Kamakhya Traders, led by Gajendra Kumar, is a trusted building materials supplier in Danapur, Patna (Bihar) — cement, iron rods, gitti, balu, bricks, bamboo and plywood. Based at Neora, near Railway Gumti, serving Danapur, Khagaul, Bihta, Phulwari Sharif & all of Patna at fair prices.',
  path: '/about',
  keywords: ['about Kamakhya Traders', 'building material supplier Danapur', 'construction material shop Danapur Patna', 'trusted building materials Patna'],
});

const values = [
  { icon: 'diamond', title: 'Behtareen Quality', desc: 'We stock well-sourced, dependable materials — from branded cement to strong iron rods — so every project is built to last.' },
  { icon: 'account_balance_wallet', title: 'Uchit Mulya', desc: 'Honest, fair pricing for everyone — whether you need a few bags for home repair or truckloads for a large site.' },
  { icon: 'handshake', title: 'Aapki Santushti', desc: 'Your satisfaction is our identity. We have earned the trust of contractors, builders and homeowners across the area.' },
];

export default async function AboutPage() {
  const about = await getAboutSettings();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'About Us', path: '/about' },
            ]),
          ),
        }}
      />

      {/* Hero */}
      <section className="bg-background py-14 md:py-24 border-b-2 border-surface-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-surface-container-highest px-3 py-1 rounded">
              <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
              <span className="font-heading text-label-bold text-primary uppercase tracking-wide">Quality You Can Build On</span>
            </div>
            <h1 className="font-heading text-headline-lg-mobile md:text-display-lg text-primary">
              Building Trust,
              <br />
              <span className="text-secondary">One Delivery at a Time.</span>
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
              At Kamakhya Traders, under the leadership of{' '}
              <strong className="text-primary">Prop. {siteConfig.proprietor}</strong>, we supply the
              materials that hold up homes, shops and buildings — from our shop at{' '}
              <strong className="text-primary">Neora, near Railway Gumti, Danapur, Patna</strong>, across
              Khagaul, Bihta, Phulwari Sharif and the rest of Patna. From cement and iron rods to gitti,
              balu, bricks, bamboo and plywood — we are your single, reliable source for construction
              supplies.
            </p>
            <div className="flex flex-wrap gap-6 pt-2">
              <a href={siteConfig.telPrimary} className="flex items-center gap-2 font-heading text-label-bold text-primary hover:text-secondary transition-colors">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">call</span>
                {siteConfig.phones.primaryDisplay}
              </a>
              <a href={siteConfig.telSecondary} className="flex items-center gap-2 font-heading text-label-bold text-primary hover:text-secondary transition-colors">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">call</span>
                {siteConfig.phones.secondaryDisplay}
              </a>
            </div>
          </div>

          <div className="md:col-span-5">
            {about.image ? (
              // Admin-uploaded photo
              <div className="relative w-full aspect-square rounded overflow-hidden accent-shadow-gold">
                <Image
                  src={about.image}
                  alt={about.imageAlt || `${siteConfig.name}, ${siteConfig.address.city}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-heading text-headline-md text-on-primary">Kamakhya Traders</p>
                  <p className="font-body text-body-md text-primary-fixed-dim mt-1">{siteConfig.address.full}</p>
                </div>
              </div>
            ) : (
              // Fallback: built-in design (no photo uploaded)
              <div className="relative w-full aspect-square bg-primary rounded overflow-hidden accent-shadow-gold flex flex-col items-center justify-center text-center p-8">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '18px 18px' }}
                  aria-hidden="true"
                />
                <span className="material-symbols-outlined text-tertiary-fixed text-7xl mb-4 relative">store</span>
                <p className="font-heading text-headline-md text-on-primary relative">Kamakhya Traders</p>
                <p className="font-body text-body-md text-primary-fixed-dim mt-2 relative">{siteConfig.address.full}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface py-14 md:py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary">Our Core Philosophy</h2>
            <p className="font-body text-body-lg text-on-surface-variant max-w-3xl mx-auto">
              Three simple promises that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {values.map((v) => (
              <div key={v.title} className="bg-surface-container-lowest border border-outline-variant p-8 rounded transition-all hover:border-primary hover:-translate-y-1 group">
                <div className="w-16 h-16 bg-primary text-on-primary flex items-center justify-center rounded mb-6 group-hover:bg-secondary transition-colors">
                  <span className="material-symbols-outlined text-3xl">{v.icon}</span>
                </div>
                <h3 className="font-heading text-headline-md text-primary mb-4">{v.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="relative bg-primary text-on-primary py-14 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} aria-hidden="true" />
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-heading text-headline-lg-mobile md:text-headline-lg mb-4">Building Materials Across Danapur &amp; Patna</h2>
          <p className="font-body text-body-lg text-on-primary-container max-w-2xl mx-auto mb-8">
            Reliable supply of construction materials from our shop at Neora, near Railway Gumti,
            Danapur — to sites right across Patna.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {siteConfig.address.serviceArea.map((area) => (
              <span key={area} className="bg-primary-container border border-surface-tint/40 text-tertiary-fixed font-heading text-label-bold uppercase tracking-wide px-4 py-2 rounded">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
