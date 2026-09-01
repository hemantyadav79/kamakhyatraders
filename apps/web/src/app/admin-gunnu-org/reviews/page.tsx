import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { ReviewsManager } from '@/components/admin/ReviewsManager';

export const metadata: Metadata = {
  title: 'Customer Reviews',
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage() {
  // Middleware already guards this route; this is a second safety check.
  const session = await getSession();
  if (!session) redirect('/admin-gunnu-org/login');

  return <ReviewsManager username={session.username} />;
}
