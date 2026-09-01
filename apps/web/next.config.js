/** @type {import('next').NextConfig} */

// -----------------------------------------------------------------------------
// Security headers — applied to every response. Hardens the site against
// clickjacking, MIME sniffing, referrer leakage, and restricts what the browser
// is allowed to load (Content-Security-Policy).
// -----------------------------------------------------------------------------
const isDev = process.env.NODE_ENV !== 'production';

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects small inline bootstrap scripts; 'unsafe-inline' is required
  // for them to run. No remote script hosts are allowed. In development React
  // additionally needs 'unsafe-eval' for its debugging tooling — never in prod.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  // Tailwind / Next inject inline styles; Google Fonts stylesheet is allowed.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  // Images: our own domain, Cloudinary (product images), and data/blob URIs.
  "img-src 'self' data: blob: https://res.cloudinary.com",
  // XHR/fetch: our own API + Supabase + Cloudinary upload endpoint.
  "connect-src 'self' https://*.supabase.co https://api.cloudinary.com",
  // Allow embedding the Google Maps iframe on the Contact page.
  // maps.google.com redirects the embed to www.google.com/maps/embed — and for
  // visitors in India it can land on the .co.in country domain instead. Listing
  // only the two .com hosts meant that redirect was blocked by CSP and the map
  // rendered as an empty box, so both Google domains are allowed here.
  // Still Google-only: no other third party may be framed.
  "frame-src https://*.google.com https://*.google.co.in",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    // Geolocation is granted to the embedded Google Map only (never to this
    // site itself), so "Directions from your location" works inside the map.
    // The browser still asks the visitor for permission first.
    value:
      'camera=(), microphone=(), geolocation=("https://www.google.com" "https://www.google.co.in"), browsing-topics=()',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't advertise "X-Powered-By: Next.js"
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  // NOTE: the apex ↔ www redirect is intentionally NOT handled here. Vercel's
  // domain settings already redirect kamakhyatraders.shop -> www at the edge
  // (before this app ever runs). Adding an opposite redirect in this file
  // would create an infinite redirect loop with that platform-level setting.
  // Fix the direction in Vercel → Settings → Domains instead (see README),
  // and keep NEXT_PUBLIC_SITE_URL in sync with whichever host is primary.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
