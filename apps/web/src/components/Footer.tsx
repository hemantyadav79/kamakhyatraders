import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { LogoMark } from '@/components/Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary border-t-4 border-tertiary-fixed">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        {/* Brand */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <span className="font-heading text-headline-md font-bold text-tertiary-fixed leading-none">
              Kamakhya
              <br />
              Traders
            </span>
          </div>
          <p className="font-body text-body-md text-on-primary-container opacity-80">
            Your trusted partner for cement, iron rods, gitti, balu, bricks,
            bamboo &amp; plywood in Patna &amp; Danapur.
          </p>
          <p className="font-body text-label-sm text-on-primary-container opacity-70">
            Prop. {siteConfig.proprietor}
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading text-label-bold text-tertiary-fixed uppercase tracking-wider">
            Contact
          </h4>
          <ul className="space-y-3 font-body text-body-md text-on-primary-container opacity-90">
            <li>
              <a href={siteConfig.telPrimary} className="flex items-center gap-2 hover:text-tertiary-fixed transition-colors">
                <span className="material-symbols-outlined text-[18px]">call</span>
                {siteConfig.phones.primaryDisplay}
              </a>
            </li>
            <li>
              <a href={siteConfig.telSecondary} className="flex items-center gap-2 hover:text-tertiary-fixed transition-colors">
                <span className="material-symbols-outlined text-[18px]">call</span>
                {siteConfig.phones.secondaryDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-tertiary-fixed transition-colors break-all">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] mt-0.5">location_on</span>
              <span>{siteConfig.address.full}</span>
            </li>
          </ul>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading text-label-bold text-tertiary-fixed uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-3 font-body text-body-md text-on-primary-container opacity-90">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-tertiary-fixed hover:underline underline-offset-4 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading text-label-bold text-tertiary-fixed uppercase tracking-wider">
            Business Hours
          </h4>
          <ul className="space-y-3 font-body text-body-md text-on-primary-container opacity-90">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              {siteConfig.hours.time}
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">event_available</span>
              {siteConfig.hours.days}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-tint/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col sm:flex-row justify-between gap-2 text-center sm:text-left">
          <p className="font-body text-label-sm text-on-primary-container opacity-60">
            © {year} {siteConfig.name}. All Rights Reserved.
          </p>
          <p className="font-body text-label-sm text-on-primary-container opacity-60">
            {siteConfig.taglineEn}
          </p>
        </div>
      </div>
    </footer>
  );
}
