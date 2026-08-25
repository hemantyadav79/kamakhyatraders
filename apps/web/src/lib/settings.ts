import 'server-only';
import { getSupabasePublic } from '@/lib/supabase';

// -----------------------------------------------------------------------------
// Hero section settings. Stored as one JSON row in the `site_settings` table
// under key = 'hero'. Managed from the admin panel. If Supabase isn't set up,
// or no slides are uploaded, the hero falls back to the built-in design.
// -----------------------------------------------------------------------------

export type HeroSlide = { url: string; alt?: string };

export type HeroSettings = {
  overlay: number; // 0–100: darkness of the overlay over the image (readability)
  autoplay: boolean;
  interval: number; // seconds between slides
  slides: HeroSlide[];
};

export const defaultHeroSettings: HeroSettings = {
  overlay: 55,
  autoplay: true,
  interval: 5,
  slides: [],
};

function sanitize(raw: unknown): HeroSettings {
  const v = (raw ?? {}) as Partial<HeroSettings>;
  const slides = Array.isArray(v.slides)
    ? v.slides
        .filter((s) => s && typeof s.url === 'string' && s.url.length > 0)
        .map((s) => ({ url: s.url, alt: typeof s.alt === 'string' ? s.alt : '' }))
    : [];
  return {
    overlay: clamp(Number(v.overlay ?? 55), 0, 100),
    autoplay: v.autoplay !== false,
    interval: clamp(Number(v.interval ?? 5), 2, 30),
    slides,
  };
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export async function getHeroSettings(): Promise<HeroSettings> {
  const supabase = getSupabasePublic();
  if (!supabase) return defaultHeroSettings;

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'hero')
    .maybeSingle();

  if (error || !data) return defaultHeroSettings;
  return sanitize(data.value);
}

export { sanitize as sanitizeHeroSettings };

// -----------------------------------------------------------------------------
// About page photo. Optional — if no image is set, the About page shows its
// built-in design.
// -----------------------------------------------------------------------------

export type AboutSettings = { image: string; imageAlt: string };

export const defaultAboutSettings: AboutSettings = { image: '', imageAlt: '' };

function sanitizeAbout(raw: unknown): AboutSettings {
  const v = (raw ?? {}) as Partial<AboutSettings>;
  return {
    image: typeof v.image === 'string' ? v.image : '',
    imageAlt: typeof v.imageAlt === 'string' ? v.imageAlt : '',
  };
}

export async function getAboutSettings(): Promise<AboutSettings> {
  const supabase = getSupabasePublic();
  if (!supabase) return defaultAboutSettings;

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'about')
    .maybeSingle();

  if (error || !data) return defaultAboutSettings;
  return sanitizeAbout(data.value);
}

export { sanitizeAbout as sanitizeAboutSettings };
