import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createErrorResponse } from '@/lib/api-error'

// GET - Haal alle betalingen op van de ingelogde gebruiker
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Haal betalingen op
    const payments = await prisma.payment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        order: {
          select: {
            orderNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ payments }, { status: 200 })
  } catch (error) {
    return createErrorResponse(error, 'Fout bij ophalen betalingen', 500)
  }
}

