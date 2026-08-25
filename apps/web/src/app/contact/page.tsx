import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { siteConfig } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact Us — Building Materials at Neora, Patna',
  description:
    'Contact Kamakhya Traders, Neora, near Railway Gumti, Patna (Bihar – 801113). Call, WhatsApp or send an enquiry for cement, iron rods, gitti, balu, bricks, bamboo & plywood. Open Mon–Sun, 7 AM–6 PM. Get directions on the map.',
  path: '/contact',
  keywords: ['contact Kamakhya Traders', 'building material shop Neora contact', 'cement dealer phone number Patna', 'building materials near railway gumti Patna'],
});

const directionsUrl = siteConfig.address.mapLink;

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
                    {siteConfig.address.city}, {siteConfig.address.state} – {siteConfig.address.postalCode}
                  </p>
                </div>

                {/* Google Map */}
                <div className="relative border-y border-surface-variant overflow-hidden">
                  <iframe
                    src={siteConfig.address.mapEmbed}
                    title={`Map to ${siteConfig.name}, ${siteConfig.address.full}`}
                    className="w-full h-72 border-0 grayscale-[35%] group-hover:grayscale-0 transition-[filter] duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-secondary text-on-secondary font-heading text-label-bold uppercase tracking-wide px-4 py-4 hover:bg-secondary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
