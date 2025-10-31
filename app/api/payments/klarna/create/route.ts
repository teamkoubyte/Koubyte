import { NextResponse } from 'next/server'
import { createErrorResponse } from '@/lib/api-error'

/**
 * Klarna Payment Route
 * 
 * Let op: Klarna is al beschikbaar via Stripe Checkout (Klarna optie).
 * Deze route kan gebruikt worden voor directe Klarna integratie.
 * 
 * Om Klarna volledig te configureren:
 * 1. Maak een Klarna Merchant account aan (https://www.klarna.com/nl/merchants/)
 * 2. Verkrijg API credentials van Klarna
 * 3. Voeg toe aan Vercel environment variables:
 *    - KLARNA_USERNAME
 *    - KLARNA_PASSWORD
 * 4. Installeer Klarna SDK: npm install klarna-api-node
 * 
 * Of gebruik Stripe Checkout met Klarna optie (aanbevolen).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount') || '0.00'

    if (!orderId) {
      return createErrorResponse(null, 'Order ID is verplicht', 400)
    }

    // Check of Klarna is geconfigureerd
    const klarnaUsername = process.env.KLARNA_USERNAME
    const klarnaPassword = process.env.KLARNA_PASSWORD
    
    if (!klarnaUsername || klarnaUsername.includes('your_klarna') || !klarnaPassword || klarnaPassword.includes('your_klarna')) {
      // Klarna niet geconfigureerd - gebruik Stripe in plaats daarvan
      return NextResponse.json({ 
        error: 'Klarna is niet geconfigureerd',
        message: 'Gebruik Stripe Checkout met Klarna optie in plaats daarvan. Klarna is beschikbaar via Stripe.',
        useStripe: true,
        stripeUrl: `/api/payments/create?orderId=${orderId}&amount=${amount}&method=klarna`
      }, { status: 501 })
    }

    // TODO: Implementeer volledige Klarna Checkout SDK integratie
    // Voor nu: gebruik Stripe met Klarna optie
    return NextResponse.json({ 
      error: 'Klarna directe integratie nog niet geïmplementeerd',
      message: 'Gebruik Stripe Checkout met Klarna optie in plaats daarvan.',
      useStripe: true,
      stripeUrl: `/api/payments/create?orderId=${orderId}&amount=${amount}&method=klarna`
    }, { status: 501 })

  } catch (error) {
    return createErrorResponse(error, 'Fout bij Klarna betaling', 500)
  }
}

