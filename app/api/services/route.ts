import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createErrorResponse } from '@/lib/api-error'

// GET - Alle services ophalen
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [
        { featured: 'desc' },
        { category: 'asc' },
        { price: 'asc' },
      ],
    })

    return NextResponse.json({ services }, { status: 200 })
  } catch (error) {
    return createErrorResponse(error, 'Fout bij ophalen diensten', 500)
  }
}

// POST - Nieuwe service aanmaken (alleen admin)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check admin rechten
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, price, duration, category, featured } = body

    // Validatie
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Naam, beschrijving, prijs en categorie zijn verplicht' },
        { status: 400 }
      )
    }

    // Service aanmaken
    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: duration || null,
        category,
        featured: featured || false,
      },
    })

    return NextResponse.json({ 
      service,
      message: 'Service succesvol aangemaakt' 
    }, { status: 201 })
  } catch (error) {
    return createErrorResponse(error, 'Fout bij aanmaken service', 500)
  }
}

