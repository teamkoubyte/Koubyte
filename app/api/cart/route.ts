import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Haal winkelwagentje op
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ cartItems }, { status: 200 })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Fout bij ophalen winkelwagentje' }, { status: 500 })
  }
}

// POST - Voeg item toe aan winkelwagentje
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Je moet ingelogd zijn om items toe te voegen' }, { status: 401 })
    }

    const { serviceId, quantity = 1 } = await request.json()

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is verplicht' }, { status: 400 })
    }

    // Check if service exists and is active
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service || !service.active) {
      return NextResponse.json({ error: 'Dienst niet gevonden of niet beschikbaar' }, { status: 404 })
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_serviceId: {
          userId: session.user.id,
          serviceId,
        },
      },
    })

    if (existingItem) {
      // Update quantity
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              slug: true,
              image: true,
            },
          },
        },
      })
      return NextResponse.json({ cartItem: updated, message: 'Aantal bijgewerkt' }, { status: 200 })
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        serviceId,
        quantity,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
          },
        },
      },
    })

    return NextResponse.json({ cartItem, message: 'Toegevoegd aan winkelwagentje' }, { status: 201 })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Fout bij toevoegen aan winkelwagentje' }, { status: 500 })
  }
}

// DELETE - Verwijder item uit winkelwagentje
export async function DELETE(request: Request) {
  try {
    console.log('DELETE /api/cart - Start')
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('DELETE /api/cart - Not logged in')
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('id')
    console.log('DELETE /api/cart - Cart item ID:', cartItemId)

    if (!cartItemId) {
      console.log('DELETE /api/cart - No cart item ID provided')
      return NextResponse.json({ error: 'Cart item ID is verplicht' }, { status: 400 })
    }

    // Verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    })
    console.log('DELETE /api/cart - Found cart item:', cartItem ? 'Yes' : 'No')

    if (!cartItem) {
      console.log('DELETE /api/cart - Cart item not found in database')
      return NextResponse.json({ error: 'Item niet gevonden in database' }, { status: 404 })
    }

    if (cartItem.userId !== session.user.id) {
      console.log('DELETE /api/cart - Ownership mismatch')
      return NextResponse.json({ error: 'Je bent niet de eigenaar van dit item' }, { status: 403 })
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    })
    console.log('DELETE /api/cart - Item deleted successfully')

    return NextResponse.json({ message: 'Verwijderd uit winkelwagentje' }, { status: 200 })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json({ 
      error: 'Fout bij verwijderen', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// PATCH - Update quantity
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { cartItemId, quantity } = await request.json()

    if (!cartItemId || quantity < 1) {
      return NextResponse.json({ error: 'Ongeldige gegevens' }, { status: 400 })
    }

    // Verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    })

    if (!cartItem || cartItem.userId !== session.user.id) {
      return NextResponse.json({ error: 'Item niet gevonden' }, { status: 404 })
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
          },
        },
      },
    })

    return NextResponse.json({ cartItem: updated }, { status: 200 })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json({ error: 'Fout bij bijwerken' }, { status: 500 })
  }
}

