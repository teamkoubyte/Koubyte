import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendReviewRequestEmail } from '@/lib/email'

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

    // Haal huidige order op om te checken of status verandert naar completed
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { service: true }
        },
      },
    })

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order niet gevonden' }, { status: 404 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: { service: true }
        },
      },
    })

    // Als status wordt gewijzigd naar 'completed', verstuur review request email
    if (status === 'completed' && currentOrder.status !== 'completed') {
      try {
        const orderDate = new Date(order.createdAt).toLocaleDateString('nl-BE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

        const services = order.items.map((item: any) => item.serviceName)

        await sendReviewRequestEmail(order.customerEmail, {
          name: order.customerName,
          orderNumber: order.orderNumber,
          orderDate,
          services,
        })
      } catch (emailError) {
        console.error('Failed to send review request email:', emailError)
        // Email fout mag order update niet blokkeren
      }
    }

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

