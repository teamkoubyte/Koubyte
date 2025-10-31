import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAdminNotificationEmail } from '@/lib/email'
import { z } from 'zod'
import { createErrorResponse } from '@/lib/api-error'

const quoteSchema = z.object({
  name: z.string().min(2, 'Naam is verplicht'),
  email: z.string().email('Ongeldig emailadres'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Service is verplicht'),
  description: z.string().min(10, 'Beschrijving moet minimaal 10 tekens bevatten'),
  estimatedPrice: z.number().optional(),
})

// GET: Haal alle offertes op (admin only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    // Check of estimatedPrice kolom bestaat
    try {
      const quotes = await prisma.quote.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json({ quotes }, { status: 200 })
    } catch (dbError: any) {
      // Kolom bestaat mogelijk niet - probeer zonder select
      if (dbError?.code === 'P2021' || dbError?.message?.includes('estimatedPrice')) {
        console.log('estimatedPrice kolom niet gevonden, haal quotes op zonder deze kolom')
        // Probeer opnieuw zonder estimatedPrice select (als deze niet bestaat in schema)
        const quotes = await prisma.quote.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            userId: true,
            name: true,
            email: true,
            phone: true,
            service: true,
            description: true,
            status: true,
            adminNotes: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        })
        // Voeg null estimatedPrice toe aan elk quote object
        const quotesWithNullPrice = quotes.map(quote => ({
          ...quote,
          estimatedPrice: null,
        }))
        return NextResponse.json({ quotes: quotesWithNullPrice }, { status: 200 })
      }
      throw dbError
    }
  } catch (error: any) {
    return createErrorResponse(error, 'Fout bij ophalen offertes', 500)
  }
}

// POST: Maak nieuwe offerte aanvraag
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const validatedData = quoteSchema.parse(body)

    // Maak offerte aan
    const quote = await prisma.quote.create({
      data: {
        userId: session?.user?.id || null,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        service: validatedData.service,
        description: validatedData.description,
        estimatedPrice: validatedData.estimatedPrice || null,
        status: 'pending',
      },
    })

    // Admin notification email
    try {
      await sendAdminNotificationEmail('quote', {
        customerName: validatedData.name,
        customerEmail: validatedData.email,
        service: validatedData.service,
        estimatedPrice: validatedData.estimatedPrice,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError)
      // Email fout mag offerte niet blokkeren
    }

    return NextResponse.json(
      { 
        success: true, 
        quote,
        message: 'Offerte aanvraag succesvol verzonden. We nemen zo snel mogelijk contact met je op.' 
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(error, 'Validatie fout', 400)
    }

    return createErrorResponse(error, 'Fout bij aanmaken offerte aanvraag', 500)
  }
}

