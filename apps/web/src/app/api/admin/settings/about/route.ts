import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

const aboutSchema = z.object({
  image: z.string().url().max(600).optional().or(z.literal('')),
  imageAlt: z.string().max(160).optional().or(z.literal('')),
});

function notConfigured() {
  return NextResponse.json(
    { error: 'Database not configured. Add your Supabase keys to .env.local.' },
    { status: 503 },
  );
}

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) return notConfigured();
  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfigured();

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'about')
    .maybeSingle();

  if (error) {
    console.error('[admin/settings]', error);
    return NextResponse.json({ error: 'Could not save settings.' }, { status: 500 });
  }
  return NextResponse.json({ about: data?.value ?? { image: '', imageAlt: '' } });
}

export async function PUT(req: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSupabaseConfigured()) return notConfigured();
  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfigured();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = aboutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid about settings.' },
      { status: 422 },
    );
  }

  const value = { image: parsed.data.image || '', imageAlt: parsed.data.imageAlt || '' };
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'about', value, updated_at: new Date().toISOString() });

  if (error) {
    console.error('[admin/settings]', error);
    return NextResponse.json({ error: 'Could not save settings.' }, { status: 500 });
  }

  revalidatePath('/about');
  return NextResponse.json({ ok: true, about: value });
}
