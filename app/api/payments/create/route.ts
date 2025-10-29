import { NextResponse } from 'next/server'
// Database wordt later toegevoegd
// import { prisma } from '@/lib/prisma'

// Stripe wordt alleen geïnitialiseerd als er een API key is
function getStripeInstance() {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey || apiKey.includes('your_stripe_secret_key')) {
    return null
  }
  
  // Dynamisch importeren om runtime errors te voorkomen
  const Stripe = require('stripe')
  return new Stripe(apiKey, {
    apiVersion: '2024-11-20.acacia',
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, service, method } = body

    if (!amount || !service || !method) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens' },
        { status: 400 }
      )
    }

    // Genereer order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Simuleer payment record (database wordt later toegevoegd)
    const payment = {
      id: `PAY-${Date.now()}`,
      orderId,
      amount: parseFloat(amount),
      provider: method
    }

    // Provider-specifieke logica
    switch (method) {
      case 'bancontact':
      case 'creditcard':
      case 'ideal':
        // Stripe payment - call Stripe create endpoint
        const stripeResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/payments/stripe/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount, method })
        })
        
        if (!stripeResponse.ok) {
          const stripeError = await stripeResponse.json()
          console.error('Stripe payment creation failed:', stripeError)
          return NextResponse.json({
            error: stripeError.error || 'Stripe payment creation failed',
            details: stripeError.details || 'Unknown Stripe error'
          }, { status: 500 })
        }
        
        const stripeData = await stripeResponse.json()
        return NextResponse.json({
          paymentId: stripeData.sessionId,
          paymentUrl: stripeData.redirectUrl,
          orderId,
          demo: stripeData.demo
        })

      case 'paypal':
        // PayPal SDK
        return NextResponse.json({
          paymentId: payment.id,
          paymentUrl: `/api/payments/paypal/create?orderId=${orderId}&amount=${amount}`,
          orderId
        })

      case 'klarna':
        // Klarna integration
        return NextResponse.json({
          paymentId: payment.id,
          paymentUrl: `/api/payments/klarna/create?orderId=${orderId}&amount=${amount}`,
          orderId
        })

      case 'crypto':
        // Crypto payment
        return NextResponse.json({
          paymentId: payment.id,
          paymentUrl: `/api/payments/crypto/create?orderId=${orderId}&amount=${amount}`,
          orderId
        })

      case 'sepa':
      case 'sepa-direct':
        // SEPA bank transfer
        return NextResponse.json({
          paymentId: payment.id,
          paymentUrl: `/api/payments/sepa/create?orderId=${orderId}&amount=${amount}`,
          orderId
        })

      default:
        return NextResponse.json(
          { error: 'Onbekende betaalmethode' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { 
        error: 'Er ging iets mis bij het aanmaken van de betaling',
        details: error.message || String(error)
      },
      { status: 500 }
    )
  }
}

