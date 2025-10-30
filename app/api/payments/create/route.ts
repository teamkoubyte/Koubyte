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
      case 'klarna':
      case 'link':
      case 'applepay':
      case 'googlepay':
      case 'sepa_debit':
        // Stripe payment - roep direct aan
        const stripe = getStripeInstance()
        
        // Demo mode als Stripe niet geconfigureerd is
        if (!stripe) {
          console.log('Stripe API key niet geconfigureerd. Demo mode.')
          return NextResponse.json({
            paymentId: 'demo',
            paymentUrl: `/checkout/success?orderId=${orderId}&demo=true`,
            orderId,
            demo: true
          })
        }

        // Map payment methods naar Stripe payment method types
        const stripeMethodMap: Record<string, string[]> = {
          'bancontact': ['bancontact', 'card'],
          'creditcard': ['card'],
          'ideal': ['ideal', 'card'],
          'klarna': ['klarna'],
          'link': ['card', 'link'],
          'applepay': ['card'],  // Apple Pay wordt automatisch getoond
          'googlepay': ['card'], // Google Pay wordt automatisch getoond
          'sepa_debit': ['sepa_debit'],
        }

        const paymentMethodTypes = stripeMethodMap[method] || ['card']

        // Maak Stripe Checkout Session aan
        try {
          // Config voor wallets (Apple Pay / Google Pay)
          const sessionConfig: any = {
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
            },
          }

          // Voor Apple Pay en Google Pay: schakel automatische wallets in
          if (['applepay', 'googlepay'].includes(method)) {
            sessionConfig.payment_method_options = {
              card: {
                request_three_d_secure: 'automatic',
              },
            }
          }

          const checkoutSession = await stripe.checkout.sessions.create(sessionConfig)

          return NextResponse.json({
            paymentId: checkoutSession.id,
            paymentUrl: checkoutSession.url,
            orderId
          })
        } catch (stripeError: any) {
          console.error('Stripe session creation error:', stripeError)
          return NextResponse.json({
            error: 'Stripe payment creation failed',
            details: stripeError.message || String(stripeError)
          }, { status: 500 })
        }

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

