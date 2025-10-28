import { NextResponse } from 'next/server'

// Mollie webhook - Currently disabled
// Using Stripe webhooks instead

export async function POST(request: Request) {
  return NextResponse.json({
    error: 'Mollie webhooks not configured. Using Stripe webhooks instead.',
    success: false
  }, { status: 501 })
}
