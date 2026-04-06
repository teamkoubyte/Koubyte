import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Service } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import ServiceDetailClient from './ServiceDetailClient'

// Dynamische metadata per service
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  let service = null
  try {
    service = await prisma.service.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error loading service metadata:', error)
  }

  if (!service) {
    return {
      title: 'Dienst niet gevonden - Koubyte',
    }
  }

  return {
    title: `${service.name} - €${service.price.toFixed(2).replace('.', ',')} | Koubyte IT-diensten`,
    description: service.description,
    keywords: `${service.name}, ${service.category}, IT diensten, Koubyte, ${service.name.toLowerCase()}`,
    openGraph: {
      title: service.name,
      description: service.description,
      type: 'website',
      url: `https://koubyte.be/diensten/${service.id}`,
    },
  }
}

// Server Component - fetch data
export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let service = null
  try {
    service = await prisma.service.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error loading service:', error)
  }

  if (!service) {
    notFound()
  }

  // Haal gerelateerde diensten op (zelfde categorie, max 3)
  let relatedServices: Service[] = []
  try {
    relatedServices = await prisma.service.findMany({
      where: {
        category: service.category,
        id: { not: service.id }, // Exclusief huidige service
      },
      take: 3,
      orderBy: { featured: 'desc' },
    })
  } catch (error) {
    console.error('Error loading related services:', error)
  }

  // Genereer structured data voor deze service
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Koubyte',
      url: 'https://koubyte.be',
      telephone: '+32484522662',
      email: 'info@koubyte.be',
    },
    category: service.category,
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://koubyte.be/diensten/${id}`,
    },
    ...(service.duration && {
      serviceOutput: service.duration,
    }),
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Client Component voor interactieve features */}
      <ServiceDetailClient service={service} relatedServices={relatedServices} />
    </>
  )
}

