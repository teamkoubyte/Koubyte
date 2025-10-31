import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAdminNotificationEmail, sendRefundConfirmationEmail } from '@/lib/email'
import { createErrorResponse } from '@/lib/api-error'

// POST - Refund een betaling (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const body = await request.json()
    const { paymentId, reason } = body

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is verplicht' }, { status: 400 })
    }

    // Haal payment op
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Betaling niet gevonden' }, { status: 404 })
    }

    // Check of payment al refunded is
    if (payment.status === 'refunded') {
      return NextResponse.json({ error: 'Betaling is al terugbetaald' }, { status: 400 })
    }

    // Check of payment completed is
    if (payment.status !== 'completed') {
      return NextResponse.json({ 
        error: 'Alleen voltooide betalingen kunnen worden terugbetaald' 
      }, { status: 400 })
    }

    // Update payment status naar refunded
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'refunded',
      },
      include: {
        order: true,
      },
    })

    // Update order payment status als er een order is
    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: 'refunded',
        },
      })

      // Verstuur refund confirmation email naar klant
      try {
        // Haal order op voor email
        const order = await prisma.order.findUnique({
          where: { id: payment.orderId },
          select: { 
            customerEmail: true,
            customerName: true,
            orderNumber: true,
            paymentMethod: true,
          },
        })
        
        if (order && order.customerEmail) {
          await sendRefundConfirmationEmail(order.customerEmail, {
            name: order.customerName || 'Klant',
            orderNumber: order.orderNumber || payment.orderId || 'Onbekend',
            refundAmount: payment.amount,
            refundReason: reason || undefined,
            paymentMethod: order.paymentMethod || payment.method || 'Onbekend',
          })
        }
      } catch (emailError) {
        console.error('Failed to send refund email:', emailError)
        // Email fout mag refund niet blokkeren
      }
    }

    return NextResponse.json({ 
      message: 'Betaling succesvol terugbetaald',
      payment: updatedPayment 
    }, { status: 200 })
  } catch (error: any) {
    return createErrorResponse(error, 'Fout bij verwerken terugbetaling', 500)
  }
}

