import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { siteConfig, mapEmbedUrl, mapDirectionsUrl, mapPlaceUrl } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact Us — Building Materials Shop in Danapur, Patna',
  description:
    'Contact Kamakhya Traders — Neora, near Railway Gumti, Danapur, Patna (Bihar – 801113). Call, WhatsApp or send an enquiry for cement, iron rods, gitti, balu, bricks, bamboo & plywood. Open Mon–Sun, 7 AM–6 PM. Map and directions to our shop below.',
  path: '/contact',
  keywords: ['contact Kamakhya Traders', 'building material shop Danapur contact', 'building materials shop address Danapur Patna', 'cement dealer phone number Patna', 'building materials near railway gumti Patna'],
});

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Contact', path: '/contact' },
            ]),
          ),
        }}
      />

      <section className="bg-background py-14 md:py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-12">
            <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mb-4">Contact Us</h1>
            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
              Need building materials or today&apos;s rate? Call, WhatsApp, or send us an enquiry —
              we&apos;ll get back to you quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Form */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-8 rounded border border-surface-variant shadow-sm">
              <h2 className="font-heading text-headline-md text-primary mb-6 border-b-2 border-surface-variant pb-4">
                Send an Enquiry
              </h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Get in touch */}
              <div className="bg-primary text-on-primary p-6 md:p-8 rounded relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-fixed opacity-10 rounded-bl-full pointer-events-none" />
                <h3 className="font-heading text-headline-md text-tertiary-fixed border-b border-on-primary-container/40 pb-4 mb-6">
                  Get in Touch
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-tertiary-fixed text-3xl">call</span>
                    <div>
                      <p className="font-heading text-label-bold text-on-primary-container uppercase tracking-wide mb-1">Call Us</p>
                      <a href={siteConfig.telPrimary} className="block font-heading text-headline-md hover:text-tertiary-fixed transition-colors">
                        {siteConfig.phones.primaryDisplay}
                      </a>
                      <a href={siteConfig.telSecondary} className="block font-body text-body-lg text-primary-fixed-dim hover:text-tertiary-fixed transition-colors">
                        {siteConfig.phones.secondaryDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4 border-t border-on-primary-container/30">
                    <span className="material-symbols-outlined text-tertiary-fixed text-3xl">chat</span>
                    <div>
                      <p className="font-heading text-label-bold text-on-primary-container uppercase tracking-wide mb-1">WhatsApp</p>
                      <a
                        href={siteConfig.whatsappLink('Hello Kamakhya Traders, I would like to enquire about building materials.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-body-lg hover:text-tertiary-fixed transition-colors"
                      >
                        Message us on WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4 border-t border-on-primary-container/30">
                    <span className="material-symbols-outlined text-tertiary-fixed text-3xl">person</span>
                    <div>
                      <p className="font-heading text-label-bold text-on-primary-container uppercase tracking-wide mb-1">Proprietor</p>
                      <p className="font-body text-body-lg font-semibold">Prop. {siteConfig.proprietor}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4 border-t border-on-primary-container/30">
                    <span className="material-symbols-outlined text-tertiary-fixed text-3xl">schedule</span>
                    <div>
                      <p className="font-heading text-label-bold text-on-primary-container uppercase tracking-wide mb-1">Business Hours</p>
                      <p className="font-body text-body-lg">{siteConfig.hours.days}</p>
                      <p className="font-body text-body-md text-primary-fixed-dim">{siteConfig.hours.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location + embedded map */}
              <div className="bg-surface-container-lowest rounded border border-surface-variant shadow-sm overflow-hidden group">
                <div className="p-6 pb-5">
                  <h3 className="font-heading text-label-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">location_on</span>
                    Visit Our Shop
                  </h3>
                  <p className="font-body text-body-lg text-on-surface font-semibold leading-snug">
                    {siteConfig.address.line1}
                  </p>
                  <p className="font-body text-body-md text-on-surface-variant">
                    {siteConfig.address.area}, {siteConfig.address.city}, {siteConfig.address.state} –{' '}
                    {siteConfig.address.postalCode}
                  </p>
                </div>

                {/* Google Map. The marker is labelled with the shop name via
                    Maps' q=lat,lng(Name) syntax — see lib/site.ts. */}
                <div className="relative border-y border-surface-variant overflow-hidden">
                  <iframe
                    src={mapEmbedUrl}
                    title={`Map to ${siteConfig.name}, ${siteConfig.address.full}`}
                    className="w-full h-72 border-0 grayscale-[35%] group-hover:grayscale-0 transition-[filter] duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    // Delegates geolocation to the map so "directions from your
                    // location" works. Paired with the Permissions-Policy header
                    // in next.config.js; the browser still prompts the visitor.
                    allow="geolocation"
                    allowFullScreen
                  />
                </div>

                {/* Two separate jobs: start navigation, or just look at the pin
                    on Google Maps. */}
                <a
                  href={mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-secondary text-on-secondary font-heading text-label-bold uppercase tracking-wide px-4 py-4 hover:bg-secondary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  Get Directions
                </a>
                <a
                  href={mapPlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border-t border-surface-variant text-primary font-heading text-label-bold uppercase tracking-wide px-4 py-3.5 hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Where we deliver. Real, useful detail for a customer deciding
              whether we cover their site — and the plain-language version of
              the areas listed in the LocalBusiness structured data. */}
          <div className="mt-14 pt-10 border-t-2 border-surface-variant">
            <h2 className="font-heading text-headline-md text-primary mb-3">
              Areas We Supply Building Materials To
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant max-w-3xl mb-6">
              Our shop is at Neora, near the Railway Gumti in{' '}
              <strong className="text-primary">Danapur, Patna</strong>. We supply cement, iron rods
              (sariya), stone chips (gitti), sand (balu), bricks, bamboo and plywood — by the bag or
              by the truckload — across Danapur and the surrounding parts of Patna. Not sure if we
              deliver to your site? Call us and ask.
            </p>
            <ul className="flex flex-wrap gap-2.5 mb-8">
              {siteConfig.address.serviceArea.map((area) => (
                <li
                  key={area}
                  className="bg-surface-container-high text-on-surface font-body text-body-md px-4 py-2 rounded"
                >
                  {area}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <a
                href={siteConfig.telPrimary}
                className="flex-1 bg-secondary text-on-secondary px-6 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                {siteConfig.phones.primaryDisplay}
              </a>
              <a
                href={siteConfig.whatsappLink(
                  'Hello Kamakhya Traders, do you deliver building materials to my area?',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-whatsapp text-white px-6 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-whatsapp-dark transition-colors flex items-center justify-center gap-2"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
