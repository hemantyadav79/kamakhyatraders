import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LogoMark } from '@/components/Logo';
import { LoginForm } from '@/components/admin/LoginForm';

// Never index the admin area.
export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-margin-mobile py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <LogoMark className="h-16 w-16 mb-4" />
          <h1 className="font-heading text-headline-md text-primary">Admin Panel</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            Kamakhya Traders — authorised access only
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-surface-variant rounded shadow-sm p-6 md:p-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
