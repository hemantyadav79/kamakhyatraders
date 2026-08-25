import { siteConfig } from '@/lib/site';

// Fixed WhatsApp button, bottom-right on every page. Opens a chat with the shop's
// primary number, pre-filled with a friendly enquiry message.
export function WhatsAppFloat() {
  const href = siteConfig.whatsappLink(
    'Hello Kamakhya Traders, I would like to enquire about building materials.',
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed z-50 bottom-5 right-5 md:bottom-7 md:right-7 flex items-center gap-2 group"
    >
      <span className="hidden md:inline-block bg-primary text-on-primary text-label-sm font-heading px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat on WhatsApp
      </span>
      <span className="relative flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-whatsapp shadow-xl hover:bg-whatsapp-dark transition-colors">
        {/* Subtle attention ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-whatsapp opacity-40 motion-safe:animate-ping" />
        <svg
          className="relative h-8 w-8 md:h-9 md:w-9"
          viewBox="0 0 32 32"
          fill="#ffffff"
          aria-hidden="true"
        >
          <path d="M16.003 3C9.373 3 4 8.373 4 15c0 2.115.553 4.1 1.52 5.82L4 29l8.37-1.49A11.9 11.9 0 0016.003 27C22.63 27 28 21.627 28 15S22.63 3 16.003 3zm0 21.6a9.55 9.55 0 01-4.87-1.33l-.35-.21-3.61.64.64-3.52-.23-.36A9.56 9.56 0 016.4 15c0-5.29 4.31-9.6 9.603-9.6 5.29 0 9.597 4.31 9.597 9.6 0 5.29-4.307 9.6-9.597 9.6zm5.27-7.19c-.29-.145-1.71-.845-1.975-.94-.265-.097-.458-.145-.65.144-.193.29-.746.94-.915 1.135-.168.193-.337.217-.626.072-.29-.145-1.223-.45-2.33-1.437-.86-.767-1.44-1.714-1.61-2.004-.168-.29-.018-.446.127-.59.13-.13.29-.338.435-.507.145-.17.193-.29.29-.483.097-.193.048-.362-.024-.507-.072-.145-.65-1.566-.89-2.146-.235-.563-.473-.486-.65-.495l-.553-.01c-.193 0-.507.072-.772.362s-1.012.99-1.012 2.41 1.036 2.795 1.18 2.988c.145.193 2.04 3.114 4.943 4.367.69.298 1.23.476 1.65.61.693.22 1.323.19 1.822.115.556-.083 1.71-.698 1.951-1.372.24-.674.24-1.252.168-1.372-.072-.12-.264-.193-.553-.338z" />
        </svg>
      </span>
    </a>
  );
}
