'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbsProps {
  customLabels?: Record<string, string>
}

export default function Breadcrumbs({ customLabels = {} }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Don't show breadcrumbs on homepage or admin pages
  if (pathname === '/' || pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    return null
  }

  // Split path into segments
  const segments = pathname.split('/').filter(Boolean)

  // Default labels voor Nederlandse routes
  const defaultLabels: Record<string, string> = {
    'diensten': 'Diensten',
    'about': 'Over Ons',
    'contact': 'Contact',
    'pricing': 'Prijzen',
    'faq': 'Veelgestelde Vragen',
    'book': 'Afspraak Boeken',
    'review': 'Review Schrijven',
    'dashboard': 'Dashboard',
    'privacy': 'Privacy Beleid',
    'terms': 'Algemene Voorwaarden',
    'checkout': 'Afrekenen',
    'success': 'Succesvol',
  }

  const labels = { ...defaultLabels, ...customLabels }

  // Build breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    const label = labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    const isLast = index === segments.length - 1

    return { path, label, isLast }
  })

  // Structured data voor Google Rich Results
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://koubyte.be',
      },
      ...breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: crumb.label,
        item: `https://koubyte.be${crumb.path}`,
      })),
    ],
  }

  return (
    <>
      {/* Structured Data voor SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <ol className="flex items-center gap-2 text-sm">
            {/* Home */}
            <li>
              <Link
                href="/"
                className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>

            {breadcrumbs.map((crumb) => (
              <li key={crumb.path} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-slate-400" />
                {crumb.isLast ? (
                  <span className="text-slate-900 font-medium" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  )
}

