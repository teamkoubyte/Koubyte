import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Create new order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { notes, paymentMethod } = await request.json()

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { service: true },
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Winkelwagentje is leeg' }, { status: 400 })
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.service.price * item.quantity)
    }, 0)

    // Generate order number
    const orderCount = await prisma.order.count()
    const orderNumber = `KOU-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`

    // Create order
    const now = new Date()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        totalAmount,
        status: 'pending',
        paymentMethod: paymentMethod || 'bancontact',
        paymentStatus: 'unpaid',
        customerName: session.user.name || '',
        customerEmail: session.user.email || '',
        customerPhone: '', // Could be fetched from user profile
        notes,
        createdAt: now,
        updatedAt: now,
        items: {
          create: cartItems.map((item) => ({
            serviceId: item.serviceId,
            serviceName: item.service.name,
            price: item.service.price,
            quantity: item.quantity,
            createdAt: now,
          })),
        },
      },
      include: {
        items: {
          include: { service: true },
        },
      },
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ 
      message: 'Bestelling geplaatst', 
      order,
      id: order.id,
      orderNumber 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json({ 
      error: 'Fout bij plaatsen bestelling',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

// GET - Get user's orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { service: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Fout bij ophalen bestellingen' }, { status: 500 })
  }
}

