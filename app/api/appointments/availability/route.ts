import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Check beschikbaarheid voor een specifieke datum
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Datum is verplicht' },
        { status: 400 }
      )
    }

    // Haal alle afspraken op voor deze datum (exclusief geannuleerde)
    const appointments = await prisma.appointment.findMany({
      where: {
        date: date,
        status: {
          not: 'cancelled',
        },
      },
      select: {
        time: true,
        status: true,
      },
    })

    // Alle mogelijke tijdslots
    const allTimeSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00',
    ]

    // Bepaal beschikbare tijdslots
    const bookedTimes = appointments.map(apt => apt.time)
    const availableSlots = allTimeSlots.filter(slot => !bookedTimes.includes(slot))

    return NextResponse.json({
      date,
      availableSlots,
      bookedSlots: bookedTimes,
      totalSlots: allTimeSlots.length,
      availableCount: availableSlots.length,
      bookedCount: bookedTimes.length,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Fout bij controleren beschikbaarheid' },
      { status: 500 }
    )
  }
}

