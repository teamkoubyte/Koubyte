import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAdminNotificationEmail } from '@/lib/email'
import { z } from 'zod'

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
  } catch (error: any) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Fout bij ophalen offertes' },
      { status: 500 }
    )
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
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Fout bij aanmaken offerte aanvraag' },
      { status: 500 }
    )
  }
}

