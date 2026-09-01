'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'submitting' | 'posted' | 'held' | 'error';

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const labels = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={`${n} star${n === 1 ? '' : 's'} — ${labels[n - 1]}`}
            aria-pressed={value === n}
            className="p-0.5 rounded hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <span
              className="material-symbols-outlined block"
              style={{
                fontSize: 30,
                color: n <= shown ? '#fdbc0a' : '#c4c6cd',
                fontVariationSettings: `'FILL' ${n <= shown ? 1 : 0}`,
              }}
            >
              star
            </span>
          </button>
        ))}
      </div>
      <span className="font-body text-body-md text-on-surface-variant">{labels[shown - 1] ?? ''}</span>
    </div>
  );
}

export function ReviewForm({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState(''); // honeypot

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, author, rating, comment, website }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // A held review must not look like it published — say so honestly.
        setStatus(data.status === 'pending' ? 'held' : 'posted');
        setAuthor('');
        setComment('');
        setRating(5);
        // Pull the freshly approved review into the list without a full reload.
        if (data.status !== 'pending') router.refresh();
      } else {
        setStatus('error');
        setErrorMsg(data?.error || 'Could not post your review. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  }

  if (status === 'posted' || status === 'held') {
    const held = status === 'held';
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 text-center">
        <span
          className={`material-symbols-outlined text-5xl mb-3 ${held ? 'text-tertiary-fixed-dim' : 'text-whatsapp'}`}
        >
          {held ? 'schedule' : 'check_circle'}
        </span>
        <h3 className="font-heading text-headline-md text-primary mb-2">
          {held ? 'Thank you — review received' : 'Thank you for your review!'}
        </h3>
        <p className="font-body text-body-md text-on-surface-variant mb-5">
          {held
            ? 'We check a few reviews by hand before they appear. Yours will show on this page shortly.'
            : `Your review of ${productName} is now live on this page.`}
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setOpen(false);
          }}
          className="font-heading text-label-bold text-secondary uppercase tracking-wide hover:text-secondary-container"
        >
          Done
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-surface-container-high text-primary border border-outline-variant px-5 py-3 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:border-secondary hover:text-secondary transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">rate_review</span>
        Write a Review
      </button>
    );
  }

  const inputClass =
    'w-full bg-surface-container-low border-b-2 border-surface-variant focus:border-primary px-4 py-3 rounded-t transition-colors outline-none font-body text-body-md';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-headline-md text-primary">Write a Review</h3>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            Bought {productName} from us? Tell other customers how it was.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close review form"
          className="text-on-surface-variant hover:text-primary p-1 shrink-0"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {status === 'error' && errorMsg && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded font-body text-body-md" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Honeypot — hidden from humans, catches bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="review-website">Website</label>
        <input
          id="review-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <span className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide">
          Your Rating *
        </span>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div>
        <label
          htmlFor="review-author"
          className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide"
        >
          Your Name *
        </label>
        <input
          id="review-author"
          type="text"
          required
          minLength={2}
          maxLength={80}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Ravi Kumar"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide"
        >
          Your Review *
        </label>
        <textarea
          id="review-comment"
          required
          minLength={5}
          maxLength={1000}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was the quality, the rate and the service?"
          className={`${inputClass} resize-none`}
        />
        <p className="font-body text-label-sm text-outline mt-1 text-right">
          {comment.length}/1000
        </p>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-secondary text-on-secondary py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          'Posting…'
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">send</span>
            Post Review
          </>
        )}
      </button>

      <p className="font-body text-label-sm text-on-surface-variant text-center">
        Please only review materials you have actually bought from us. Your name will be shown
        publicly with your review.
      </p>
    </form>
  );
}
