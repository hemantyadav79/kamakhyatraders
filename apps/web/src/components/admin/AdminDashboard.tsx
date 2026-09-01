'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoMark } from '@/components/Logo';

type ProductRow = {
  id?: string;
  slug: string;
  name: string;
  name_hindi?: string;
  category?: string;
  summary?: string;
  description?: string;
  uses?: string[] | string;
  unit?: string;
  price_label?: string;
  image?: string;
  image_alt?: string;
  images?: string[];
  in_stock?: boolean;
  badge?: string;
  sort_order?: number;
};

const emptyProduct: ProductRow = {
  slug: '',
  name: '',
  name_hindi: '',
  category: '',
  summary: '',
  description: '',
  uses: '',
  unit: '',
  price_label: 'Negotiable',
  image: '',
  image_alt: '',
  images: [],
  in_stock: true,
  badge: '',
  sort_order: 0,
};

export function AdminDashboard({
  username,
  pendingReviews,
}: {
  username: string;
  /** Reviews the abuse filter held back, waiting for approval. */
  pendingReviews: number;
}) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setProducts(data.products || []);
      } else {
        setError(data.error || 'Could not load products.');
      }
    } catch {
      setError('Network error loading products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin-gunnu-org/login');
    router.refresh();
  }

  function startNew() {
    setEditing({ ...emptyProduct });
    setNotice('');
    setError('');
  }

  function startEdit(p: ProductRow) {
    setEditing({ ...p, uses: Array.isArray(p.uses) ? p.uses.join(', ') : p.uses || '' });
    setNotice('');
    setError('');
  }

  // Signed upload to Cloudinary; returns the hosted URL (or null on failure).
  async function uploadToCloudinary(file: File): Promise<string | null> {
    const sigRes = await fetch('/api/admin/upload', { method: 'POST' });
    const sig = await sigRes.json().catch(() => ({}));
    if (!sigRes.ok) {
      setError(sig.error || 'Image upload not available.');
      return null;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sig.apiKey);
    fd.append('timestamp', String(sig.timestamp));
    fd.append('signature', sig.signature);
    fd.append('folder', sig.folder);
    const upRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
      method: 'POST',
      body: fd,
    });
    const upData = await upRes.json().catch(() => ({}));
    if (upRes.ok && upData.secure_url) return upData.secure_url as string;
    setError(upData?.error?.message || 'Image upload failed.');
    return null;
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError('');
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        setEditing((prev) => (prev ? { ...prev, image: url } : prev));
        setNotice('Main image uploaded.');
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(file: File) {
    setUploading(true);
    setError('');
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        setEditing((prev) => (prev ? { ...prev, images: [...(prev.images ?? []), url] } : prev));
        setNotice('Gallery image added.');
      }
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryImage(i: number) {
    setEditing((prev) =>
      prev ? { ...prev, images: (prev.images ?? []).filter((_, idx) => idx !== i) } : prev,
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    setNotice('');

    const payload = {
      ...editing,
      uses:
        typeof editing.uses === 'string'
          ? editing.uses.split(',').map((s) => s.trim()).filter(Boolean)
          : editing.uses,
      images: Array.isArray(editing.images) ? editing.images : [],
      sort_order: Number(editing.sort_order) || 0,
    };

    const isUpdate = Boolean(editing.id);
    const url = isUpdate ? `/api/admin/products/${editing.id}` : '/api/admin/products';
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNotice(isUpdate ? 'Product updated.' : 'Product added.');
        setEditing(null);
        load();
      } else {
        setError(data.error || 'Could not save.');
      }
    } catch {
      setError('Network error while saving.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: ProductRow) {
    if (!p.id) return;
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNotice('Product deleted.');
        load();
      } else {
        setError(data.error || 'Could not delete.');
      }
    } catch {
      setError('Network error while deleting.');
    }
  }

  const field = 'w-full bg-surface-container-low border-b-2 border-surface-variant focus:border-primary px-3 py-2 rounded-t outline-none font-body text-body-md';
  const labelC = 'block font-heading text-label-sm text-primary mb-1 uppercase tracking-wide';

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.in_stock).length;
  const categoryCount = new Set(products.map((p) => p.category).filter(Boolean)).size;

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: 'inventory_2' },
    { label: 'Available', value: inStockCount, icon: 'check_circle' },
    { label: 'Categories', value: categoryCount, icon: 'category' },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low pb-16">
      {/* Branded top bar */}
      <header className="bg-primary text-on-primary shadow-lg sticky top-0 z-40">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <div>
              <h1 className="font-heading text-xl font-bold text-tertiary-fixed leading-none">Product Admin</h1>
              <p className="font-body text-label-sm text-primary-fixed-dim mt-1">Signed in as {username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={startNew} className="bg-secondary text-on-secondary px-4 sm:px-5 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </button>
            <Link href="/admin-gunnu-org/reviews" className="relative inline-flex items-center gap-1.5 bg-primary-container text-on-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container/70 transition-colors">
              <span className="material-symbols-outlined text-[18px]">reviews</span>
              <span className="hidden sm:inline">Reviews</span>
              {pendingReviews > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-error text-on-error font-heading text-[12px] font-bold flex items-center justify-center shadow"
                  title={`${pendingReviews} review${pendingReviews === 1 ? '' : 's'} waiting for your approval`}
                >
                  {pendingReviews}
                </span>
              )}
            </Link>
            <Link href="/admin-gunnu-org/hero" className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container/70 transition-colors">
              <span className="material-symbols-outlined text-[18px]">wallpaper</span>
              <span className="hidden sm:inline">Hero Section</span>
              <span className="sm:hidden">Hero</span>
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-1.5 bg-primary-container text-on-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container/70 transition-colors">
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              View Site
            </a>
            <button onClick={handleLogout} className="bg-primary-container text-on-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container/70 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-primary text-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <div>
                <p className="font-heading text-3xl font-bold text-primary leading-none">{s.value}</p>
                <p className="font-body text-label-sm text-on-surface-variant uppercase tracking-wide mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews the filter held back. Shown here because the owner opens
            this page far more often than the reviews screen. */}
        {pendingReviews > 0 && (
          <Link
            href="/admin-gunnu-org/reviews"
            className="flex items-center gap-3 bg-error-container text-on-error-container px-4 py-4 rounded-lg mb-6 hover:brightness-95 transition-[filter]"
          >
            <span className="material-symbols-outlined">flag</span>
            <span className="font-body flex-1">
              <strong className="font-heading">
                {pendingReviews} customer review{pendingReviews === 1 ? '' : 's'} waiting for your approval.
              </strong>{' '}
              {pendingReviews === 1 ? 'It was' : 'They were'} held back automatically and{' '}
              {pendingReviews === 1 ? 'is' : 'are'} not visible on the website yet.
            </span>
            <span className="font-heading text-label-bold uppercase tracking-wide whitespace-nowrap inline-flex items-center gap-1">
              Review now
              <span className="material-symbols-outlined text-[18px]">east</span>
            </span>
          </Link>
        )}

        {notice && (
          <div className="bg-whatsapp/10 border border-whatsapp/40 text-on-surface px-4 py-3 rounded-lg mb-4 font-body flex items-center gap-2" role="status">
            <span className="material-symbols-outlined text-whatsapp text-[20px]">check_circle</span>
            {notice}
          </div>
        )}
        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg mb-4 font-body flex items-center gap-2" role="alert">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

      {/* Editing form */}
      {editing && (
        <form onSubmit={handleSave} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="font-heading text-headline-md text-primary mb-6 pb-3 border-b border-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">{editing.id ? 'edit' : 'add_box'}</span>
            {editing.id ? 'Edit Product' : 'New Product'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelC}>Name *</label>
              <input className={field} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
            </div>
            <div>
              <label className={labelC}>Name (Hindi)</label>
              <input className={field} value={editing.name_hindi || ''} onChange={(e) => setEditing({ ...editing, name_hindi: e.target.value })} />
            </div>
            <div>
              <label className={labelC}>Slug * (url: /products/slug)</label>
              <input className={field} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="e.g. cement" required />
            </div>
            <div>
              <label className={labelC}>Category</label>
              <input className={field} value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            </div>
            <div>
              <label className={labelC}>Price Label</label>
              <input className={field} value={editing.price_label || ''} onChange={(e) => setEditing({ ...editing, price_label: e.target.value })} placeholder="Negotiable" />
            </div>
            <div>
              <label className={labelC}>Unit (e.g. Per Bag)</label>
              <input className={field} value={editing.unit || ''} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
            </div>
            <div>
              <label className={labelC}>Badge (optional)</label>
              <input className={field} value={editing.badge || ''} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} placeholder="Best Seller" />
            </div>
            <div>
              <label className={labelC}>Sort Order (higher = first)</label>
              <input type="number" className={field} value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <label className={labelC}>Summary (short, shown on cards)</label>
              <input className={field} value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={labelC}>Description (long)</label>
              <textarea rows={3} className={`${field} resize-none`} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={labelC}>Uses (comma separated)</label>
              <input className={field} value={typeof editing.uses === 'string' ? editing.uses : (editing.uses || []).join(', ')} onChange={(e) => setEditing({ ...editing, uses: e.target.value })} placeholder="Foundations, Plastering, Brickwork" />
            </div>

            {/* Main image */}
            <div className="md:col-span-2">
              <label className={labelC}>Main Image (shown on cards &amp; first in carousel)</label>
              <div className="flex items-center gap-4 flex-wrap">
                {editing.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editing.image} alt="preview" className="h-20 w-20 object-cover rounded border border-surface-variant" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f);
                    e.target.value = '';
                  }}
                  className="font-body text-body-md"
                />
                {uploading && <span className="font-body text-label-sm text-on-surface-variant">Uploading…</span>}
              </div>
              <input className={`${field} mt-2`} value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="or paste an image URL / /images/products/xyz.svg" />
            </div>

            {/* Gallery images (carousel) */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className={labelC + ' mb-0'}>Gallery Images (extra photos in the carousel)</label>
                <label className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-heading text-label-sm uppercase tracking-wide hover:bg-primary-container transition-colors cursor-pointer inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                  Add Photo
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleGalleryUpload(f); e.target.value = ''; }} />
                </label>
              </div>
              {(editing.images ?? []).length === 0 ? (
                <p className="font-body text-label-sm text-on-surface-variant">No extra photos yet. The carousel will just show the main image.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {(editing.images ?? []).map((img, i) => (
                    <div key={img + i} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="h-20 w-20 object-cover rounded-lg border border-surface-variant" />
                      <button type="button" onClick={() => removeGalleryImage(i)} aria-label="Remove photo"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-error text-on-error flex items-center justify-center shadow hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input id="in_stock" type="checkbox" checked={editing.in_stock ?? true} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} className="w-5 h-5" />
              <label htmlFor="in_stock" className="font-body text-body-md text-primary">In stock / available</label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={saving || uploading} className="bg-primary text-on-primary px-6 py-3 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : editing.id ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="bg-surface-container-high text-primary px-6 py-3 rounded font-heading text-label-bold uppercase tracking-wide">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-3 justify-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          <span className="font-body text-body-md">Loading products…</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-outline mb-3">inventory_2</span>
          <p className="font-heading text-headline-md text-primary mb-2">No products yet</p>
          <p className="font-body text-body-md text-on-surface-variant mb-6">
            Click “Add Product” to create your first one — or run the seed SQL to import the default catalogue.
          </p>
          <button onClick={startNew} className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Product
          </button>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-surface-container-high border-b border-surface-variant">
                  <th className="px-5 py-3.5 font-heading text-label-sm uppercase tracking-wide text-on-surface-variant">Product</th>
                  <th className="px-5 py-3.5 font-heading text-label-sm uppercase tracking-wide text-on-surface-variant">Category</th>
                  <th className="px-5 py-3.5 font-heading text-label-sm uppercase tracking-wide text-on-surface-variant">Price</th>
                  <th className="px-5 py-3.5 font-heading text-label-sm uppercase tracking-wide text-on-surface-variant">Stock</th>
                  <th className="px-5 py-3.5 font-heading text-label-sm uppercase tracking-wide text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id || p.slug} className="border-b border-surface-variant/60 last:border-0 hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt="" className="h-12 w-12 object-cover rounded-lg border border-surface-variant bg-surface-container-low" />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-surface-container-high flex items-center justify-center text-outline">
                            <span className="material-symbols-outlined text-[20px]">image</span>
                          </div>
                        )}
                        <div>
                          <p className="font-heading text-primary font-semibold">{p.name}</p>
                          {p.name_hindi && <p className="font-body text-label-sm text-on-surface-variant" lang="hi">{p.name_hindi}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {p.category && (
                        <span className="inline-block bg-surface-container-high text-on-surface font-body text-label-sm px-2.5 py-1 rounded-full">
                          {p.category}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-body text-on-surface-variant">{p.price_label || 'Negotiable'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 font-heading text-label-sm px-2.5 py-1 rounded-full ${
                        p.in_stock ? 'bg-whatsapp/15 text-whatsapp-dark' : 'bg-error-container text-on-error-container'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">{p.in_stock ? 'check_circle' : 'cancel'}</span>
                        {p.in_stock ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => startEdit(p)}
                          aria-label={`Edit ${p.name}`}
                          className="inline-flex items-center gap-1 text-primary bg-surface-container-high hover:bg-surface-variant font-heading text-label-sm uppercase tracking-wide px-3 py-2 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          aria-label={`Delete ${p.name}`}
                          className="inline-flex items-center gap-1 text-error hover:bg-error-container font-heading text-label-sm uppercase tracking-wide px-3 py-2 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
