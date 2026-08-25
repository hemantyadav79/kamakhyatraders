'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { siteConfig } from '@/lib/site';
import { Logo, LogoMark } from '@/components/Logo';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      {/* Top utility bar */}
      <div className="hidden sm:block bg-primary text-on-primary">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 flex justify-between items-center gap-4">
          <div className="flex items-center gap-5 font-body text-label-sm text-primary-fixed-dim">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">location_on</span>
              {siteConfig.address.area}, {siteConfig.address.city}
            </span>
            <span className="hidden lg:flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">schedule</span>
              {siteConfig.hours.days}, {siteConfig.hours.time}
            </span>
          </div>
          <div className="flex items-center gap-5 font-body text-label-sm">
            <a href={siteConfig.telPrimary} className="flex items-center gap-1.5 hover:text-tertiary-fixed transition-colors">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">call</span>
              {siteConfig.phones.primaryDisplay}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="hidden md:flex items-center gap-1.5 hover:text-tertiary-fixed transition-colors">
              <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">mail</span>
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="bg-surface border-b-2 border-primary">
      <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3.5 md:py-4">
        <Link href="/" aria-label={`${siteConfig.name} home`} className="shrink-0">
          <Logo className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 items-center" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative font-heading text-label-bold uppercase tracking-wide transition-colors py-1 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-secondary after:transition-all after:duration-300 hover:text-secondary ${
                isActive(item.href)
                  ? 'text-secondary after:w-full'
                  : 'text-primary after:w-0 hover:after:w-full'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href={siteConfig.telPrimary}
            className="bg-secondary text-on-secondary px-6 py-3 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            Call Now
          </a>
        </div>

        {/* Animated hamburger button (mobile) */}
        <button
          type="button"
          className="md:hidden relative z-[70] h-11 w-11 flex items-center justify-center rounded-lg text-primary hover:bg-surface-container-high transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="relative block h-4 w-6" aria-hidden="true">
            <span
              className={`absolute left-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 block h-0.5 w-6 rounded-full bg-current transition-all duration-200 ease-in-out ${
                open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                open ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0'
              }`}
            />
          </span>
        </button>
      </div>
      </div>

      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-[55] bg-primary/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in drawer */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`md:hidden fixed top-0 right-0 z-[60] h-[100dvh] w-[82%] max-w-[340px] bg-primary text-on-primary shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-tint/30">
          <LogoMark className="h-10 w-10" />
          <div className="leading-tight">
            <p className="font-heading text-tertiary-fixed font-bold text-lg">Kamakhya Traders</p>
            <p className="font-body text-label-sm text-primary-fixed-dim">Building Materials</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 flex flex-col px-4 py-4" aria-label="Mobile">
          {siteConfig.nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
              className={`group flex items-center justify-between px-3 py-4 rounded-lg font-heading text-label-bold uppercase tracking-wide transition-all duration-300 ${
                open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              } ${
                isActive(item.href)
                  ? 'text-tertiary-fixed bg-primary-container'
                  : 'text-on-primary hover:bg-primary-container hover:text-tertiary-fixed'
              }`}
            >
              {item.label}
              <span
                className={`material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1 ${
                  isActive(item.href) ? 'text-tertiary-fixed' : 'text-primary-fixed-dim'
                }`}
              >
                chevron_right
              </span>
            </Link>
          ))}
        </nav>

        {/* Call + WhatsApp actions */}
        <div className="px-4 pb-8 pt-4 border-t border-surface-tint/30 space-y-3">
          <a
            href={siteConfig.telPrimary}
            className="w-full bg-secondary text-on-secondary px-5 py-3.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            Call {siteConfig.phones.primaryDisplay}
          </a>
          <a
            href={siteConfig.whatsappLink('Hello Kamakhya Traders, I would like to enquire about building materials.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-whatsapp text-white px-5 py-3.5 rounded-lg font-heading text-label-bold uppercase tracking-wide hover:bg-whatsapp-dark transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M16.003 3C9.373 3 4 8.373 4 15c0 2.115.553 4.1 1.52 5.82L4 29l8.37-1.49A11.9 11.9 0 0016.003 27C22.63 27 28 21.627 28 15S22.63 3 16.003 3zm0 21.6a9.55 9.55 0 01-4.87-1.33l-.35-.21-3.61.64.64-3.52-.23-.36A9.56 9.56 0 016.4 15c0-5.29 4.31-9.6 9.603-9.6 5.29 0 9.597 4.31 9.597 9.6 0 5.29-4.307 9.6-9.597 9.6zm5.27-7.19c-.29-.145-1.71-.845-1.975-.94-.265-.097-.458-.145-.65.144-.193.29-.746.94-.915 1.135-.168.193-.337.217-.626.072-.29-.145-1.223-.45-2.33-1.437-.86-.767-1.44-1.714-1.61-2.004-.168-.29-.018-.446.127-.59.13-.13.29-.338.435-.507.145-.17.193-.29.29-.483.097-.193.048-.362-.024-.507-.072-.145-.65-1.566-.89-2.146-.235-.563-.473-.486-.65-.495l-.553-.01c-.193 0-.507.072-.772.362s-1.012.99-1.012 2.41 1.036 2.795 1.18 2.988c.145.193 2.04 3.114 4.943 4.367.69.298 1.23.476 1.65.61.693.22 1.323.19 1.822.115.556-.083 1.71-.698 1.951-1.372.24-.674.24-1.252.168-1.372-.072-.12-.264-.193-.553-.338z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
