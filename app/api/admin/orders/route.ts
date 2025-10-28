import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all orders (admin only)
export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      completed: orders.filter(o => o.status === 'completed').length,
      revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    }

    return NextResponse.json({ orders, stats }, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Fout bij ophalen bestellingen' }, { status: 500 })
  }
}

// PATCH - Update order status (admin only)
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  try {
    const { orderId, status, paymentStatus } = await request.json()

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    })

    return NextResponse.json({ order }, { status: 200 })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Fout bij bijwerken bestelling' }, { status: 500 })
  }
}

// DELETE - Delete order (admin only)
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is verplicht' }, { status: 400 })
    }

    // Verwijder de bestelling (cascade deletes items automatisch)
    await prisma.order.delete({
      where: { id: orderId },
    })

    return NextResponse.json({ message: 'Bestelling succesvol verwijderd' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Fout bij verwijderen bestelling' }, { status: 500 })
  }
}

