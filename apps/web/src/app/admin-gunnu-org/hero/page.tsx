import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { HeroSettings } from '@/components/admin/HeroSettings';

export const metadata: Metadata = {
  title: 'Hero Section',
  robots: { index: false, follow: false },
};

export default async function AdminHeroPage() {
  const session = await getSession();
  if (!session) redirect('/admin-gunnu-org/login');
  return <HeroSettings />;
}
