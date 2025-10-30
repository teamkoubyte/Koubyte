import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation - Verbeterd met duidelijkere K
export default function Icon() {
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
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: 'white',
            fontWeight: '900',
            fontFamily: 'Arial, Helvetica, sans-serif',
            letterSpacing: '-2px',
          }}
        >
          K
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

