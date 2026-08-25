import type { ProductReview } from '@/data/products';

function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="material-symbols-outlined"
          style={{
            fontSize: size,
            color: n <= Math.round(rating) ? '#fdbc0a' : '#c4c6cd',
            fontVariationSettings: `'FILL' ${n <= Math.round(rating) ? 1 : 0}`,
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ProductReviews({
  reviews,
  productName,
}: {
  reviews: ProductReview[];
  productName: string;
}) {
  if (!reviews || reviews.length === 0) return null;

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="mt-4 pt-10 border-t-2 border-surface-variant">
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <h2 className="font-heading text-headline-md text-primary">Customer Reviews</h2>
        <div className="flex items-center gap-2">
          <Stars rating={average} size={20} />
          <span className="font-heading text-primary font-bold">{average.toFixed(1)}</span>
          <span className="font-body text-body-md text-on-surface-variant">
            ({reviews.length} review{reviews.length === 1 ? '' : 's'} for {productName})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r, i) => (
          <div key={i} className="bg-surface-container-lowest border border-surface-variant rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading text-primary font-semibold">{r.author}</p>
              <Stars rating={r.rating} />
            </div>
            {r.comment && (
              <p className="font-body text-body-md text-on-surface-variant mb-2">{r.comment}</p>
            )}
            {r.date && (
              <p className="font-body text-label-sm text-outline">{formatDate(r.date)}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
