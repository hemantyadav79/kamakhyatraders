'use client';

import Image from 'next/image';
import { useState } from 'react';

export function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: string;
}) {
  const gallery = images.length > 0 ? images : ['/images/products/placeholder.svg'];
  const [index, setIndex] = useState(0);
  const multiple = gallery.length > 1;

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + gallery.length) % gallery.length);

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square w-full bg-surface-container-low rounded overflow-hidden border border-outline-variant group">
        {gallery.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={i === index ? alt : ''}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={i === 0}
            className={`object-cover transition-opacity duration-500 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {badge && (
          <span className="absolute top-4 right-4 z-10 bg-tertiary-fixed text-on-tertiary-fixed font-body text-label-sm px-3 py-1 rounded">
            {badge}
          </span>
        )}

        {multiple && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-primary/70 text-on-primary flex items-center justify-center hover:bg-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-primary/70 text-on-primary flex items-center justify-center hover:bg-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-6 bg-tertiary-fixed' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {multiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                i === index ? 'border-secondary' : 'border-surface-variant hover:border-outline'
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
