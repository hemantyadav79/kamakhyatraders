import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { SiteChrome } from '@/components/SiteChrome';
import { getAllProducts } from '@/lib/products';
import { siteConfig } from '@/lib/site';
import { localBusinessJsonLd } from '@/lib/seo';

// The footer lists every product, so the catalogue is read here. Matches the
// 5-minute window the pages already use, keeping every route on ISR rather
// than turning the whole site dynamic.
export const revalidate = 300;

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-hanken',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Building Materials in Patna & Danapur`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.shortDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.proprietor }],
  robots: { index: true, follow: true },
  // Favicon + Apple icon are provided by src/app/icon.svg and apple-icon.tsx.
};

export const viewport: Viewport = {
  themeColor: '#000917',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await getAllProducts();
  const productLinks = products.map((p) => ({ name: p.name, slug: p.slug }));

  return (
    <html lang="en" className={`${hanken.variable} ${inter.variable}`}>
      <head>
        {/* Material Symbols icon font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0&display=swap"
        />
        {/* LocalBusiness structured data for rich local search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <SiteChrome productLinks={productLinks}>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
