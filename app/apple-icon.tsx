import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
// Image generation - Koubyte tekst logo
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: '#1e40af',
            fontWeight: '600',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            letterSpacing: '0px',
          }}
        >
          Koubyte
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

