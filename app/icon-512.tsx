import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'
 
// Image generation - Koubyte tekst logo
export default function Icon512() {
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
          borderRadius: '15%',
        }}
      >
        <div
          style={{
            fontSize: 95,
            color: '#2563eb',
            fontWeight: '700',
            fontFamily: 'Arial, Helvetica, sans-serif',
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

