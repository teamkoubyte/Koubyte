import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAppointmentEmail, sendAdminNotificationEmail } from '@/lib/email'
import { z } from 'zod'
import { createErrorResponse } from '@/lib/api-error'

const appointmentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  date: z.string(),
  time: z.string(),
  service: z.string(),
  description: z.string().min(10),
})

// POST: Maak nieuwe afspraak
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = appointmentSchema.parse(body)

    // Check of er een sessie is
    const session = await getServerSession(authOptions)
    
    // Check voor conflicten (bestaande afspraak op zelfde datum/tijd)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: validatedData.date,
        time: validatedData.time,
        status: {
          not: 'cancelled', // Geannuleerde afspraken tellen niet mee
        },
      },
    })

    if (existingAppointment) {
      return NextResponse.json(
        { 
          error: 'Dit tijdslot is al bezet. Kies een andere datum of tijd.',
          conflict: true,
          existingAppointment: {
            date: existingAppointment.date,
            time: existingAppointment.time,
          }
        },
        { status: 409 }
      )
    }
    
    // Maak afspraak aan
    const appointmentData: any = {
      date: validatedData.date,
      time: validatedData.time,
      service: validatedData.service,
      description: validatedData.description,
    }
    
    // Add userId only if session exists
    if (session?.user?.id) {
      appointmentData.userId = session.user.id
    }
    
    const appointment = await prisma.appointment.create({
      data: appointmentData,
    })

    // Email versturen naar klant
    try {
      await sendAppointmentEmail(validatedData.email, {
        name: validatedData.name,
        date: validatedData.date,
        time: validatedData.time,
        service: validatedData.service,
        description: validatedData.description,
      })
    } catch (emailError) {
      console.error('Failed to send appointment email:', emailError)
    }

    // Admin notification email
    try {
      await sendAdminNotificationEmail('appointment', {
        customerName: validatedData.name,
        customerEmail: validatedData.email,
        date: validatedData.date,
        time: validatedData.time,
        service: validatedData.service,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError)
    }

    return NextResponse.json({ success: true, appointment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(error, 'Ongeldige gegevens', 400)
    }

    return createErrorResponse(error, 'Fout bij aanmaken afspraak', 500)
  }
}

// GET: Haal afspraken op (voor ingelogde gebruikers)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Niet geautoriseerd' },
        { status: 401 }
      )
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json({ appointments }, { status: 200 })
  } catch (error) {
    return createErrorResponse(error, 'Fout bij ophalen afspraken', 500)
  }
}
