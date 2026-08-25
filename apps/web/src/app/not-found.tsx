import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <p className="font-heading text-display-lg text-secondary">404</p>
        <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mt-2 mb-4">
          Page Not Found
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant max-w-lg mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to our materials.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-primary text-on-primary px-8 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container transition-colors">
            Go Home
          </Link>
          <Link href="/products" className="bg-secondary text-on-secondary px-8 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors">
            View Products
          </Link>
        </div>
      </div>
    </section>
  );
}
