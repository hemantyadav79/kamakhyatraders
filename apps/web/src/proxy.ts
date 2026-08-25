import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// -----------------------------------------------------------------------------
// Proxy (formerly "middleware"). Guards the hidden admin panel: any
// /admin-gunnu-org/* route (except the login page) requires a valid signed
// session cookie, otherwise the visitor is redirected to the login screen.
// Runs before the page is rendered.
// -----------------------------------------------------------------------------

const ADMIN_BASE = '/admin-gunnu-org';
const LOGIN_PATH = `${ADMIN_BASE}/login`;
const SESSION_COOKIE = 'kt_admin_session';

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith(ADMIN_BASE)) {
    // Allow the login page itself.
    if (pathname === LOGIN_PATH) {
      // If already logged in, bounce to the dashboard.
      if (await hasValidSession(req)) {
        return NextResponse.redirect(new URL(ADMIN_BASE, req.url));
      }
      return NextResponse.next();
    }

    if (!(await hasValidSession(req))) {
      const url = new URL(LOGIN_PATH, req.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin-gunnu-org/:path*'],
};
