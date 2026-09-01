import { z } from 'zod';

// -----------------------------------------------------------------------------
// Shared validation schemas. Used on both the client (instant feedback) and the
// server (authoritative — never trust the client). Strict limits also blunt
// abuse (oversized payloads, injection attempts).
// -----------------------------------------------------------------------------

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number')
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, 'Phone can only contain numbers'),
  email: z.string().trim().email('Enter a valid email').max(120).optional().or(z.literal('')),
  product: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().min(5, 'Please add a short message').max(2000),
  // Honeypot: real users leave this empty; bots tend to fill every field.
  // Accepted by the schema on purpose — the route decides what to do with it.
  // Rejecting it here instead would fail validation with a raw Zod message
  // ("String must contain at most 0 character(s)"), which both tells a bot it
  // was caught and blocks a real customer whose browser autofilled the hidden
  // field. The route silently drops a filled honeypot instead.
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

// -----------------------------------------------------------------------------
// Customer reviews.
// `publicReviewSchema` is what a visitor may send to /api/reviews — note it
// carries no status field, so nobody can self-approve a review by crafting the
// request. The status is decided on the server by the abuse filter.
// -----------------------------------------------------------------------------

export const publicReviewSchema = z.object({
  productId: z.string().uuid('Unknown product'),
  author: z.string().trim().min(2, 'Please enter your name').max(80),
  rating: z.coerce.number().int().min(1, 'Please choose a rating').max(5),
  comment: z
    .string()
    .trim()
    .min(5, 'Please write a few words about the material')
    .max(1000, 'Please keep your review under 1000 characters'),
  // Honeypot: real visitors leave this empty; bots fill every field. Accepted
  // here and dealt with in the route — see the note on `company` above.
  website: z.string().max(200).optional(),
});

export type PublicReviewInput = z.infer<typeof publicReviewSchema>;

/** What the owner may change from the admin panel. */
export const adminReviewUpdateSchema = z
  .object({
    author: z.string().trim().min(1, 'Reviewer name is required').max(80).optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    comment: z.string().trim().max(1000).optional().or(z.literal('')),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update.' });

export type AdminReviewUpdate = z.infer<typeof adminReviewUpdateSchema>;

const usesFromString = z
  .union([z.array(z.string()), z.string()])
  .transform((v) =>
    Array.isArray(v)
      ? v
      : v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
  );

export const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Slug: lowercase letters, numbers and hyphens only'),
  name: z.string().trim().min(2).max(80),
  name_hindi: z.string().trim().max(80).optional().or(z.literal('')),
  category: z.string().trim().max(60).optional().or(z.literal('')),
  summary: z.string().trim().max(240).optional().or(z.literal('')),
  description: z.string().trim().max(4000).optional().or(z.literal('')),
  uses: usesFromString.optional(),
  unit: z.string().trim().max(60).optional().or(z.literal('')),
  price_label: z.string().trim().max(60).optional().or(z.literal('')),
  image: z.string().trim().max(600).optional().or(z.literal('')),
  image_alt: z.string().trim().max(160).optional().or(z.literal('')),
  images: z.array(z.string().trim().max(600)).max(12).optional(),
  in_stock: z.coerce.boolean().optional(),
  badge: z.string().trim().max(40).optional().or(z.literal('')),
  sort_order: z.coerce.number().int().min(0).max(9999).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
