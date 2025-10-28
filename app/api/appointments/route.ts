import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

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

    // Email versturen (optioneel, als geconfigureerd)
    try {
      // await sendAppointmentEmail(validatedData.email, {
      //   name: validatedData.name,
      //   date: validatedData.date,
      //   time: validatedData.time,
      //   service: validatedData.service,
      // })
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
    }

    return NextResponse.json({ success: true, appointment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens' },
        { status: 400 }
      )
    }

    console.error('Appointment error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
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
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
  }
}
