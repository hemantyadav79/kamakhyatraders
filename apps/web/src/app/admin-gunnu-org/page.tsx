import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { countPendingReviews } from '@/lib/reviews';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

// Always read the live pending count — a cached "0" would hide a waiting review.
export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  // Middleware already guards this route; this is a second safety check.
  const session = await getSession();
  if (!session) redirect('/admin-gunnu-org/login');

  const pendingReviews = await countPendingReviews();

  return <AdminDashboard username={session.username} pendingReviews={pendingReviews} />;
}
