import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

const heroSchema = z.object({
  overlay: z.coerce.number().min(0).max(100),
  autoplay: z.coerce.boolean(),
  interval: z.coerce.number().min(2).max(30),
  slides: z
    .array(
      z.object({
        url: z.string().url().max(600),
        alt: z.string().max(160).optional().or(z.literal('')),
      }),
    )
    .max(10),
});

function notConfigured() {
  return NextResponse.json(
    { error: 'Database not configured. Add your Supabase keys to .env.local.' },
    { status: 503 },
  );
}

// Read current hero settings.
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
    .eq('key', 'hero')
    .maybeSingle();

  if (error) {
    console.error('[admin/settings]', error);
    return NextResponse.json({ error: 'Could not save settings.' }, { status: 500 });
  }
  return NextResponse.json({
    hero: data?.value ?? { overlay: 55, autoplay: true, interval: 5, slides: [] },
  });
}

// Save hero settings.
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

  const parsed = heroSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid hero settings.' },
      { status: 422 },
    );
  }

  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'hero', value: parsed.data, updated_at: new Date().toISOString() });

  if (error) {
    console.error('[admin/settings]', error);
    return NextResponse.json({ error: 'Could not save settings.' }, { status: 500 });
  }

  revalidatePath('/'); // refresh the homepage hero immediately
  return NextResponse.json({ ok: true, hero: parsed.data });
}
