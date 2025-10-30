import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'
 
// Image generation - Verbeterd met duidelijkere K
export default function Icon512() {
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
          borderRadius: '15%',
          padding: '50px',
        }}
      >
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
          <div
            style={{
              fontSize: 280,
              color: '#2563eb',
              fontWeight: '900',
              fontFamily: 'Arial, Helvetica, sans-serif',
              letterSpacing: '-10px',
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

