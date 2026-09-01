import Link from 'next/link';
import { siteConfig } from '@/lib/site';

// -----------------------------------------------------------------------------
// Shared shell for the Privacy Policy and Terms of Use pages.
//
// Both are long documents that people skim rather than read, so the layout
// leads with a plain-language summary, keeps a sticky contents list beside the
// text on desktop, and gives every section its own anchor so a specific clause
// can be linked to directly.
// -----------------------------------------------------------------------------

export type LegalSection = {
  /** URL fragment, e.g. "what-we-collect" → /privacy#what-we-collect */
  id: string;
  title: string;
  body: React.ReactNode;
};

/**
 * Styles the plain HTML inside each section from one place, so the page files
 * stay readable prose instead of a wall of repeated utility classes.
 */
const prose = [
  'space-y-4',
  '[&_p]:font-body [&_p]:text-body-md [&_p]:text-on-surface-variant [&_p]:leading-relaxed',
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2',
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2',
  '[&_li]:font-body [&_li]:text-body-md [&_li]:text-on-surface-variant [&_li]:leading-relaxed',
  '[&_strong]:text-primary [&_strong]:font-semibold',
  '[&_a]:text-secondary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-secondary-container',
].join(' ');

export function LegalPage({
  title,
  intro,
  summary,
  updated,
  sections,
}: {
  title: string;
  /** One paragraph under the H1, in the dark header band. */
  intro: string;
  /** Plain-language "the short version" bullets, shown before the full text. */
  summary: string[];
  /** Human-readable date, e.g. "1 September 2026". */
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      {/* Header band */}
      <section className="bg-primary text-on-primary py-14 md:py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <nav className="font-body text-label-sm text-primary-fixed-dim mb-3" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-tertiary-fixed">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-tertiary-fixed">{title}</span>
          </nav>
          <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg mb-4">{title}</h1>
          <p className="font-body text-body-lg text-primary-fixed-dim max-w-3xl">{intro}</p>
          <p className="font-body text-label-sm text-on-primary-container mt-6">
            Last updated: {updated}
          </p>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Contents */}
            <nav
              className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-32 bg-surface-container-lowest border border-outline-variant rounded-xl p-5"
              aria-label="On this page"
            >
              <h2 className="font-heading text-label-bold text-primary uppercase tracking-wide mb-3">
                On this page
              </h2>
              <ol className="space-y-2 list-decimal pl-5">
                {sections.map((s) => (
                  <li key={s.id} className="font-body text-body-md text-on-surface-variant">
                    <a
                      href={`#${s.id}`}
                      className="hover:text-secondary hover:underline underline-offset-4 transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Document */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* The short version */}
              <div className="bg-surface-container-low border-l-4 border-secondary rounded-r-xl p-6 mb-10">
                <h2 className="font-heading text-headline-md text-primary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">summarize</span>
                  The short version
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  {summary.map((point) => (
                    <li key={point} className="font-body text-body-md text-on-surface-variant leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="font-body text-label-sm text-outline mt-4">
                  This summary is for convenience only — the full text below is what applies.
                </p>
              </div>

              <div className="space-y-10">
                {sections.map((s, i) => (
                  <section key={s.id} id={s.id} className="scroll-mt-32">
                    <h2 className="font-heading text-headline-md text-primary mb-4 pb-3 border-b border-surface-variant">
                      <span className="text-secondary">{i + 1}.</span> {s.title}
                    </h2>
                    <div className={prose}>{s.body}</div>
                  </section>
                ))}
              </div>

              {/* Contact footer */}
              <div className="mt-12 bg-primary text-on-primary rounded-xl p-6 md:p-8">
                <h2 className="font-heading text-headline-md text-tertiary-fixed mb-4">
                  Questions about this page?
                </h2>
                <p className="font-body text-body-md text-on-primary-container mb-6">
                  Talk to us directly — we would rather answer a question than have you guess.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <a
                    href={siteConfig.telPrimary}
                    className="bg-secondary text-on-secondary px-5 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    {siteConfig.phones.primaryDisplay}
                  </a>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="bg-primary-container text-on-primary px-5 py-4 rounded font-heading text-label-bold uppercase tracking-wide hover:bg-primary-container/70 transition-colors flex items-center justify-center gap-2 break-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    Email us
                  </a>
                </div>
                <address className="font-body text-body-md text-on-primary-container not-italic">
                  <strong className="font-heading text-tertiary-fixed block mb-1">
                    {siteConfig.name}
                  </strong>
                  Prop. {siteConfig.proprietor}
                  <br />
                  {siteConfig.address.full}
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
