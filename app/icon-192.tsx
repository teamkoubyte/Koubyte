import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon192() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
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

