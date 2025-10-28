import { NextResponse } from 'next/server'

// Mollie payment provider - Currently disabled
// Using Stripe instead. To enable Mollie:
// 1. Install: npm install @mollie/api-client --legacy-peer-deps
// 2. Add MOLLIE_API_KEY to .env
// 3. Uncomment the code below

export async function POST(request: Request) {
  return NextResponse.json({
    error: 'Mollie payment provider not configured. Using Stripe instead.',
    success: false
  }, { status: 501 })
}
