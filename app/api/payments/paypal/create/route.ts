import { NextResponse } from 'next/server'
import { createErrorResponse } from '@/lib/api-error'

/**
 * PayPal Payment Route
 * 
 * Let op: PayPal is al beschikbaar via Stripe Checkout (PayPal optie).
 * Deze route kan gebruikt worden voor directe PayPal integratie.
 * 
 * Om PayPal volledig te configureren:
 * 1. Maak een PayPal Business account aan
 * 2. Ga naar PayPal Developer Dashboard (https://developer.paypal.com/)
 * 3. Maak een nieuwe app aan en kopieer Client ID en Secret
 * 4. Voeg toe aan Vercel environment variables:
 *    - PAYPAL_CLIENT_ID
 *    - PAYPAL_CLIENT_SECRET
 * 5. Installeer PayPal SDK: npm install @paypal/checkout-server-sdk
 * 
 * Of gebruik Stripe Checkout met PayPal optie (aanbevolen).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount') || '0.00'

    if (!orderId) {
      return createErrorResponse(null, 'Order ID is verplicht', 400)
    }

    // Check of PayPal is geconfigureerd
    const paypalClientId = process.env.PAYPAL_CLIENT_ID
    const paypalSecret = process.env.PAYPAL_CLIENT_SECRET
    
    if (!paypalClientId || paypalClientId.includes('your_paypal') || !paypalSecret || paypalSecret.includes('your_paypal')) {
      // PayPal niet geconfigureerd - gebruik Stripe in plaats daarvan
      return NextResponse.json({ 
        error: 'PayPal is niet geconfigureerd',
        message: 'Gebruik Stripe Checkout met PayPal optie in plaats daarvan. PayPal is beschikbaar via Stripe.',
        useStripe: true,
        stripeUrl: `/api/payments/create?orderId=${orderId}&amount=${amount}&method=paypal`
      }, { status: 501 })
    }

    // TODO: Implementeer volledige PayPal Checkout SDK integratie
    // Voor nu: gebruik Stripe met PayPal optie
    return NextResponse.json({ 
      error: 'PayPal directe integratie nog niet geïmplementeerd',
      message: 'Gebruik Stripe Checkout met PayPal optie in plaats daarvan.',
      useStripe: true,
      stripeUrl: `/api/payments/create?orderId=${orderId}&amount=${amount}&method=paypal`
    }, { status: 501 })

  } catch (error) {
    return createErrorResponse(error, 'Fout bij PayPal betaling', 500)
  }
}

