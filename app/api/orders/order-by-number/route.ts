import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createErrorResponse } from '@/lib/api-error'

// GET - Get order by order number (for review page)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')

    if (!orderNumber) {
      return NextResponse.json({ error: 'Ordernummer is verplicht' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: { service: true }
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order niet gevonden' }, { status: 404 })
    }

    // Alleen basis order info teruggeven (geen gevoelige data)
    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        items: order.items.map((item: any) => ({
          serviceName: item.serviceName,
          quantity: item.quantity,
        })),
      },
    }, { status: 200 })
  } catch (error) {
    return createErrorResponse(error, 'Fout bij ophalen order', 500)
  }
}

