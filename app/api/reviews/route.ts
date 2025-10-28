import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10),
  service: z.string().min(2),
  userId: z.string().optional(),
})

// POST - Create new review
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    const review = await prisma.review.create({
      data: {
        name: validatedData.name,
        rating: validatedData.rating,
        comment: validatedData.comment,
        service: validatedData.service,
        userId: validatedData.userId || null,
        approved: false, // Moet eerst goedgekeurd worden
      },
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens' },
        { status: 400 }
      )
    }

    console.error('Review error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
  }
}

// GET - Get approved reviews
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        rating: true,
        comment: true,
        service: true,
        createdAt: true,
      },
    })

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0'

    return NextResponse.json({
      reviews,
      stats: {
        total: reviews.length,
        averageRating: parseFloat(avgRating),
      },
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
  }
}

