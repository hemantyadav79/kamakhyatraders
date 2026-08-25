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
  company: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;

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

const reviewSchema = z.object({
  author: z.string().trim().min(1, 'Reviewer name is required').max(80),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional().or(z.literal('')),
  date: z.string().trim().max(20).optional().or(z.literal('')),
});

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
  reviews: z.array(reviewSchema).max(50).optional(),
  in_stock: z.coerce.boolean().optional(),
  badge: z.string().trim().max(40).optional().or(z.literal('')),
  sort_order: z.coerce.number().int().min(0).max(9999).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
