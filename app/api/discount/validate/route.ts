import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Validate discount code
export async function POST(request: Request) {
  try {
    const { code, totalAmount } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Geen kortingscode opgegeven' }, { status: 400 })
    }

    // Find discount code
    const discount = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!discount) {
      return NextResponse.json({ error: 'Ongeldige kortingscode' }, { status: 404 })
    }

    // Check if active
    if (!discount.active) {
      return NextResponse.json({ error: 'Deze kortingscode is niet meer actief' }, { status: 400 })
    }

    // Check validity period
    const now = new Date()
    if (discount.validFrom && new Date(discount.validFrom) > now) {
      return NextResponse.json({ error: 'Deze kortingscode is nog niet geldig' }, { status: 400 })
    }
    if (discount.validUntil && new Date(discount.validUntil) < now) {
      return NextResponse.json({ error: 'Deze kortingscode is verlopen' }, { status: 400 })
    }

    // Check max uses
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return NextResponse.json({ error: 'Deze kortingscode is op' }, { status: 400 })
    }

    // Check minimum amount
    if (discount.minAmount && totalAmount < discount.minAmount) {
      return NextResponse.json({ 
        error: `Minimum bestelbedrag van €${discount.minAmount.toFixed(2)} vereist` 
      }, { status: 400 })
    }

    // Calculate discount amount
    let discountAmount = 0
    if (discount.type === 'percentage') {
      discountAmount = (totalAmount * discount.value) / 100
    } else if (discount.type === 'fixed') {
      discountAmount = discount.value
    }

    // Don't discount more than the total
    discountAmount = Math.min(discountAmount, totalAmount)

    return NextResponse.json({
      valid: true,
      code: discount.code,
      description: discount.description,
      type: discount.type,
      value: discount.value,
      discountAmount,
      finalAmount: totalAmount - discountAmount
    })
  } catch (error: any) {
    console.error('Error validating discount code:', error)
    return NextResponse.json({ 
      error: 'Fout bij valideren kortingscode',
      details: error.message 
    }, { status: 500 })
  }
}

