import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep the hidden admin panel and API out of search engines.
        disallow: ['/admin-gunnu-org', '/api/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    // No `host` directive: it's a Yandex-only extension that Googlebot
    // explicitly ignores (flagged as a warning in Search Console). Canonical
    // domain preference is already established via the www->apex redirect
    // and canonical tags, so this line added nothing for Google.
  };
}
