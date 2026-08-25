'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

type Slide = { url: string; alt?: string };
type Hero = { overlay: number; autoplay: boolean; interval: number; slides: Slide[] };

const DEFAULT: Hero = { overlay: 55, autoplay: true, interval: 5, slides: [] };

type About = { image: string; imageAlt: string };

export function HeroSettings() {
  const [hero, setHero] = useState<Hero>(DEFAULT);
  const [about, setAbout] = useState<About>({ image: '', imageAlt: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [hRes, aRes] = await Promise.all([
        fetch('/api/admin/settings/hero'),
        fetch('/api/admin/settings/about'),
      ]);
      const hData = await hRes.json().catch(() => ({}));
      const aData = await aRes.json().catch(() => ({}));
      if (hRes.ok) setHero({ ...DEFAULT, ...hData.hero });
      else setError(hData.error || 'Could not load settings.');
      if (aRes.ok && aData.about) {
        setAbout({ image: aData.about.image || '', imageAlt: aData.about.imageAlt || '' });
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Signed upload to Cloudinary; returns the hosted URL (or null).
  async function cldUpload(file: File): Promise<string | null> {
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
    const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
      method: 'POST',
      body: fd,
    });
    const upData = await up.json().catch(() => ({}));
    if (up.ok && upData.secure_url) return upData.secure_url as string;
    setError(upData?.error?.message || 'Upload failed.');
    return null;
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError('');
    try {
      const url = await cldUpload(file);
      if (url) {
        setHero((h) => ({ ...h, slides: [...h.slides, { url, alt: '' }] }));
        setNotice('Hero image added.');
      }
    } finally {
      setUploading(false);
    }
  }

  async function uploadAbout(file: File) {
    setUploading(true);
    setError('');
    try {
      const url = await cldUpload(file);
      if (url) {
        setAbout((a) => ({ ...a, image: url }));
        setNotice('About photo added.');
      }
    } finally {
      setUploading(false);
    }
  }

  function removeSlide(i: number) {
    setHero((h) => ({ ...h, slides: h.slides.filter((_, idx) => idx !== i) }));
  }
  function move(i: number, dir: -1 | 1) {
    setHero((h) => {
      const s = [...h.slides];
      const j = i + dir;
      if (j < 0 || j >= s.length) return h;
      [s[i], s[j]] = [s[j], s[i]];
      return { ...h, slides: s };
    });
  }
  function setAlt(i: number, alt: string) {
    setHero((h) => ({ ...h, slides: h.slides.map((s, idx) => (idx === i ? { ...s, alt } : s)) }));
  }

  async function save() {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const [hRes, aRes] = await Promise.all([
        fetch('/api/admin/settings/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hero),
        }),
        fetch('/api/admin/settings/about', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(about),
        }),
      ]);
      if (hRes.ok && aRes.ok) {
        setNotice('Saved! Your homepage and About page are updated.');
      } else {
        const hData = await hRes.json().catch(() => ({}));
        const aData = await aRes.json().catch(() => ({}));
        setError(hData.error || aData.error || 'Could not save.');
      }
    } catch {
      setError('Network error while saving.');
    } finally {
      setSaving(false);
    }
  }

  const preview = hero.slides[0];

  return (
    <div className="min-h-screen bg-surface-container-low pb-16">
      {/* Header */}
      <header className="bg-primary text-on-primary shadow-lg">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-tertiary-fixed leading-none">Site Images</h1>
            <p className="font-body text-label-sm text-primary-fixed-dim mt-1">Homepage banner &amp; About page photo</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin-gunnu-org" className="bg-primary-container text-on-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container/70 transition-colors inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Products
            </Link>
            <button onClick={save} disabled={saving || uploading} className="bg-secondary text-on-secondary px-5 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors disabled:opacity-60 inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">save</span>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8">
        {notice && (
          <div className="bg-whatsapp/10 border border-whatsapp/40 text-on-surface px-4 py-3 rounded-lg mb-4 font-body flex items-center gap-2">
            <span className="material-symbols-outlined text-whatsapp text-[20px]">check_circle</span>{notice}
          </div>
        )}
        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg mb-4 font-body flex items-center gap-2" role="alert">
            <span className="material-symbols-outlined text-[20px]">error</span>{error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-3 justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin">progress_activity</span> Loading…
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: controls */}
            <div className="space-y-6">
              {/* Info */}
              <div className="bg-surface-container-high/60 border border-outline-variant rounded-xl p-4 font-body text-body-md text-on-surface-variant">
                Upload one or more images to turn the homepage banner into a carousel. Upload
                <strong className="text-primary"> none</strong> and the site shows its built-in design.
              </div>

              {/* Slides */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-headline-md text-primary">Carousel Images</h2>
                  <label className="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container transition-colors cursor-pointer inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    {uploading ? 'Uploading…' : 'Add Image'}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ''; }} />
                  </label>
                </div>

                {hero.slides.length === 0 ? (
                  <p className="font-body text-body-md text-on-surface-variant py-8 text-center">
                    No images yet — the homepage will show the built-in design.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {hero.slides.map((s, i) => (
                      <li key={s.url + i} className="flex items-center gap-3 border border-surface-variant rounded-lg p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.url} alt="" className="h-16 w-24 object-cover rounded-md border border-surface-variant shrink-0" />
                        <input
                          value={s.alt || ''}
                          onChange={(e) => setAlt(i, e.target.value)}
                          placeholder="Describe the image (for SEO/accessibility)"
                          className="flex-1 bg-surface-container-low border-b-2 border-surface-variant focus:border-primary px-3 py-2 rounded-t outline-none font-body text-body-md min-w-0"
                        />
                        <div className="flex flex-col shrink-0">
                          <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="text-outline hover:text-primary disabled:opacity-30 p-0.5"><span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span></button>
                          <button onClick={() => move(i, 1)} disabled={i === hero.slides.length - 1} aria-label="Move down" className="text-outline hover:text-primary disabled:opacity-30 p-0.5"><span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span></button>
                        </div>
                        <button onClick={() => removeSlide(i)} aria-label="Remove" className="text-error hover:bg-error-container rounded-lg p-2 shrink-0"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Overlay + autoplay */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="font-heading text-label-bold text-primary uppercase tracking-wide">Overlay Darkness</label>
                    <span className="font-heading text-primary">{hero.overlay}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={hero.overlay}
                    onChange={(e) => setHero((h) => ({ ...h, overlay: Number(e.target.value) }))}
                    className="w-full accent-secondary" />
                  <p className="font-body text-label-sm text-on-surface-variant mt-1">Higher = darker overlay = text is easier to read over the photo.</p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 font-body text-body-md text-primary cursor-pointer">
                    <input type="checkbox" checked={hero.autoplay} onChange={(e) => setHero((h) => ({ ...h, autoplay: e.target.checked }))} className="w-5 h-5 accent-secondary" />
                    Auto-play carousel
                  </label>
                  <label className="flex items-center gap-2 font-body text-body-md text-primary">
                    Change every
                    <input type="number" min={2} max={30} value={hero.interval}
                      onChange={(e) => setHero((h) => ({ ...h, interval: Number(e.target.value) }))}
                      className="w-16 bg-surface-container-low border-b-2 border-surface-variant focus:border-primary px-2 py-1 rounded-t outline-none text-center" />
                    sec
                  </label>
                </div>
              </div>

              {/* About page photo */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center gap-3 mb-4">
                  <div>
                    <h2 className="font-heading text-headline-md text-primary">About Page Photo</h2>
                    <p className="font-body text-label-sm text-on-surface-variant">Shown in the box on the About page. No photo → built-in design.</p>
                  </div>
                  <label className="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    {about.image ? 'Replace' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAbout(f); e.target.value = ''; }} />
                  </label>
                </div>
                {about.image ? (
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={about.image} alt="" className="h-28 w-28 object-cover rounded-lg border border-surface-variant shrink-0" />
                    <div className="flex-1 min-w-0">
                      <input value={about.imageAlt}
                        onChange={(e) => setAbout((a) => ({ ...a, imageAlt: e.target.value }))}
                        placeholder="Describe the photo (for SEO/accessibility)"
                        className="w-full bg-surface-container-low border-b-2 border-surface-variant focus:border-primary px-3 py-2 rounded-t outline-none font-body text-body-md" />
                      <button onClick={() => setAbout({ image: '', imageAlt: '' })}
                        className="mt-3 inline-flex items-center gap-1 text-error hover:bg-error-container font-heading text-label-sm uppercase tracking-wide px-3 py-2 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        Remove photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="font-body text-body-md text-on-surface-variant py-4 text-center">No photo yet — the About page shows its built-in design.</p>
                )}
              </div>
            </div>

            {/* Right: live preview */}
            <div className="lg:sticky lg:top-6 self-start">
              <p className="font-heading text-label-bold text-on-surface-variant uppercase tracking-wide mb-2">Live Preview</p>
              <div className="relative rounded-xl overflow-hidden border border-outline-variant bg-primary aspect-[16/10]">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                )}
                {preview && <div className="absolute inset-0 bg-primary" style={{ opacity: hero.overlay / 100 }} />}
                {preview && <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent" />}
                <div className="relative z-10 p-6 h-full flex flex-col justify-center">
                  <p className="font-heading text-tertiary-fixed text-label-sm uppercase tracking-wide mb-2">Trusted Supplier</p>
                  <p className="font-heading text-on-primary text-2xl font-extrabold leading-tight">Strong Foundations Start with the Right Materials</p>
                </div>
              </div>
              <p className="font-body text-label-sm text-on-surface-variant mt-2">This is roughly how the homepage banner will look. Drag the overlay slider to adjust readability.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
