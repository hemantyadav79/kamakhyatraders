import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  // Middleware already guards this route; this is a second safety check.
  const session = await getSession();
  if (!session) redirect('/admin-gunnu-org/login');

  return <AdminDashboard username={session.username} />;
}
