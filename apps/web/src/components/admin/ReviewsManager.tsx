'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { LogoMark } from '@/components/Logo';

type Status = 'pending' | 'approved' | 'rejected';

type AdminReview = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  author: string;
  rating: number;
  comment: string;
  status: Status;
  holdReason: string | null;
  createdAt: string;
};

type Filter = 'pending' | 'approved' | 'rejected' | 'all';

const STATUS_STYLES: Record<Status, string> = {
  pending: 'bg-error-container text-on-error-container',
  approved: 'bg-whatsapp/15 text-whatsapp-dark',
  rejected: 'bg-surface-container-high text-on-surface-variant',
};

const STATUS_LABELS: Record<Status, string> = {
  pending: 'Waiting for approval',
  approved: 'Live on site',
  rejected: 'Hidden',
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 align-middle" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="material-symbols-outlined"
          style={{
            fontSize: 18,
            color: n <= rating ? '#fdbc0a' : '#c4c6cd',
            fontVariationSettings: `'FILL' ${n <= rating ? 1 : 0}`,
          }}
          aria-hidden="true"
        >
          star
        </span>
      ))}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ReviewsManager({ username }: { username: string }) {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ author: '', rating: 5, comment: '' });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json().catch(() => ({}));
      if (res.ok) setReviews(data.reviews || []);
      else setError(data.error || 'Could not load reviews.');
    } catch {
      setError('Network error loading reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(
    () => ({
      pending: reviews.filter((r) => r.status === 'pending').length,
      approved: reviews.filter((r) => r.status === 'approved').length,
      rejected: reviews.filter((r) => r.status === 'rejected').length,
      all: reviews.length,
    }),
    [reviews],
  );

  const visible = useMemo(
    () => (filter === 'all' ? reviews : reviews.filter((r) => r.status === filter)),
    [reviews, filter],
  );

  async function patch(id: string, body: Record<string, unknown>, successMsg: string) {
    setBusyId(id);
    setError('');
    setNotice('');
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNotice(successMsg);
        setEditingId(null);
        await load();
      } else {
        setError(data.error || 'Could not update the review.');
      }
    } catch {
      setError('Network error while updating.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(r: AdminReview) {
    if (!confirm(`Delete the review by "${r.author}"? This cannot be undone.`)) return;
    setBusyId(r.id);
    setError('');
    setNotice('');
    try {
      const res = await fetch(`/api/admin/reviews/${r.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNotice('Review deleted.');
        await load();
      } else {
        setError(data.error || 'Could not delete the review.');
      }
    } catch {
      setError('Network error while deleting.');
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(r: AdminReview) {
    setEditingId(r.id);
    setDraft({ author: r.author, rating: r.rating, comment: r.comment });
    setNotice('');
    setError('');
  }

  const field =
    'w-full bg-surface-container-low border-b-2 border-surface-variant focus:border-primary px-3 py-2 rounded-t outline-none font-body text-body-md';

  const tabs: { key: Filter; label: string }[] = [
    { key: 'pending', label: 'Waiting' },
    { key: 'approved', label: 'Live' },
    { key: 'rejected', label: 'Hidden' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low pb-16">
      <header className="bg-primary text-on-primary shadow-lg sticky top-0 z-40">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <div>
              <h1 className="font-heading text-xl font-bold text-tertiary-fixed leading-none">
                Customer Reviews
              </h1>
              <p className="font-body text-label-sm text-primary-fixed-dim mt-1">
                Signed in as {username}
              </p>
            </div>
          </div>
          <Link
            href="/admin-gunnu-org"
            className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container/70 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Products
          </Link>
        </div>
      </header>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-6">
          <p className="font-body text-body-md text-on-surface-variant">
            Visitors write these reviews on the product pages. Clean ones go live straight away;
            anything that looks like abuse or spam is held here first and stays hidden from the
            public site until you approve it. You can edit the wording, hide a review, or delete it
            for good.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide transition-colors inline-flex items-center gap-2 ${
                filter === t.key
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-primary border border-outline-variant hover:border-primary'
              }`}
            >
              {t.label}
              <span
                className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-[12px] flex items-center justify-center ${
                  t.key === 'pending' && counts.pending > 0
                    ? 'bg-error text-on-error'
                    : filter === t.key
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        {notice && (
          <div
            className="bg-whatsapp/10 border border-whatsapp/40 text-on-surface px-4 py-3 rounded-lg mb-4 font-body flex items-center gap-2"
            role="status"
          >
            <span className="material-symbols-outlined text-whatsapp text-[20px]">check_circle</span>
            {notice}
          </div>
        )}
        {error && (
          <div
            className="bg-error-container text-on-error-container px-4 py-3 rounded-lg mb-4 font-body flex items-center gap-2"
            role="alert"
          >
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-3 justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span className="font-body text-body-md">Loading reviews…</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-3">reviews</span>
            <p className="font-heading text-headline-md text-primary mb-2">
              {filter === 'pending' ? 'Nothing waiting' : 'No reviews here'}
            </p>
            <p className="font-body text-body-md text-on-surface-variant">
              {filter === 'pending'
                ? 'Every review has been dealt with. New ones that look suspicious will appear here.'
                : 'Reviews will show up as customers write them on the product pages.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((r) => {
              const busy = busyId === r.id;
              const isEditing = editingId === r.id;

              return (
                <div
                  key={r.id}
                  className={`bg-surface-container-lowest border rounded-xl p-5 shadow-sm ${
                    r.status === 'pending' ? 'border-error/50' : 'border-outline-variant'
                  } ${busy ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-heading text-primary font-semibold text-lg">{r.author}</p>
                        <Stars rating={r.rating} />
                      </div>
                      <p className="font-body text-label-sm text-on-surface-variant">
                        on{' '}
                        {r.productSlug ? (
                          <a
                            href={`/products/${r.productSlug}#reviews`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:underline underline-offset-2"
                          >
                            {r.productName}
                          </a>
                        ) : (
                          r.productName
                        )}{' '}
                        · {formatDate(r.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`font-heading text-label-sm px-3 py-1.5 rounded-full whitespace-nowrap ${STATUS_STYLES[r.status]}`}
                    >
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>

                  {r.status === 'pending' && r.holdReason && (
                    <p className="font-body text-label-sm text-on-error-container bg-error-container/60 px-3 py-2 rounded mb-3 inline-flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      Held automatically: {r.holdReason}
                    </p>
                  )}

                  {isEditing ? (
                    <div className="space-y-3 border-t border-surface-variant pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                        <input
                          value={draft.author}
                          onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                          placeholder="Customer name"
                          className={field}
                        />
                        <select
                          value={draft.rating}
                          onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
                          className={field}
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {n} ★
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        value={draft.comment}
                        onChange={(e) => setDraft({ ...draft, comment: e.target.value })}
                        rows={3}
                        placeholder="Review text"
                        className={`${field} resize-none`}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => patch(r.id, draft, 'Review updated.')}
                          disabled={busy || draft.author.trim().length === 0}
                          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container transition-colors disabled:opacity-60"
                        >
                          Save changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-surface-container-high text-primary px-5 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {r.comment && (
                        <p className="font-body text-body-md text-on-surface whitespace-pre-line mb-4">
                          {r.comment}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 border-t border-surface-variant pt-4">
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => patch(r.id, { status: 'approved' }, 'Review approved — it is now live.')}
                            disabled={busy}
                            className="inline-flex items-center gap-1.5 bg-whatsapp text-white px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-whatsapp-dark transition-colors disabled:opacity-60"
                          >
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            Approve
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => patch(r.id, { status: 'rejected' }, 'Review hidden from the site.')}
                            disabled={busy}
                            className="inline-flex items-center gap-1.5 bg-surface-container-high text-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-surface-variant transition-colors disabled:opacity-60"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                            Hide
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(r)}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 bg-surface-container-high text-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-surface-variant transition-colors disabled:opacity-60"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => remove(r)}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 text-error hover:bg-error-container px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide transition-colors disabled:opacity-60 ml-auto"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
