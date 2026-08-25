import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createUploadSignature, isCloudinaryConfigured } from '@/lib/cloudinary';

export const runtime = 'nodejs';

// Returns a short-lived signature so the admin browser can upload an image
// directly to Cloudinary without ever seeing the API secret.
export async function POST() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: 'Cloudinary not configured. Add your Cloudinary keys to .env.local.' },
      { status: 503 },
    );
  }

  const sig = createUploadSignature();
  return NextResponse.json(sig);
}
