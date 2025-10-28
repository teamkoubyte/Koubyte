import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    // Next.js 16: params is now a Promise
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            service: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order niet gevonden' }, { status: 404 })
    }

    // Check if user owns this order or is admin
    if (order.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang tot deze order' }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het ophalen van de order' },
      { status: 500 }
    )
  }
}

