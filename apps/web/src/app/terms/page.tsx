import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, type LegalSection } from '@/components/LegalPage';
import { siteConfig } from '@/lib/site';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';

// -----------------------------------------------------------------------------
// Terms of Service (Terms of Use).
//
// Important framing: nothing is sold through this website. There is no cart, no
// checkout and no online payment — every sale happens at the shop or over the
// phone. So these terms govern USE OF THE WEBSITE, and say plainly that what is
// shown here is an invitation to enquire rather than a binding offer. Writing
// them as e-commerce terms would describe a business that does not exist.
// -----------------------------------------------------------------------------

const UPDATED = '1 September 2026';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Service',
  description: `The terms for using the Kamakhya Traders website — how product information and prices should be read, the rules for posting a customer review, and the limits of what this website does. Building materials supplier in Danapur, Patna.`,
  path: '/terms',
  keywords: ['Kamakhya Traders terms of service', 'building materials website terms of use'],
});

const sections: LegalSection[] = [
  {
    id: 'about-these-terms',
    title: 'About these terms',
    body: (
      <>
        <p>
          These terms apply to your use of the website at{' '}
          {siteConfig.url.replace(/^https?:\/\//, '')}, operated by{' '}
          <strong>{siteConfig.name}</strong>, proprietor <strong>{siteConfig.proprietor}</strong>, of{' '}
          {siteConfig.address.full}.
        </p>
        <p>
          By using this website you accept these terms. If you do not accept them, please do not use
          the site — you are always welcome to call us or visit the shop instead.
        </p>
        <p>
          They should be read together with our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'what-this-website-is',
    title: 'What this website is — and what it is not',
    body: (
      <>
        <p>
          This website is a <strong>catalogue and contact point</strong>. It shows the materials we
          stock, tells you where we are and lets you send us an enquiry.
        </p>
        <p>
          <strong>You cannot buy anything on this website.</strong> There is no shopping cart, no
          checkout and no online payment. Every purchase is agreed and completed directly with us —
          on the phone, on WhatsApp, or in person at the shop. Anything shown here is an invitation
          for you to get in touch, not an offer capable of being accepted online.
        </p>
        <p>
          If anyone ever asks you to pay money through this website, or sends you a payment link
          claiming to be from us, <strong>it is not us</strong>. Call us on the number in the footer
          to check before paying anything.
        </p>
      </>
    ),
  },
  {
    id: 'prices-and-availability',
    title: 'Product information, prices and availability',
    body: (
      <>
        <p>
          We describe our materials as accurately as we can, but please treat everything on the site
          as a guide rather than a guarantee:
        </p>
        <ul>
          <li>
            <strong>Prices are not fixed.</strong> Rates for cement, sariya, gitti and balu move
            constantly. That is why the site says &ldquo;Negotiable&rdquo; and asks you to call — the
            rate we quote you on the phone or at the shop is the real one.
          </li>
          <li>
            <strong>Stock can change.</strong> An item marked available may have been sold since the
            page was last updated. Please confirm before travelling to us or planning around it.
          </li>
          <li>
            <strong>Photographs are illustrative.</strong> Colour, size and finish of natural
            materials such as bricks, stone chips, sand and bamboo vary from load to load.
          </li>
          <li>
            Brand names shown belong to their respective owners and are used only to describe what
            we stock.
          </li>
        </ul>
        <p>
          Nothing on this page limits any right you have as a consumer under the Consumer Protection
          Act, 2019 or any other law, in respect of goods we actually sell you.
        </p>
      </>
    ),
  },
  {
    id: 'enquiries',
    title: 'Enquiries',
    body: (
      <>
        <p>
          Sending an enquiry through the <Link href="/contact">contact form</Link> starts a
          conversation — it does not place an order and does not reserve stock. Nothing is confirmed
          until we have spoken and agreed the material, quantity, rate and delivery.
        </p>
        <p>
          Please give us correct contact details, and only send an enquiry on behalf of someone else
          if you are entitled to. We aim to reply quickly, but if your requirement is urgent, call us
          — that is always faster.
        </p>
      </>
    ),
  },
  {
    id: 'reviews',
    title: 'Customer reviews',
    body: (
      <>
        <p>
          Anyone can post a review on a product page. Because reviews help other customers decide,
          we ask you to keep them honest and fair. When you post one, you confirm that:
        </p>
        <ul>
          <li>
            it is your <strong>genuine opinion</strong>, based on material you actually bought from
            us;
          </li>
          <li>
            you are not a competitor, and you have not been paid or induced by anyone to write it;
          </li>
          <li>
            it contains no abuse, threats, obscenity, or content targeting anyone&rsquo;s religion,
            caste, sex or community;
          </li>
          <li>
            it contains no advertising, links, or other people&rsquo;s personal details;
          </li>
          <li>it is not false, defamatory or unlawful.</li>
        </ul>
        <p>
          <strong>Moderation.</strong> Reviews are screened automatically, and anything that looks
          abusive or like spam is held back for us to check before it can appear. We may edit a
          review for clarity or to remove offending content, hide it, or delete it. We will not,
          however, delete a review simply for being critical — an honest complaint is fair, and we
          would rather read it than hide it.
        </p>
        <p>
          By posting a review you give us permission to publish, keep and display it on this website
          in connection with our business. You keep ownership of what you wrote, and you can ask us
          to take your review down at any time.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <>
        <p>Please use the site normally and in good faith. You must not:</p>
        <ul>
          <li>
            send spam, bulk or automated submissions through the enquiry or review forms;
          </li>
          <li>
            attempt to gain access to the admin area, any account, server or database;
          </li>
          <li>
            probe, scan, overload or otherwise interfere with the running of the site, or introduce
            malicious code;
          </li>
          <li>
            scrape or copy the site&rsquo;s content wholesale, or impersonate us or anyone else;
          </li>
          <li>use the site for anything unlawful.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Content and intellectual property',
    body: (
      <>
        <p>
          The {siteConfig.name} name and logo, the site&rsquo;s design, text and product photographs
          are ours or used with permission. Please do not copy or reuse them for your own business
          without asking us first.
        </p>
        <p>
          You are of course welcome to link to any page on this site, print a page for your own use,
          or share it with someone who needs building materials.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-links',
    title: 'Links to other services',
    body: (
      <p>
        Some buttons take you to services we do not control — WhatsApp for messaging, Google Maps
        for directions, and our web developer&rsquo;s site in the footer. Once you leave this
        website, that service&rsquo;s own terms and privacy policy apply, and we are not responsible
        for its content or availability.
      </p>
    ),
  },
  {
    id: 'availability',
    title: 'Availability of the site',
    body: (
      <p>
        We try to keep the site working, but we cannot promise it will always be available or free
        of errors. It may be unavailable during maintenance or because of problems at our hosting or
        internet providers, and we may change, suspend or withdraw any part of it. If the site is
        down and you need materials, please just call us.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Our responsibility to you',
    body: (
      <>
        <p>
          The information on this website is provided in good faith for general guidance. Because
          construction requirements differ from site to site, please confirm quantities, grades and
          suitability with us — or with your engineer or contractor — before relying on anything you
          read here.
        </p>
        <p>
          To the extent the law allows, we are not liable for loss caused by relying on general
          information on this site, or by the site being unavailable. Nothing in these terms limits
          or excludes our liability where it cannot lawfully be limited or excluded, including for
          death or personal injury caused by our negligence, for fraud, or under the Consumer
          Protection Act, 2019.
        </p>
        <p>
          <strong>
            Our responsibility for the materials we actually sell you is not affected by this page
          </strong>{' '}
          — that is governed by the sale itself and by law. If something we supplied is not right,
          tell us and we will sort it out.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of India. Any dispute relating to this website will be
        subject to the exclusive jurisdiction of the courts at Patna, Bihar.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these terms from time to time. The current version is always the one on this
        page, and the &ldquo;last updated&rdquo; date at the top tells you when it changed.
        Continuing to use the site after a change means you accept the updated terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <>
        <p>If anything here is unclear, ask us — we would rather explain than have you guess.</p>
        <ul>
          <li>
            Phone: <a href={siteConfig.telPrimary}>{siteConfig.phones.primaryDisplay}</a> or{' '}
            <a href={siteConfig.telSecondary}>{siteConfig.phones.secondaryDisplay}</a>
          </li>
          <li>
            Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </li>
          <li>Shop: {siteConfig.address.full}</li>
          <li>
            Open: {siteConfig.hours.days}, {siteConfig.hours.time}
          </li>
        </ul>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Terms of Service', path: '/terms' },
            ]),
          ),
        }}
      />
      <LegalPage
        title="Terms of Service"
        intro="The rules for using this website. In short: it is a catalogue and a way to reach us — the actual buying happens when we speak."
        updated={UPDATED}
        summary={[
          'Nothing is sold on this website. There is no cart, no checkout and no online payment — every sale is agreed with us directly.',
          'Nobody from Kamakhya Traders will ever ask you to pay through this site. If someone does, it is not us — call us and check.',
          'Prices shown are negotiable and rates change daily. Call for the real rate; stock can also change without notice.',
          'Sending an enquiry starts a conversation. It is not an order and does not reserve stock until we confirm.',
          'Reviews must be your genuine experience. We may hide or remove abusive or fake ones — but not honest criticism.',
          'Indian law applies, and the courts at Patna have jurisdiction.',
        ]}
        sections={sections}
      />
    </>
  );
}
