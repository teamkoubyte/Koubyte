import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import CookieConsent from '@/components/CookieConsent'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Script from 'next/script'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/react'

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
  openGraph: {
    type: 'website',
    locale: 'nl_BE',
    url: 'https://koubyte.be',
    title: 'Koubyte - Professionele IT-diensten',
    description: 'Betrouwbare IT-oplossingen voor particulieren en bedrijven. Hardware, software, netwerken en meer.',
    siteName: 'Koubyte',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Koubyte IT-diensten',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Koubyte - Professionele IT-diensten',
    description: 'Betrouwbare IT-oplossingen voor particulieren en bedrijven',
    images: ['/og-image.jpg'],
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

// Structured Data voor SEO
const structuredData = {
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
  // AggregateRating wordt dynamisch toegevoegd via reviews
  // Geen fake ratings in structured data!
  sameAs: [
    // Social media links - Echte Koubyte accounts
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

  return (
    <html lang="nl">
      <head>
        {/* Structured Data */}
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
