import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';
import { siteConfig } from '@/lib/site';

// -----------------------------------------------------------------------------
// XML sitemap.
//
// `lastModified` has to be truthful. It used to be `new Date()` for every URL,
// which meant each deploy told Google that all eight pages had just changed —
// Google's documented response to a sitemap whose dates are always "now" is to
// stop trusting the dates and fall back to its own crawl scheduling. Product
// pages now report the row's real `updated_at`, and the static pages report the
// date their content was last edited.
// -----------------------------------------------------------------------------

/** Bump this when the wording on /, /products, /about or /contact changes. */
const STATIC_CONTENT_UPDATED = new Date('2026-09-01T00:00:00.000Z');

/** Keep in step with the `UPDATED` date shown on /privacy and /terms. */
const LEGAL_UPDATED = new Date('2026-09-01T00:00:00.000Z');

function toDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  // The catalogue pages are only as fresh as the most recently edited product.
  const newestProductChange = products.reduce<Date>((latest, p) => {
    const d = toDate(p.updatedAt, STATIC_CONTENT_UPDATED);
    return d > latest ? d : latest;
  }, STATIC_CONTENT_UPDATED);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: newestProductChange,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/products`,
      lastModified: newestProductChange,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: STATIC_CONTENT_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: STATIC_CONTENT_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Legal pages: worth indexing (they are a trust signal, and Google likes to
    // see them on a business site) but they should never outrank the catalogue.
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/products/${p.slug}`,
    lastModified: toDate(p.updatedAt, STATIC_CONTENT_UPDATED),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
