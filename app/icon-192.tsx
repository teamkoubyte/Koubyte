import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'
 
// Image generation - Verbeterd met duidelijkere K
export default function Icon192() {
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
          padding: '20px',
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
              fontSize: 100,
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

