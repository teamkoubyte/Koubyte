import { ImageResponse } from 'next/og'
 
// Image metadata
export const alt = 'Koubyte - Professionele IT-diensten'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
// Image generation
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
          position: 'relative',
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '300px',
            height: '300px',
            background: 'rgba(37, 99, 235, 0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '300px',
            height: '300px',
            background: 'rgba(148, 163, 184, 0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              fontSize: '80px',
              fontWeight: 'bold',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <span
              style={{
                color: '#2563eb',
              }}
            >
              Kou
            </span>
            <span
              style={{
                color: '#1e293b',
              }}
            >
              byte
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1e293b',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.2,
              marginBottom: '20px',
            }}
          >
            Professionele IT-diensten
          </div>

          <div
            style={{
              fontSize: '32px',
              color: '#64748b',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Betrouwbare oplossingen voor particulieren en bedrijven
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '50px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  background: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                }}
              >
                ✓
              </div>
              <span
                style={{
                  fontSize: '24px',
                  color: '#1e293b',
                  fontWeight: 600,
                }}
              >
                Snel & Betrouwbaar
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  background: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                }}
              >
                ✓
              </div>
              <span
                style={{
                  fontSize: '24px',
                  color: '#1e293b',
                  fontWeight: 600,
                }}
              >
                Transparante Prijzen
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}

