import Link from 'next/link';
import type { ProductGuide as Guide } from '@/data/product-guides';
import { siteConfig } from '@/lib/site';

// -----------------------------------------------------------------------------
// Buying guide + FAQ block on a product page. Everything is plain, visible,
// server-rendered text (no collapsed accordions) so both visitors and Google
// see all of it on first load.
// -----------------------------------------------------------------------------

export function ProductGuide({
  guide,
  productName,
  otherProducts,
}: {
  guide: Guide;
  productName: string;
  /** Every other product, linked in the closing paragraph. */
  otherProducts: { name: string; slug: string }[];
}) {
  return (
    <section className="mt-16 pt-10 border-t-2 border-surface-variant">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-12">
        <div className="lg:col-span-8 space-y-10">
          {guide.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-heading text-headline-md text-primary mb-4">{s.heading}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p.slice(0, 40)} className="font-body text-body-lg text-on-surface-variant mb-4">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 font-body text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5" aria-hidden="true">
                        check_circle
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.table && (
                <div className="overflow-x-auto rounded border border-surface-variant">
                  <table className="w-full text-left font-body text-body-md">
                    <thead className="bg-surface-container-high">
                      <tr>
                        {s.table.head.map((h) => (
                          <th key={h} scope="col" className="px-4 py-3 font-heading text-label-bold text-primary">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map(([a, b]) => (
                        <tr key={a} className="border-t border-surface-variant">
                          <th scope="row" className="px-4 py-3 font-heading text-primary whitespace-nowrap">
                            {a}
                          </th>
                          <td className="px-4 py-3 text-on-surface-variant">{b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Side panel: Hindi summary + quick contact */}
        <aside className="lg:col-span-4">
          <div className="bg-primary text-on-primary rounded p-6 md:p-8 lg:sticky lg:top-28">
            <p className="font-body text-body-lg text-primary-fixed-dim mb-6" lang="hi">
              {guide.hindi}
            </p>
            <p className="font-heading text-label-bold text-tertiary-fixed uppercase tracking-wide mb-2">
              Today&apos;s rate for {productName}
            </p>
            <a
              href={siteConfig.telPrimary}
              className="block font-heading text-headline-md hover:text-tertiary-fixed transition-colors mb-1"
            >
              {siteConfig.phones.primaryDisplay}
            </a>
            <p className="font-body text-body-md text-on-primary-container">
              {siteConfig.name}, {siteConfig.address.full}
            </p>
          </div>
        </aside>
      </div>

      {/* FAQ */}
      <div className="mt-14">
        <h2 className="font-heading text-headline-md text-primary mb-6">
          {productName} — Frequently Asked Questions
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.faqs.map((f) => (
            <div key={f.q} className="bg-surface-container-lowest border border-surface-variant rounded-lg p-5">
              <dt className="font-heading text-primary font-bold mb-2">{f.q}</dt>
              <dd className="font-body text-body-md text-on-surface-variant">{f.a}</dd>
            </div>
          ))}
        </dl>
        {otherProducts.length > 0 && (
          <p className="font-body text-body-md text-on-surface-variant mt-8">
            Building a house? We also supply{' '}
            {otherProducts.map((p, i) => (
              <span key={p.slug}>
                <Link href={`/products/${p.slug}`} className="text-secondary font-semibold hover:underline">
                  {p.name}
                </Link>
                {i < otherProducts.length - 2 ? ', ' : i === otherProducts.length - 2 ? ' and ' : ''}
              </span>
            ))}{' '}
            from the same shop in Danapur, Patna.
          </p>
        )}
      </div>
    </section>
  );
}
