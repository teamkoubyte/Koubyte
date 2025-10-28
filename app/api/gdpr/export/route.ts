import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GDPR Data Export - Artikel 15 & 20
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Verzamel alle gegevens van de gebruiker
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const appointments = await prisma.appointment.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        date: true,
        time: true,
        service: true,
        description: true,
        status: true,
        createdAt: true,
      },
    })

    // GDPR compliant data export
    const exportData = {
      exportDate: new Date().toISOString(),
      exportReason: 'GDPR Data Subject Access Request (Artikel 15 & 20)',
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        accountCreated: user?.createdAt,
        lastUpdated: user?.updatedAt,
      },
      appointments: appointments.map(apt => ({
        id: apt.id,
        date: apt.date,
        time: apt.time,
        service: apt.service,
        description: apt.description,
        status: apt.status,
        createdAt: apt.createdAt,
      })),
      dataRetentionPolicy: {
        appointments: '7 jaar (wettelijke verplichting voor facturen)',
        contactMessages: '1 jaar na laatste contact',
        accountData: 'Tot account verwijdering',
      },
      yourRights: [
        'Recht op inzage (Artikel 15)',
        'Recht op rectificatie (Artikel 16)',
        'Recht op verwijdering (Artikel 17)',
        'Recht op beperking (Artikel 18)',
        'Recht op overdraagbaarheid (Artikel 20)',
        'Recht van bezwaar (Artikel 21)',
      ],
      contact: {
        email: 'info@koubyte.be',
        phone: '+32 484 52 26 62',
        privacyPolicy: 'https://koubyte.be/privacy',
      },
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error('GDPR Export Error:', error)
    return NextResponse.json({ error: 'Export mislukt' }, { status: 500 })
  }
}

