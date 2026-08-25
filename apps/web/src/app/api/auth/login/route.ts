import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  verifyCredentials,
  createSessionToken,
  setSessionCookie,
} from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  // Brute-force protection: 5 attempts per 15 min per IP.
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter username and password.' }, { status: 422 });
  }

  const { username, password } = parsed.data;
  if (!verifyCredentials(username, password)) {
    // Generic message — don't reveal which field was wrong.
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  }

  const token = await createSessionToken(username);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true }, { status: 200 });
}
