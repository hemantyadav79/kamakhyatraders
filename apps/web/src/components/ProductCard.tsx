import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data/products';
import { siteConfig } from '@/lib/site';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant hover:border-secondary rounded group flex flex-col h-full shadow-sm overflow-hidden card-lift">
      <Link
        href={`/products/${product.slug}`}
        className="aspect-square w-full bg-surface-container-low overflow-hidden relative block"
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {product.badge && (
          <span className="absolute top-4 right-4 bg-tertiary-fixed text-on-tertiary-fixed font-body text-label-sm px-3 py-1 rounded">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-heading text-headline-md text-2xl text-primary leading-tight">
            <Link href={`/products/${product.slug}`} className="hover:text-secondary transition-colors">
              {product.name}
            </Link>
          </h3>
          <span className="shrink-0 mt-1 text-outline font-body text-label-sm" lang="hi">
            {product.nameHindi}
          </span>
        </div>

        <p className="font-body text-body-md text-on-surface-variant mb-4 flex-grow">
          {product.summary}
        </p>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-body text-label-sm text-outline uppercase tracking-wide">Price</p>
            <p className="font-heading text-primary font-bold">{product.priceLabel}</p>
          </div>
          <span
            className={`text-label-sm font-body px-2 py-1 rounded ${
              product.inStock
                ? 'bg-surface-container-high text-on-surface'
                : 'bg-error-container text-on-error-container'
            }`}
          >
            {product.inStock ? 'Available' : 'Out of stock'}
          </span>
        </div>

        <a
          href={siteConfig.telPrimary}
          className="w-full bg-secondary text-on-secondary font-heading text-label-bold uppercase tracking-wide py-3 rounded hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">call</span>
          Call for Price
        </a>
      </div>
    </div>
  );
}
