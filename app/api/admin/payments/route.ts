import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Haal alle betalingen op (admin only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const provider = searchParams.get('provider')

    // Build where clause
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }
    if (provider && provider !== 'all') {
      where.provider = provider
    }

    // Haal betalingen op
    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            customerEmail: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Bereken statistieken
    const allPayments = await prisma.payment.findMany()
    const stats = {
      total: allPayments.length,
      completed: allPayments.filter((p) => p.status === 'completed').length,
      pending: allPayments.filter((p) => ['pending', 'processing'].includes(p.status)).length,
      failed: allPayments.filter((p) => p.status === 'failed').length,
      totalAmount: allPayments.reduce((sum, p) => sum + p.amount, 0),
      completedAmount: allPayments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
    }

    return NextResponse.json({ payments, stats }, { status: 200 })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Fout bij ophalen betalingen' }, { status: 500 })
  }
}

