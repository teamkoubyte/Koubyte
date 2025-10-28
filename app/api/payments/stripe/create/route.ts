import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Stripe wordt alleen geïnitialiseerd als er een API key is
function getStripeInstance() {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey || apiKey.includes('your_stripe_secret_key') || apiKey.includes('sk_test_') === false && apiKey.includes('sk_live_') === false) {
    return null
  }
  
  const Stripe = require('stripe')
  return new Stripe(apiKey, {
    apiVersion: '2024-11-20.acacia',
  })
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, amount, method } = body

    if (!orderId || !amount || !method) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens' },
        { status: 400 }
      )
    }

    const stripe = getStripeInstance()

    // Demo mode als Stripe niet geconfigureerd is
    if (!stripe) {
      console.log('Stripe API key niet geconfigureerd. Demo mode.')
      return NextResponse.json({
        success: true,
        demo: true,
        message: 'Stripe API key niet geconfigureerd. Dit is een demo betaling.',
        redirectUrl: `/checkout/success?orderId=${orderId}&demo=true`
      })
    }

    // Map payment methods naar Stripe payment method types
    const stripeMethodMap: Record<string, string[]> = {
      'bancontact': ['bancontact'],
      'creditcard': ['card'],
      'ideal': ['ideal'],
    }

    const paymentMethodTypes = stripeMethodMap[method] || ['card']

    // Maak Stripe Checkout Session aan
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Koubyte Order ${orderId}`,
              description: 'IT-diensten',
            },
            unit_amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?canceled=true`,
      metadata: {
        orderId,
        userId: session.user.id,
      },
      customer_email: session.user.email || undefined,
    })

    // Update order met payment session ID
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus: 'pending',
      }
    })

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      redirectUrl: checkoutSession.url
    })
  } catch (error) {
    console.error('Stripe payment creation error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het aanmaken van de betaling' },
      { status: 500 }
    )
  }
}

