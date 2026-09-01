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
  'Kamakhya Traders Danapur',
  'Kamakhya Traders Patna',
  // Danapur — the locality most customers actually type. Covers the plain
  // "building materials in Danapur" phrasing as well as the
  // "... Patna, Danapur" combination.
  'building materials Danapur',
  'building materials in Danapur',
  'building materials Patna Danapur',
  'building materials in Patna Danapur',
  'building material shop Danapur',
  'building material supplier Danapur',
  'building material dealer Danapur Patna',
  'construction material Danapur',
  'construction material supplier Danapur Patna',
  'hardware and building materials Danapur',
  // Patna, city-wide
  'building materials Patna',
  'building materials in Patna',
  'building material shop Patna',
  'building material supplier Patna',
  'construction material supplier Patna',
  'building material shop near me Patna',
  'building materials near me Danapur',
  // Neora / near railway gumti / neighbouring areas
  'building materials Neora Patna',
  'building materials near railway gumti Patna',
  'building materials Khagaul',
  'building materials Bihta',
  'building materials Phulwari Sharif',
  'construction material supplier Patna 801113',
  // Product + locality
  'cement dealer Danapur',
  'cement shop Danapur Patna',
  'cement dealer Neora',
  'sariya dealer Danapur Patna',
  'iron rods supplier Danapur',
  'gitti stone chips Danapur Patna',
  'balu sand supplier Danapur Patna',
  'bricks supplier Danapur',
  'plywood dealer Danapur Patna',
  'bamboo supplier Patna',
  // Hindi
  'निर्माण सामग्री दानापुर',
  'निर्माण सामग्री पटना',
  'बिल्डिंग मटेरियल दानापुर पटना',
  'सीमेंट सरिया गिट्टी बालू पटना',
  'कामाख्या ट्रेडर्स दानापुर',
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
    // How customers refer to the shop in search — Danapur far more often
    // than Neora.
    alternateName: [
      `${siteConfig.name} Danapur`,
      `${siteConfig.name} Patna`,
      `${siteConfig.name} Neora`,
    ],
    description: siteConfig.shortDescription,
    url: siteConfig.url,
    telephone: `+${siteConfig.phones.primary}`,
    email: siteConfig.email,
    image: `${siteConfig.url}/opengraph-image`,
    priceRange: '₹₹',
    founder: { '@type': 'Person', name: siteConfig.proprietor },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.line1,
      // The town is Danapur; Patna is the wider district and is covered by
      // `areaServed` below. Schema.org allows only one locality, and the more
      // specific one is the correct value.
      addressLocality: siteConfig.address.area,
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
    // NOTE: deliberately no `makesOffer` here. Nesting bare { name } objects
    // typed as schema.org Product (no image/price) made Google's Product
    // rich-result validator flag them as "invalid items" — each product
    // already has its own correctly-typed Product markup on its detail page
    // (see productJsonLd below), which is the right place for this data.
  };
}

/**
 * ItemList for the catalogue page. Spells out every product URL in one place,
 * which gives Google a second, machine-readable route to the product pages
 * alongside the sitemap and the on-page links.
 */
export function productListJsonLd(products: { name: string; slug: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Building materials supplied by ${siteConfig.name}, ${siteConfig.address.area}, ${siteConfig.address.city}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${siteConfig.url}/products/${p.slug}`,
    })),
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
