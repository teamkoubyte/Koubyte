import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type RouteParams = {
  params: Promise<{ id: string }>
}

// GET - Enkele service ophalen
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    
    const service = await prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      return NextResponse.json({ error: 'Service niet gevonden' }, { status: 404 })
    }

    return NextResponse.json({ service }, { status: 200 })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ error: 'Fout bij ophalen service' }, { status: 500 })
  }
}

// PATCH - Service bijwerken (alleen admin)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check admin rechten
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, description, price, duration, category, featured } = body

    // Check of service bestaat
    const existingService = await prisma.service.findUnique({
      where: { id },
    })

    if (!existingService) {
      return NextResponse.json({ error: 'Service niet gevonden' }, { status: 404 })
    }

    // Service updaten
    const service = await prisma.service.update({
      where: { id },
      data: {
        name: name || existingService.name,
        description: description || existingService.description,
        price: price ? parseFloat(price) : existingService.price,
        duration: duration !== undefined ? duration : existingService.duration,
        category: category || existingService.category,
        featured: featured !== undefined ? featured : existingService.featured,
      },
    })

    return NextResponse.json({ 
      service,
      message: 'Service succesvol bijgewerkt' 
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Fout bij bijwerken service' }, { status: 500 })
  }
}

// DELETE - Service verwijderen (alleen admin)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check admin rechten
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const { id } = await params

    // Check of service bestaat
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            cartItems: true,
            orderItems: true,
          }
        }
      },
    })

    if (!existingService) {
      return NextResponse.json({ error: 'Service niet gevonden' }, { status: 404 })
    }

    // Check of service in gebruik is (via _count)
    if (existingService._count.orderItems > 0) {
      return NextResponse.json({ 
        error: 'Service kan niet verwijderd worden omdat er bestellingen mee geplaatst zijn' 
      }, { status: 400 })
    }

    // Prisma cascade delete zorgt automatisch voor cart items cleanup
    // Maar we doen het expliciet voor de zekerheid
    if (existingService._count.cartItems > 0) {
      await prisma.cartItem.deleteMany({
        where: { serviceId: id },
      })
    }

    // Service verwijderen
    await prisma.service.delete({
      where: { id },
    })

    return NextResponse.json({ 
      message: 'Service succesvol verwijderd' 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting service:', error)
    
    // Specifieke error handling
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: 'Service kan niet verwijderd worden omdat deze nog in gebruik is' 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Fout bij verwijderen service: ' + (error.message || 'Onbekende fout')
    }, { status: 500 })
  }
}

