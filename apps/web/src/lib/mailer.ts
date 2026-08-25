import 'server-only';
import nodemailer from 'nodemailer';
import type { ContactInput } from '@/lib/validation';
import { siteConfig } from '@/lib/site';

// -----------------------------------------------------------------------------
// Gmail SMTP mailer for the contact form. Uses a Gmail App Password (not the
// account password). All values come from env. Returns false (never throws to
// the caller) so the API route can respond cleanly.
// -----------------------------------------------------------------------------

export function isMailerConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendContactEmail(data: ContactInput): Promise<boolean> {
  if (!isMailerConfigured()) {
    console.warn('[mailer] SMTP not configured — skipping email send.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER!;
  const safe = {
    name: escapeHtml(data.name),
    phone: escapeHtml(data.phone),
    email: data.email ? escapeHtml(data.email) : '—',
    product: data.product ? escapeHtml(data.product) : '—',
    message: escapeHtml(data.message).replace(/\n/g, '<br/>'),
  };

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e3e5;border-radius:8px;overflow:hidden">
      <div style="background:#000917;padding:20px 24px">
        <h2 style="margin:0;color:#ffdea3;font-size:20px">New Enquiry — ${siteConfig.name}</h2>
      </div>
      <div style="padding:24px;color:#181c1e;font-size:15px;line-height:1.6">
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Phone:</strong> <a href="tel:${safe.phone}">${safe.phone}</a></p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Product of interest:</strong> ${safe.product}</p>
        <p><strong>Message:</strong><br/>${safe.message}</p>
      </div>
      <div style="background:#f1f4f6;padding:14px 24px;font-size:12px;color:#44474d">
        Sent from the ${siteConfig.name} website contact form.
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"${siteConfig.name} Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: data.email || undefined,
    subject: `New Enquiry from ${data.name}${data.product ? ` — ${data.product}` : ''}`,
    text:
      `New enquiry from ${siteConfig.name} website\n\n` +
      `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || '—'}\n` +
      `Product: ${data.product || '—'}\n\nMessage:\n${data.message}\n`,
    html,
  });

  return true;
}
