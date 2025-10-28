import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount') || '0.00'

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID verplicht' }, { status: 400 })
    }

    // Check of PayPal is geconfigureerd
    const paypalClientId = process.env.PAYPAL_CLIENT_ID
    const paypalSecret = process.env.PAYPAL_CLIENT_SECRET
    
    if (!paypalClientId || paypalClientId.includes('your_paypal') || !paypalSecret) {
      // Demo mode - toon demo PayPal checkout
      const demoUrl = `https://www.sandbox.paypal.com/checkoutnow?token=DEMO-${orderId}&amount=${amount}`
      return NextResponse.redirect(demoUrl)
    }

    // PayPal API integratie (je moet PayPal SDK configureren)
    // TODO: Implementeer echte PayPal API call hier
    const paypalData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId,
        amount: {
          currency_code: 'EUR',
          value: amount
        }
      }]
    }

    // In productie: maak een echte PayPal order
    const mockApprovalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=mock-token-${orderId}`
    return NextResponse.redirect(mockApprovalUrl)
  } catch (error) {
    return NextResponse.json(
      { error: 'Er ging iets mis bij PayPal' },
      { status: 500 }
    )
  }
}

