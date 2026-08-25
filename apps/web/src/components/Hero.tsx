'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/site';
import type { HeroSettings } from '@/lib/settings';

export function Hero({ settings }: { settings: HeroSettings }) {
  const slides = settings.slides ?? [];
  const hasImages = slides.length > 0;
  const [index, setIndex] = useState(0);

  // Auto-advance the carousel.
  useEffect(() => {
    if (!hasImages || !settings.autoplay || slides.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      Math.max(2, settings.interval) * 1000,
    );
    return () => clearInterval(id);
  }, [hasImages, settings.autoplay, settings.interval, slides.length]);

  return (
    <section className="relative bg-primary overflow-hidden min-h-[540px] md:min-h-[640px] flex items-center">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        {hasImages ? (
          <>
            {slides.map((s, i) => (
              <Image
                key={s.url + i}
                src={s.url}
                alt={s.alt || ''}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  i === index ? 'opacity-100 animate-slow-zoom' : 'opacity-0'
                }`}
              />
            ))}
            {/* Admin-controlled darkness overlay (keeps text readable) */}
            <div
              className="absolute inset-0 bg-primary"
              style={{ opacity: Math.min(100, Math.max(0, settings.overlay)) / 100 }}
            />
            {/* Extra gradient on the text side */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />
          </>
        ) : (
          // Fallback: the built-in dot-pattern design (no images uploaded).
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28 w-full">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 bg-primary-container/90 backdrop-blur-sm px-3 py-1 rounded mb-6 animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">verified</span>
            <span className="font-heading text-label-bold text-tertiary-fixed uppercase tracking-wide">
              Trusted Building Materials Supplier
            </span>
          </div>
          <h1
            className="font-heading text-headline-lg-mobile md:text-display-lg text-on-primary mb-6 drop-shadow-sm animate-fade-up"
            style={{ animationDelay: '180ms' }}
          >
            Strong Foundations Start with the Right Materials
          </h1>
          <p
            className="font-body text-body-lg text-primary-fixed-dim mb-4 max-w-2xl animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            Cement, iron rods, gitti, balu, bricks, bamboo &amp; plywood — everything for your
            construction, supplied fresh at a fair price from our shop at
            <strong className="text-on-primary"> Neora, near Railway Gumti, Patna</strong>. Serving
            Neora, Danapur, Bihta, Khagaul &amp; Patna.
          </p>
          <p
            className="font-heading text-label-bold text-tertiary-fixed uppercase tracking-wider mb-10 animate-fade-up"
            style={{ animationDelay: '400ms' }}
          >
            {siteConfig.taglineEn}
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-up"
            style={{ animationDelay: '500ms' }}
          >
            <a
              href={siteConfig.telPrimary}
              className="bg-secondary text-on-secondary px-8 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              Call for Price
            </a>
            <Link
              href="/products"
              className="bg-transparent border-2 border-on-primary text-on-primary px-8 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-on-primary/10 transition-colors text-center"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel dots */}
      {hasImages && slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? 'w-8 bg-tertiary-fixed' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-tertiary-fixed-dim z-20" />
    </section>
  );
}
