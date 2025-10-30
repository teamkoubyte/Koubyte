import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
// Image generation - Verbeterd met duidelijkere K en styling
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
          padding: '20px',
        }}
      >
        {/* Wit vierkant voor contrast */}
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            borderRadius: '10%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Blauwe K */}
          <div
            style={{
              fontSize: 90,
              color: '#2563eb',
              fontWeight: '900',
              fontFamily: 'Arial, Helvetica, sans-serif',
              letterSpacing: '-5px',
            }}
          >
            K
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

