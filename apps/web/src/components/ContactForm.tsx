'use client';

import { useState } from 'react';
import { contactSchema } from '@/lib/validation';

const productOptions = [
  'Cement', 'Iron Rods', 'Stone Chips (Gitti)', 'Sand (Balu)',
  'Bricks', 'Bamboo', 'Plywood', 'Other / Multiple',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    setFieldErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || ''),
      phone: String(fd.get('phone') || ''),
      email: String(fd.get('email') || ''),
      product: String(fd.get('product') || ''),
      message: String(fd.get('message') || ''),
      company: String(fd.get('company') || ''), // honeypot
    };

    // Client-side validation for instant feedback.
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setStatus('error');
      setErrorMsg('Please check the highlighted fields.');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMsg(data?.error || 'Something went wrong. Please call us instead.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please call us instead.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-8 text-center">
        <span className="material-symbols-outlined text-6xl text-whatsapp mb-4">check_circle</span>
        <h3 className="font-heading text-headline-md text-primary mb-2">Enquiry Sent!</h3>
        <p className="font-body text-body-md text-on-surface-variant mb-6">
          Thank you. We&apos;ve received your enquiry and will get back to you soon. For an urgent
          requirement, please call us directly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="font-heading text-label-bold text-secondary uppercase tracking-wide hover:text-secondary-container"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full bg-surface-container-low border-b-2 border-surface-variant focus:border-primary px-4 py-3 rounded-t transition-colors outline-none font-body text-body-md';

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {status === 'error' && errorMsg && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded font-body text-body-md" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Honeypot — hidden from humans, catches bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide">
            Your Name *
          </label>
          <input id="name" name="name" type="text" required placeholder="Enter your name" className={inputClass} />
          {fieldErrors.name && <p className="text-error font-body text-label-sm mt-1">{fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide">
            Phone Number *
          </label>
          <input id="phone" name="phone" type="tel" required placeholder="+91" className={inputClass} />
          {fieldErrors.phone && <p className="text-error font-body text-label-sm mt-1">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide">
            Email (optional)
          </label>
          <input id="email" name="email" type="email" placeholder="you@example.com" className={inputClass} />
          {fieldErrors.email && <p className="text-error font-body text-label-sm mt-1">{fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="product" className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide">
            Material Needed
          </label>
          <select id="product" name="product" className={inputClass} defaultValue="">
            <option value="" disabled>Select a material</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide">
          Your Requirement *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell us what you need — quantity, delivery location, timeline..."
          className={`${inputClass} resize-none`}
        />
        {fieldErrors.message && <p className="text-error font-body text-label-sm mt-1">{fieldErrors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-secondary text-on-secondary py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed accent-shadow-gold-sm flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          'Sending...'
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">send</span>
            Send Enquiry
          </>
        )}
      </button>

      <p className="font-body text-label-sm text-on-surface-variant text-center">
        We never share your details. Prefer to talk? Just call or WhatsApp us.
      </p>
    </form>
  );
}
