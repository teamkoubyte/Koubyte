import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon512() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 280,
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          borderRadius: '15%',
        }}
      >
        K
      </div>
    ),
    {
      ...size,
    }
  )
}

