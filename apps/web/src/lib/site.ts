// -----------------------------------------------------------------------------
// Central site configuration. Everything that could change (domain, phone,
// WhatsApp) is read from environment variables so nothing is hardcoded in the
// UI. The literal fallbacks below are only a safety net so links never break if
// an env var is momentarily missing — the env value always wins.
// -----------------------------------------------------------------------------

const PHONE_PRIMARY = process.env.NEXT_PUBLIC_BUSINESS_PHONE_PRIMARY || '919835989984';
const PHONE_SECONDARY = process.env.NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY || '917979171462';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PHONE_PRIMARY;

/** Format a bare country-coded number (e.g. 919835989984) as +91 98359 89984. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    const n = digits.slice(2);
    return `+91 ${n.slice(0, 5)} ${n.slice(5)}`;
  }
  return `+${digits}`;
}

export const siteConfig = {
  name: 'Kamakhya Traders',
  proprietor: 'Gajendra Kumar',
  tagline: 'Behtareen Quality • Uchit Mulya • Aapki Santushti Hamari Pehchan',
  taglineEn: 'Best Quality • Fair Price • Your Satisfaction is Our Identity',
  shortDescription:
    'Kamakhya Traders — building materials supplier at Neora, near Railway Gumti, Patna (Bihar). Cement, iron rods, stone chips (gitti), sand (balu), bricks, bamboo & plywood at fair prices. Serving Neora, Danapur, Bihta, Khagaul & Patna.',

  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),

  phones: {
    primary: PHONE_PRIMARY,
    secondary: PHONE_SECONDARY,
    primaryDisplay: formatPhone(PHONE_PRIMARY),
    secondaryDisplay: formatPhone(PHONE_SECONDARY),
    whatsapp: WHATSAPP,
  },

  // tel: / wa.me helpers
  telPrimary: `tel:+${PHONE_PRIMARY.replace(/\D/g, '')}`,
  telSecondary: `tel:+${PHONE_SECONDARY.replace(/\D/g, '')}`,
  whatsappLink: (message?: string) =>
    `https://wa.me/${WHATSAPP.replace(/\D/g, '')}${
      message ? `?text=${encodeURIComponent(message)}` : ''
    }`,

  address: {
    line1: 'Neora, Near Railway Gumti',
    area: 'Danapur',
    city: 'Patna',
    state: 'Bihar',
    postalCode: '801113',
    country: 'IN',
    full: 'Neora, Near Railway Gumti, Patna, Bihar – 801113',
    serviceArea: ['Neora', 'Danapur', 'Bihta', 'Khagaul', 'Patna', 'Phulwari Sharif'],
    // Geo coordinates (from the shop's Google Maps pin) — strong local-SEO signal.
    lat: 25.5759647,
    lng: 84.9881771,
    // Google Maps: short link for "Get Directions", embed URL for the map iframe.
    mapLink: 'https://maps.app.goo.gl/Pb4a8YEKzRkcTcFG8',
    mapEmbed: 'https://maps.google.com/maps?q=25.5759647,84.9881771&z=16&output=embed',
  },

  email: process.env.CONTACT_TO_EMAIL || 'kamakhyatradeshouse@gmail.com',

  hours: {
    days: 'Monday – Sunday',
    time: '7:00 AM – 6:00 PM',
  },

  nav: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
