import { ImageResponse } from 'next/og'
 
// Image metadata - Grotere size voor betere weergave
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
// Image generation - Koubyte VOLLEDIG tekst logo (niet alleen K!)
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            fontSize: 36,
            color: '#1e40af',
            fontWeight: '600',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '-0.5px',
            textAlign: 'center',
            lineHeight: 1,
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

