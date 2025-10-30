import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation - Koubyte tekst logo (klein formaat: KB)
export default function Icon() {
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
            fontSize: 11,
            color: '#1e40af',
            fontWeight: '600',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            letterSpacing: '0px',
          }}
        >
          KB
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

