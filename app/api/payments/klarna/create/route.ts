import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount') || '0.00'

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID verplicht' }, { status: 400 })
    }

    // Check of Klarna is geconfigureerd
    const klarnaUsername = process.env.KLARNA_USERNAME
    const klarnaPassword = process.env.KLARNA_PASSWORD
    
    if (!klarnaUsername || klarnaUsername.includes('your_klarna') || !klarnaPassword) {
      // Demo mode - toon demo Klarna checkout
      const demoUrl = `https://playground.klarna.com/checkout/v3/orders/mock-${orderId}?amount=${amount}`
      return NextResponse.redirect(demoUrl)
    }

    // Klarna API integratie (je moet Klarna SDK configureren)
    // TODO: Implementeer echte Klarna API call hier
    const mockApprovalUrl = `https://playground.klarna.com/checkout/v3/orders/mock-${orderId}`
    return NextResponse.redirect(mockApprovalUrl)
  } catch (error) {
    return NextResponse.json(
      { error: 'Er ging iets mis bij Klarna' },
      { status: 500 }
    )
  }
}

