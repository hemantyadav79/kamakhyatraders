import { ImageResponse } from 'next/og';

// Generated PNG used when someone adds the site to an iOS/Android home screen.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000917',
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 34,
            border: '7px solid #fdbc0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000917',
          }}
        >
          {/* Red roof */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '34px solid transparent',
              borderRight: '34px solid transparent',
              borderBottom: '30px solid #bb0114',
              marginBottom: 6,
            }}
          />
          {/* Pillars */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 14, height: 44, borderRadius: 3, background: '#ffdea3' }} />
            <div style={{ width: 14, height: 44, borderRadius: 3, background: '#ffffff' }} />
            <div style={{ width: 14, height: 44, borderRadius: 3, background: '#ffdea3' }} />
          </div>
          {/* Base */}
          <div style={{ width: 74, height: 8, borderRadius: 3, background: '#fdbc0a', marginTop: 6 }} />
        </div>
      </div>
    ),
    size,
  );
}
