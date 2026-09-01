import type { Review } from '@/lib/reviews';
import { ReviewForm } from '@/components/ReviewForm';

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

/** First letter of the reviewer's name, for the avatar circle. */
function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

export function ProductReviews({
  reviews,
  productId,
  productName,
  canReview,
}: {
  reviews: Review[];
  productId: string;
  productName: string;
  /** False when the database isn't available, so the form would only fail. */
  canReview: boolean;
}) {
  const hasReviews = reviews.length > 0;
  const average = hasReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <section className="mt-4 pt-10 border-t-2 border-surface-variant" id="reviews">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="font-heading text-headline-md text-primary">Customer Reviews</h2>
          {hasReviews && (
            <div className="flex items-center gap-2">
              <Stars rating={average} size={20} />
              <span className="font-heading text-primary font-bold">{average.toFixed(1)}</span>
              <span className="font-body text-body-md text-on-surface-variant">
                ({reviews.length} review{reviews.length === 1 ? '' : 's'} for {productName})
              </span>
            </div>
          )}
        </div>
        {canReview && hasReviews && <ReviewForm productId={productId} productName={productName} />}
      </div>

      {hasReviews ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="bg-surface-container-lowest border border-surface-variant rounded-lg p-5"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="h-9 w-9 shrink-0 rounded-full bg-primary text-tertiary-fixed font-heading font-bold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {initial(r.author)}
                  </span>
                  <p className="font-heading text-primary font-semibold truncate">{r.author}</p>
                </div>
                <div className="shrink-0">
                  <Stars rating={r.rating} />
                </div>
              </div>
              {r.comment && (
                <p className="font-body text-body-md text-on-surface-variant mb-2">{r.comment}</p>
              )}
              {r.createdAt && (
                <p className="font-body text-label-sm text-outline">{formatDate(r.createdAt)}</p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-outline mb-3">reviews</span>
          <p className="font-heading text-headline-md text-primary mb-2">No reviews yet</p>
          <p className="font-body text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
            {canReview
              ? `Have you bought ${productName} from us? Be the first to share your experience and help other customers.`
              : `Reviews for ${productName} will appear here.`}
          </p>
          {canReview && (
            <div className="flex justify-center">
              <ReviewForm productId={productId} productName={productName} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
