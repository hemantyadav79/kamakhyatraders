import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { timingSafeEqual, createHash } from 'crypto';

// -----------------------------------------------------------------------------
// Admin authentication for the hidden panel (/admin-gunnu-org).
// Credentials live in env (ADMIN_USERNAME / ADMIN_PASSWORD). On success we set a
// short-lived, signed, HttpOnly cookie — no password is ever stored client-side.
// -----------------------------------------------------------------------------

export const SESSION_COOKIE = 'kt_admin_session';
const SESSION_HOURS = 8;

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET is missing or too short. Set a long random value in .env.local',
    );
  }
  return new TextEncoder().encode(secret);
}

/** Constant-time string comparison (avoids timing attacks on credentials). */
function safeEqual(a: string, b: string): boolean {
  const ah = createHash('sha256').update(a).digest();
  const bh = createHash('sha256').update(b).digest();
  return timingSafeEqual(ah, bh);
}

export function verifyCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || '';
  const expectedPass = process.env.ADMIN_PASSWORD || '';
  if (!expectedUser || !expectedPass) return false;
  // Evaluate both to keep timing constant regardless of which is wrong.
  const okUser = safeEqual(username, expectedUser);
  const okPass = safeEqual(password, expectedPass);
  return okUser && okPass;
}

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({ role: 'admin', sub: username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getSecret());
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
}

/** Returns the admin username if the current request has a valid session. */
export async function getSession(): Promise<{ username: string } | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== 'admin' || typeof payload.sub !== 'string') return null;
    return { username: payload.sub };
  } catch {
    return null;
  }
}

/** Lightweight token validity check used by middleware (Edge runtime). */
export async function isValidToken(token: string, secret: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
