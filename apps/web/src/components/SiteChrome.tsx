'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';

// Wraps page content with the public header/footer/WhatsApp button — except on
// the admin panel, which gets a clean, chrome-free full-page layout.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin-gunnu-org');

  if (isAdmin) {
    return (
      <main id="main" className="flex-grow">
        {children}
      </main>
    );
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
