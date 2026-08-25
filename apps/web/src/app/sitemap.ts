import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteConfig.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const products = await getAllProducts();
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
