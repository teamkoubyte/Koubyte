import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import CookieConsent from '@/components/CookieConsent'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Script from 'next/script'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/react'
import { prisma } from '@/lib/prisma'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

// Uitgebreide SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://koubyte.be'),
  title: {
    default: 'Koubyte - Professionele IT-diensten in België',
    template: '%s | Koubyte'
  },
  description: 'Koubyte biedt professionele IT-diensten voor particulieren en kleine bedrijven. Van hardware reparatie tot netwerkinstallaties, beveiliging en dataherstel. Snel, betrouwbaar en transparant.',
  keywords: ['IT-diensten', 'computer reparatie', 'laptop reparatie', 'netwerk installatie', 'wifi problemen', 'virus verwijderen', 'dataherstel', 'backup', 'IT-support', 'België', 'Vlaanderen', 'hardware', 'software'],
  authors: [{ name: 'Koubyte' }],
  creator: 'Koubyte',
  publisher: 'Koubyte',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // PWA Manifest
  manifest: '/manifest.json',
  // Theme color for mobile browsers
  themeColor: '#2563eb',
  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Koubyte',
  },
  // Icons (Next.js auto-generates from icon.tsx, apple-icon.tsx, etc.)
  icons: {
    icon: [
      { url: '/icon', sizes: '32x32' },
      { url: '/icon-192', sizes: '192x192' },
      { url: '/icon-512', sizes: '512x512' },
    ],
    apple: '/apple-icon',
  },
  openGraph: {
    type: 'website',
    locale: 'nl_BE',
    url: 'https://koubyte.be',
    title: 'Koubyte - Professionele IT-diensten',
    description: 'Betrouwbare IT-oplossingen voor particulieren en bedrijven. Hardware, software, netwerken en meer.',
    siteName: 'Koubyte',
    // Next.js auto-generates from opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Koubyte - Professionele IT-diensten',
    description: 'Betrouwbare IT-oplossingen voor particulieren en bedrijven',
    // Next.js auto-uses opengraph-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console verificatie
    // google: 'jouw-google-verificatie-code',
    // Bing Webmaster verificatie
    // other: {
    //   'msvalidate.01': 'jouw-bing-verificatie-code',
    // },
  },
}

// Dynamische Structured Data genereren met echte reviews uit database
async function getStructuredData() {
  try {
    // Haal statistieken en reviews uit database
    const [reviewsCount, averageRating] = await Promise.all([
      prisma.review.count({ where: { approved: true } }),
      prisma.review.aggregate({
        where: { approved: true },
        _avg: { rating: true },
      }),
    ])

    const hasReviews = reviewsCount > 0 && averageRating._avg.rating !== null

    // Base structured data
    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Koubyte',
      description: 'Professionele IT-diensten voor particulieren en kleine bedrijven',
      url: 'https://koubyte.be',
      telephone: '+32484522662',
      email: 'info@koubyte.be',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BE',
        addressLocality: 'België',
        addressRegion: 'Vlaanderen',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '51.2194',
        longitude: '4.4025',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      priceRange: '€€',
      sameAs: [
        'https://facebook.com/Koubyte',
        'https://x.com/Koubyte',
        'https://instagram.com/Koubyte',
        'https://linkedin.com/company/Koubyte',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'IT-diensten',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Hardware reparatie',
              description: 'Reparatie en vervanging van hardware componenten',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Software installatie',
              description: 'Installeren en configureren van software',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Netwerk installatie',
              description: 'Router configuratie en netwerkbeveiliging',
            },
          },
        ],
      },
    }

    // Voeg ECHTE aggregateRating toe als er reviews zijn
    if (hasReviews && averageRating._avg.rating) {
      structuredData.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: averageRating._avg.rating.toFixed(1),
        reviewCount: reviewsCount,
        bestRating: '5',
        worstRating: '1',
      }
    }

    return structuredData
  } catch (error) {
    console.error('Error generating structured data:', error)
    // Return basis structured data zonder ratings bij error
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Koubyte',
      description: 'Professionele IT-diensten voor particulieren en kleine bedrijven',
      url: 'https://koubyte.be',
      telephone: '+32484522662',
      email: 'info@koubyte.be',
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error('Error getting session:', error)
  }

  // Check of we op een admin route zitten OF user is admin
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminUser = session?.user?.role === 'admin'

  // Admin gebruikers zien NOOIT de klanten navbar/footer
  const showClientLayout = !isAdminRoute && !isAdminUser

  // Google Analytics ID
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

  // Genereer dynamische structured data met reviews
  const structuredData = await getStructuredData()

  return (
    <html lang="nl">
      <head>
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {/* Structured Data met echte reviews */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {/* Extra meta tags voor betere SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="canonical" href="https://koubyte.be" />
      </head>
      <body className={inter.className}>
        <Providers session={session}>
          {/* Toon klanten Navbar ALLEEN voor niet-admins */}
          {showClientLayout && <Navbar session={session} />}
          {/* Breadcrumbs voor navigatie en SEO */}
          {showClientLayout && <Breadcrumbs />}
          <main className="min-h-screen">
            {children}
          </main>
          {/* Toon Footer ALLEEN voor niet-admins */}
          {showClientLayout && <Footer />}
          <CookieConsent />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
