import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

// Site-wide social share image (WhatsApp / Facebook / Twitter previews).
export const alt = `${siteConfig.name} — Building Materials in Patna & Danapur`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0d2137 0%, #000917 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 16,
              border: '4px solid #fdbc0a',
              background: '#000917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffdea3',
              fontSize: 48,
              fontWeight: 800,
            }}
          >
            KT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#ffffff', fontSize: 68, fontWeight: 800, lineHeight: 1 }}>
              KAMAKHYA
            </div>
            <div style={{ color: '#ff6b6b', fontSize: 68, fontWeight: 800, lineHeight: 1 }}>
              TRADERS
            </div>
          </div>
        </div>

        <div style={{ marginTop: 44, color: '#b5c8e5', fontSize: 36, maxWidth: 900 }}>
          Cement • Iron Rods • Gitti • Balu • Bricks • Bamboo • Plywood
        </div>

        <div
          style={{
            marginTop: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ background: '#bb0114', color: '#fff', fontSize: 28, fontWeight: 700, padding: '10px 24px', borderRadius: 6 }}>
            Patna • Danapur
          </div>
          <div style={{ color: '#ffdea3', fontSize: 30, fontWeight: 700 }}>
            {siteConfig.phones.primaryDisplay}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
