import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Haal alle kortingscodes op (admin only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where: any = {}
    if (active !== null) {
      where.active = active === 'true'
    }

    const codes = await prisma.discountCode.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ codes }, { status: 200 })
  } catch (error) {
    console.error('Error fetching discount codes:', error)
    return NextResponse.json({ error: 'Fout bij ophalen kortingscodes' }, { status: 500 })
  }
}

// POST - Maak nieuwe kortingscode (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const body = await request.json()
    const { code, description, type, value, minAmount, maxUses, validFrom, validUntil, active } = body

    if (!code || !type || !value) {
      return NextResponse.json({ error: 'Code, type en waarde zijn verplicht' }, { status: 400 })
    }

    if (type !== 'percentage' && type !== 'fixed') {
      return NextResponse.json({ error: 'Type moet percentage of fixed zijn' }, { status: 400 })
    }

    // Check if code already exists
    const existing = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (existing) {
      return NextResponse.json({ error: 'Deze kortingscode bestaat al' }, { status: 400 })
    }

    const discountCode = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        description: description || null,
        type,
        value: parseFloat(value),
        minAmount: minAmount ? parseFloat(minAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: validUntil ? new Date(validUntil) : null,
        active: active !== false,
      },
    })

    return NextResponse.json({ code: discountCode }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating discount code:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Deze kortingscode bestaat al' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Fout bij aanmaken kortingscode' }, { status: 500 })
  }
}

// PATCH - Update kortingscode (admin only)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const body = await request.json()
    const { id, code, description, type, value, minAmount, maxUses, validFrom, validUntil, active } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is verplicht' }, { status: 400 })
    }

    const updateData: any = {}
    if (code !== undefined) updateData.code = code.toUpperCase()
    if (description !== undefined) updateData.description = description || null
    if (type !== undefined) updateData.type = type
    if (value !== undefined) updateData.value = parseFloat(value)
    if (minAmount !== undefined) updateData.minAmount = minAmount ? parseFloat(minAmount) : null
    if (maxUses !== undefined) updateData.maxUses = maxUses ? parseInt(maxUses) : null
    if (validFrom !== undefined) updateData.validFrom = validFrom ? new Date(validFrom) : new Date()
    if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null
    if (active !== undefined) updateData.active = active

    // Check if code already exists (if changed)
    if (code) {
      const existing = await prisma.discountCode.findFirst({
        where: {
          code: code.toUpperCase(),
          id: { not: id },
        },
      })

      if (existing) {
        return NextResponse.json({ error: 'Deze kortingscode bestaat al' }, { status: 400 })
      }
    }

    const updated = await prisma.discountCode.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ code: updated }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating discount code:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Deze kortingscode bestaat al' }, { status: 400 })
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Kortingscode niet gevonden' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Fout bij bijwerken kortingscode' }, { status: 500 })
  }
}

// DELETE - Verwijder kortingscode (admin only)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is verplicht' }, { status: 400 })
    }

    await prisma.discountCode.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Kortingscode succesvol verwijderd' }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting discount code:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Kortingscode niet gevonden' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Fout bij verwijderen kortingscode' }, { status: 500 })
  }
}

