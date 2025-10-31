import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createErrorResponse } from '@/lib/api-error'

// GET - Haal alle gebruikers op
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    return createErrorResponse(error, 'Fout bij ophalen gebruikers', 500)
  }
}

// PATCH - Update gebruiker rol
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, role } = await request.json()

    // Voorkom dat admin zichzelf degradeert
    if (id === session.user.id && role !== 'admin') {
      return NextResponse.json({ error: 'Je kunt je eigen admin rol niet verwijderen' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true,
            orders: true,
          },
        },
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return createErrorResponse(error, 'Fout bij updaten gebruiker', 500)
  }
}

// DELETE - Verwijder gebruiker
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is verplicht' }, { status: 400 })
    }

    // Voorkom dat admin zichzelf verwijdert
    if (id === session.user.id) {
      return NextResponse.json({ error: 'Je kunt jezelf niet verwijderen' }, { status: 400 })
    }

    // Controleer of user bestaat
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (!user) {
      return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 })
    }

    // Verwijder in correcte volgorde in een transactie (database-agnostisch)
    await prisma.$transaction(async (tx) => {
      // Order gerelateerde items
      await tx.orderItem.deleteMany({ where: { order: { userId: id } } })
      await tx.order.deleteMany({ where: { userId: id } })

      // Overige entiteiten die naar user verwijzen
      await tx.cartItem.deleteMany({ where: { userId: id } })
      await tx.appointment.deleteMany({ where: { userId: id } })
      await tx.review.deleteMany({ where: { userId: id } })
      await tx.quote.deleteMany({ where: { userId: id } })
      await tx.session.deleteMany({ where: { userId: id } })
      await tx.account.deleteMany({ where: { userId: id } })

      // Tenslotte de gebruiker
      await tx.user.delete({ where: { id } })
    })

    return NextResponse.json({ success: true, message: 'Gebruiker succesvol verwijderd' })
  } catch (error: any) {
    return createErrorResponse(error, 'Fout bij verwijderen gebruiker', 500)
  }
}

