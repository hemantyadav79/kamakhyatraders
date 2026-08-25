import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';

// -----------------------------------------------------------------------------
// SEO helpers. Every page builds its own unique title/description/keywords via
// `pageMetadata(...)`, and structured data (JSON-LD) tells Google this is a
// local building-materials business in Patna / Danapur.
// -----------------------------------------------------------------------------

type PageMetaArgs = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
};

const baseKeywords = [
  // Brand
  'Kamakhya Traders',
  'Kamakhya Traders Neora',
  'Kamakhya Traders Patna',
  // Location-focused (Neora / near railway gumti / Danapur / Bihta / Patna)
  'building materials Neora Patna',
  'building materials near railway gumti Patna',
  'cement dealer Neora',
  'cement shop Danapur Patna',
  'sariya dealer Bihta Patna',
  'iron rods supplier Danapur',
  'gitti stone chips Neora Patna',
  'balu sand supplier Danapur Patna',
  'bricks supplier Bihta',
  'plywood dealer Patna',
  'building material shop near me Patna',
  'construction material supplier Patna 801113',
  'building materials Bihta',
  'building materials Khagaul',
  // Hindi
  'निर्माण सामग्री पटना',
  'सीमेंट सरिया गिट्टी बालू पटना',
  'कामाख्या ट्रेडर्स नेओरा',
];

export function pageMetadata({
  title,
  description,
  path = '/',
  keywords = [],
}: PageMetaArgs): Metadata {
  const url = `${siteConfig.url}${path}`;
  // The root layout sets a title template ("%s | Kamakhya Traders"); the home
  // page passes its own full title and opts out of the template.
  const isHome = path === '/';

  return {
    title: isHome ? { absolute: title } : title,
    description,
    keywords: [...keywords, ...baseKeywords],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: 'en_IN',
      // og:image is provided site-wide by src/app/opengraph-image.tsx.
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/** LocalBusiness structured data — improves local "near me" search results. */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    '@id': `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.shortDescription,
    url: siteConfig.url,
    telephone: `+${siteConfig.phones.primary}`,
    email: siteConfig.email,
    image: `${siteConfig.url}/opengraph-image`,
    priceRange: '₹₹',
    founder: { '@type': 'Person', name: siteConfig.proprietor },
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.area}`,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    // Exact map pin — a strong signal for local "near me" / Google Maps ranking.
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.address.lat,
      longitude: siteConfig.address.lng,
    },
    hasMap: siteConfig.address.mapLink,
    areaServed: siteConfig.address.serviceArea.map((name) => ({
      '@type': 'City',
      name,
    })),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '18:00',
    },
    makesOffer: [
      'Cement', 'Iron Rods', 'Stone Chips (Gitti)', 'Sand (Balu)',
      'Bricks', 'Bamboo', 'Plywood',
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Product', name } })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
