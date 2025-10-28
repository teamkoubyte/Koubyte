import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GDPR Right to Erasure - Artikel 17
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Check voor openstaande facturen (wettelijke bewaarplicht 7 jaar)
    const recentAppointments = await prisma.appointment.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 365 * 24 * 60 * 60 * 1000), // 7 jaar
        },
      },
    })

    if (recentAppointments.length > 0) {
      // Anonimiseer i.p.v. volledig verwijderen (wettelijke verplichting)
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: '[Verwijderd]',
          email: `deleted-${session.user.id}@koubyte.be`,
        },
      })

      // Verwijder sessies
      await prisma.session.deleteMany({
        where: { userId: session.user.id },
      })

      return NextResponse.json({ 
        message: 'Account geanonimiseerd',
        note: 'Afspraakgegevens worden 7 jaar bewaard volgens wettelijke verplichting',
      })
    } else {
      // Volledig verwijderen als geen recente afspraken
      await prisma.appointment.deleteMany({
        where: { userId: session.user.id },
      })

      await prisma.session.deleteMany({
        where: { userId: session.user.id },
      })

      await prisma.account.deleteMany({
        where: { userId: session.user.id },
      })

      await prisma.user.delete({
        where: { id: session.user.id },
      })

      return NextResponse.json({ message: 'Account volledig verwijderd' })
    }
  } catch (error) {
    console.error('GDPR Delete Error:', error)
    return NextResponse.json({ error: 'Verwijdering mislukt' }, { status: 500 })
  }
}

