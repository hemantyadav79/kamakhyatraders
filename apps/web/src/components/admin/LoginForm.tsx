'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ADMIN_BASE = '/admin-gunnu-org';

/**
 * Only ever redirect to a path inside the admin panel. Without this check a
 * crafted link (?from=https://evil.example) would send the user off-site
 * immediately after logging in — a classic phishing vector.
 */
function safeRedirect(raw: string | null): string {
  if (!raw) return ADMIN_BASE;
  // Reject anything that isn't a plain, single-slash-rooted path.
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\')) return ADMIN_BASE;
  if (!raw.startsWith(ADMIN_BASE)) return ADMIN_BASE;
  return raw;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = safeRedirect(searchParams.get('from'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.replace(from);
        router.refresh();
      } else {
        setError(data?.error || 'Login failed.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full bg-surface-container-low border-b-2 border-surface-variant focus:border-primary px-4 py-3 rounded-t outline-none font-body text-body-md';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded font-body text-body-md" role="alert">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="username" className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide">
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block font-heading text-label-bold text-primary mb-2 uppercase tracking-wide">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-on-primary py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container transition-colors disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
