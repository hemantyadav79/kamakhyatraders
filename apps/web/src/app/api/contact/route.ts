import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation';
import { sendContactEmail, isMailerConfigured } from '@/lib/mailer';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  // Rate limit: max 5 enquiries per 10 minutes per IP.
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many enquiries. Please try again later or call us directly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Please check your details.' },
      { status: 422 },
    );
  }

  // Honeypot: if the hidden "company" field is filled, silently accept (drop).
  if (parsed.data.company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!isMailerConfigured()) {
    // Don't leak config state; ask the user to call instead.
    return NextResponse.json(
      { error: 'Enquiry form is not available right now. Please call or WhatsApp us.' },
      { status: 503 },
    );
  }

  try {
    await sendContactEmail(parsed.data);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[contact] send failed:', err);
    return NextResponse.json(
      { error: 'Could not send your enquiry. Please call or WhatsApp us instead.' },
      { status: 502 },
    );
  }
}
