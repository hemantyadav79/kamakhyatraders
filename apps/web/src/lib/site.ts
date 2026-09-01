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
    'Kamakhya Traders — building materials supplier in Danapur, Patna (Bihar), at Neora near Railway Gumti. Cement, iron rods, stone chips (gitti), sand (balu), bricks, bamboo & plywood at fair prices. Serving Danapur, Neora, Khagaul, Bihta, Phulwari Sharif & all of Patna.',

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
    // "Danapur" is part of the written address on purpose: Google matches a
    // business to a locality partly on the address shown across the site, and
    // most customers search "Danapur", not "Neora".
    full: 'Neora, Near Railway Gumti, Danapur, Patna, Bihar – 801113',
    serviceArea: [
      'Neora',
      'Danapur',
      'Khagaul',
      'Bihta',
      'Patna',
      'Phulwari Sharif',
      'Maner',
      'Saguna More',
      'Rupaspur',
      'Digha',
    ],
    // Geo coordinates of the shop's Google Maps pin — strong local-SEO signal.
    lat: 25.5762009,
    lng: 84.9904572,
    mapLink: 'https://maps.app.goo.gl/yWJDBvu5q3n9Xxjh6',
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

// -----------------------------------------------------------------------------
// Google Maps links, all derived from the single pin in `address` above.
//
// The old "Get Directions" link was a Maps share URL whose place name was empty
// (.../maps/place//@lat,lng), which opens Maps centred on the area but with no
// marker and no place card — it looked like the location was missing. These
// links always show the pin.
// -----------------------------------------------------------------------------

const PIN = `${siteConfig.address.lat},${siteConfig.address.lng}`;

/**
 * Map shown in the iframe on the Contact page. The `(Name)` suffix is Maps'
 * label syntax, so the marker is captioned with the shop name instead of
 * dropping an anonymous pin.
 */
export const mapEmbedUrl =
  `https://maps.google.com/maps?q=${PIN}(${encodeURIComponent(siteConfig.name)})` +
  `&z=17&hl=en&output=embed`;

/**
 * "Get Directions". Uses the documented Maps URL API, which opens turn-by-turn
 * navigation to the pin from wherever the visitor is — the thing someone
 * actually wants when they tap Directions.
 */
export const mapDirectionsUrl =
  `https://www.google.com/maps/dir/?api=1&destination=${PIN}`;

/** "Open in Google Maps" — the shop's own shared Maps link. */
export const mapPlaceUrl: string = siteConfig.address.mapLink;
