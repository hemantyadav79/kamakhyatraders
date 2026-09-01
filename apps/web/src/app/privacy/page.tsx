import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, type LegalSection } from '@/components/LegalPage';
import { siteConfig } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';

// -----------------------------------------------------------------------------
// Privacy Policy.
//
// Written to describe what this site actually does, not a generic template:
// there are no visitor cookies, no accounts, no online payments, and the
// enquiry form is emailed rather than stored in a database. Every claim here
// was checked against the code and the live response headers — if the site's
// behaviour changes, this page has to change with it.
// -----------------------------------------------------------------------------

const UPDATED = '1 September 2026';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description: `How Kamakhya Traders, Danapur, Patna handles your information when you use this website — what we collect through the enquiry form and customer reviews, who else processes it, how long we keep it, and how to contact us about it.`,
  path: '/privacy',
  keywords: ['Kamakhya Traders privacy policy', 'building materials website privacy'],
});

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <>
        <p>
          This website is operated by <strong>{siteConfig.name}</strong>, a building materials
          supplier run by proprietor <strong>{siteConfig.proprietor}</strong>, at{' '}
          {siteConfig.address.full}.
        </p>
        <p>
          In this policy, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; mean {siteConfig.name}.
          &ldquo;You&rdquo; means anyone visiting {siteConfig.url.replace(/^https?:\/\//, '')}.
        </p>
        <p>
          You can reach us on <a href={siteConfig.telPrimary}>{siteConfig.phones.primaryDisplay}</a>{' '}
          or <a href={siteConfig.telSecondary}>{siteConfig.phones.secondaryDisplay}</a>, by email at{' '}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>, or in person at the shop.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect, and why',
    body: (
      <>
        <p>
          We only collect information you choose to give us. There is no account to create and
          nothing to sign up for.
        </p>
        <p>
          <strong>a. When you send an enquiry</strong> through the{' '}
          <Link href="/contact">contact form</Link>, we collect your name, phone number, the
          material you are asking about and your message. Your email address is optional. This is
          sent to our own email inbox so that we can reply to you with a rate or availability. It is
          not added to any mailing list and we do not send marketing messages.
        </p>
        <p>
          <strong>b. When you write a product review</strong>, we collect the name you type, your
          star rating and your review text. Please note this is <strong>published publicly</strong>{' '}
          on the product page for anyone to read, including search engines — so use only the name
          you are happy to have shown, and do not put your phone number, address or any other
          personal detail in the review text. We do not ask for or store your email or phone number
          with a review.
        </p>
        <p>
          <strong>c. Technical information.</strong> Like every website, our server briefly sees the
          IP address your request comes from. We use it only to count how many enquiries or reviews
          have come from one place in the last hour, so that automated spam can be slowed down. It
          is held in temporary memory for that purpose and is not written to a database, not linked
          to your enquiry, and not used to identify you.
        </p>
        <p>
          <strong>d. Visitor statistics.</strong> We use privacy-friendly analytics to see roughly
          how many people visit and which pages are popular. It does not use cookies, does not
          follow you to other websites, and gives us aggregate counts rather than anything about you
          individually.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-dont-do',
    title: 'What we do not do',
    body: (
      <>
        <p>To be plain about it:</p>
        <ul>
          <li>
            We do not <strong>sell, rent or trade</strong> your information to anybody.
          </li>
          <li>
            We do not take <strong>payments on this website</strong>. All buying and selling happens
            at the shop or over the phone, so we never receive your card, UPI or bank details
            through this site.
          </li>
          <li>
            We do not run <strong>advertising</strong> on this site, and we do not use advertising
            or re-targeting trackers.
          </li>
          <li>
            We do not build a <strong>profile</strong> of you or follow you across other websites.
          </li>
          <li>
            We do not ask for <strong>sensitive information</strong> — no ID numbers, no financial
            details, no biometrics.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body: (
      <>
        <p>
          <strong>This website does not set any cookies on ordinary visitors&rsquo; devices.</strong>{' '}
          That is why you will not see a cookie consent banner here — there is nothing to consent
          to. The one cookie the site can set is a login cookie for the owner&rsquo;s private admin
          screen, which is never issued to visitors.
        </p>
        <p>
          The one exception is the <strong>Google Map</strong> embedded on our{' '}
          <Link href="/contact">Contact page</Link>. That map is loaded from Google, and Google may
          set its own cookies or read device information inside it, under Google&rsquo;s privacy
          policy rather than ours. If you would rather not load it, simply do not open the Contact
          page — every other page works without it, and our address and phone number are in the
          footer of every page anyway.
        </p>
      </>
    ),
  },
  {
    id: 'who-else',
    title: 'Who else handles your information',
    body: (
      <>
        <p>
          We are a small business and do not run our own servers. The following companies process
          information on our behalf, each under their own privacy terms:
        </p>
        <ul>
          <li>
            <strong>Vercel</strong> — hosts the website and provides the cookieless visitor
            statistics.
          </li>
          <li>
            <strong>Supabase</strong> — the database that stores the product catalogue and published
            customer reviews.
          </li>
          <li>
            <strong>Cloudinary</strong> — stores and delivers the product photographs.
          </li>
          <li>
            <strong>Google</strong> — supplies the fonts used across the site and the map on the
            Contact page, and delivers the enquiry emails to our inbox.
          </li>
        </ul>
        <p>
          If you contact us through <strong>WhatsApp</strong> by tapping a button on this site, that
          conversation happens inside WhatsApp and is governed by WhatsApp&rsquo;s own privacy
          policy, not this one.
        </p>
        <p>
          Beyond these, we would only share your information if we were required to by law, by a
          court, or by a government authority entitled to ask for it.
        </p>
      </>
    ),
  },
  {
    id: 'how-long',
    title: 'How long we keep it',
    body: (
      <>
        <ul>
          <li>
            <strong>Enquiries</strong> stay in our email inbox as a record of the conversation. We
            remove them when they are no longer needed, and you can ask us to delete yours at any
            time.
          </li>
          <li>
            <strong>Reviews</strong> stay published until you or we remove them.
          </li>
          <li>
            <strong>IP addresses</strong> used for spam protection are discarded automatically
            within the hour.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    body: (
      <>
        <p>
          Indian data protection law, including the Digital Personal Data Protection Act, 2023,
          gives you rights over information about you. In practice, you can ask us to:
        </p>
        <ul>
          <li>tell you what information about you we hold;</li>
          <li>correct anything that is wrong;</li>
          <li>
            delete it — for example, to take down a review you posted, or to remove an old enquiry;
          </li>
          <li>explain how we used it.</li>
        </ul>
        <p>
          Just call us or send an email and tell us what you want done. There is no form and no
          charge. We may need to ask a question or two to be sure we are speaking to the right
          person before we delete something, and we aim to deal with any request within 30 days.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'How we protect it',
    body: (
      <>
        <p>
          The whole site is served over an encrypted HTTPS connection. Our admin screen is password
          protected and is not linked from anywhere on the public site. Reviews are checked
          automatically for abuse and spam before they can appear, and both the enquiry form and the
          review form are rate limited to slow down automated misuse.
        </p>
        <p>
          No website can promise perfect security, and we will not pretend otherwise. What we can
          say is that we deliberately collect as little as possible, which is the most reliable
          protection there is.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <p>
        This is a website for a building materials business and is meant for adults doing
        construction work. It is not directed at children, and we do not knowingly collect
        information about anyone under 18. If you believe a child has sent us information, tell us
        and we will delete it.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        If we change how the website handles information, we will update this page and change the
        &ldquo;last updated&rdquo; date at the top. Any significant change takes effect from the
        date shown there.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact and complaints',
    body: (
      <>
        <p>
          For anything to do with this policy or your information, contact the proprietor,{' '}
          <strong>{siteConfig.proprietor}</strong>, who handles these requests personally:
        </p>
        <ul>
          <li>
            Phone: <a href={siteConfig.telPrimary}>{siteConfig.phones.primaryDisplay}</a>
          </li>
          <li>
            Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </li>
          <li>Post: {siteConfig.address.full}</li>
        </ul>
        <p>
          If you are not satisfied with how we have dealt with your concern, you may escalate it to
          the Data Protection Board of India.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Privacy Policy', path: '/privacy' },
            ]),
          ),
        }}
      />
      <LegalPage
        title="Privacy Policy"
        intro="We collect as little as we can, we never sell it, and this page explains exactly what happens to anything you do send us."
        updated={UPDATED}
        summary={[
          'We only get information you actually type in — an enquiry or a product review. There is no account and nothing to sign up for.',
          'This site sets no cookies on your device, so there is no consent banner. Only the Google Map on the Contact page may set its own.',
          'Enquiries go straight to our email so we can reply. We never sell your details or add you to a marketing list.',
          'Reviews are published publicly with the name you type, so do not put personal details in them.',
          'No payments are taken on this website, so we never see your card, UPI or bank details.',
          'You can ask us to show, correct or delete anything about you — just call or email.',
        ]}
        sections={sections}
      />
    </>
  );
}
