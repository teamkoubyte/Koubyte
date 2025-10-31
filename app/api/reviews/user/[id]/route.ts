import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createErrorResponse } from '@/lib/api-error'

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).optional(),
  service: z.string().min(2).optional(),
})

// PATCH - Update review van ingelogde gebruiker
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateReviewSchema.parse(body)

    // Check of review van deze gebruiker is
    const review = await prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review niet gevonden' }, { status: 404 })
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    // Update review (reset approved status omdat review is gewijzigd)
    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(validatedData.rating && { rating: validatedData.rating }),
        ...(validatedData.comment && { comment: validatedData.comment }),
        ...(validatedData.service && { service: validatedData.service }),
        approved: false, // Reset approved status na wijziging
      },
    })

    return NextResponse.json({ review: updated }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(error, 'Validatie fout', 400)
    }

    return createErrorResponse(error, 'Fout bij updaten review', 500)
  }
}

// DELETE - Verwijder review van ingelogde gebruiker
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { id } = await params

    // Check of review van deze gebruiker is
    const review = await prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review niet gevonden' }, { status: 404 })
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    await prisma.review.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Review succesvol verwijderd' }, { status: 200 })
  } catch (error) {
    return createErrorResponse(error, 'Fout bij verwijderen review', 500)
  }
}

